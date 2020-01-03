import xlsxwriter
import io
import xml.etree.ElementTree as ET
import requests
import datetime
from pydash.objects import pick, assign
from pydash.predicates import is_blank
from .mssql_db import execute_sp, get_sp_result_set, get_out_arg
from uma_dwh.utils import is_float, is_int, is_datetime, list_chunks
from .utils import execute_sp_with_required_in_args
from .exceptions import DBException, DBValidationException, SPException
from .utils import execute_admin_console_sp

LATEST_COHORTS_DATA_URL = 'https://ed-public-download.app.cloud.gov/downloads/Most-Recent-Cohorts-All-Data-Elements.csv'
LATEST_FIELDS_OF_STUDY_DATA_URL = 'https://ed-public-download.app.cloud.gov/downloads/Most-Recent-Field-Data-Elements.csv'
cell_width_padding = 4
max_cell_width = 65535


def get_columns_xml(columns, prepend_default=False):
    """ Returns the columns xml for the list of specified columns. """
    xml = '<COLUMNS>'

    if prepend_default:
        xml += f'<COL N="INSTNM" />'
        xml += f'<COL N="OPEID" />'

    for col in columns:
        xml += f'<COL N="{col}" />'

    xml += '</COLUMNS>'

    return xml


def get_columns_from_xml(xml):
    """ Returns the list of columns from an xml string. """
    tree = ET.ElementTree(ET.fromstring(xml))
    root = tree.getroot()
    columns = []

    for col in root:
        columns.append(col.attrib['N'])

    return columns


def report_exists(user_id, report_name):
    """ Checks the report exists. """
    results = execute_sp_with_required_in_args(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'CHECK_IF_REPORT_NAME_EXISTS',
        str(user_id),
        report_name.upper()
    )

    result = get_sp_result_set(results)

    return len(result) > 0


def fetch_report(user_id, report_name):
    """ Fetches a report for the specified user and report name. """
    result = fetch_reports(user_id)
    report = None

    for row in result:
        if row['report_name'].upper() == report_name.upper():
            report = row
            break

    if not report:
        return None

    if 'xml_data' in report:
        report['columns'] = get_columns_from_xml(report['xml_data'])
        del report['xml_data']

    return report


def fetch_report_by_id(id_, user_id, report_name=''):
    results = execute_sp_with_required_in_args(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'GET REPORT',
        str(id_),
        report_name.upper(),
        str(user_id)
    )

    result = get_sp_result_set(results)

    if len(result) < 1:
        return None

    report = result[0]

    if 'xml_data' in report:
        report['columns'] = get_columns_from_xml(report['xml_data'])
        del report['xml_data']

    return report


def fetch_reports(user_id):
    """ Fetches the reports for the specified user. """
    results = execute_sp_with_required_in_args(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'GET USER REPORTS',
        str(user_id)
    )

    return get_sp_result_set(results)


def create_report(data):
    """
    Creates a report and returns the report's information.
    :param data: Report data
    :type data: dict
    """
    if not is_blank(data['report_name']) and report_exists(data['user_id'], data['report_name']):
        raise DBValidationException(f"The report \"{data['report_name']}\" already exists.", 'report_name')

    required_data = {
        'user_id': data['user_id'],
        'report_name': '',
        'report_descrip': '',
        'share_dttm': '',
        'columns': []
    }

    new_data = assign(
        required_data,
        pick(
            data,
            'report_name',
            'report_descrip',
            'share_dttm',
            'columns'
        )
    )

    if len(new_data['columns']) < 1:
        raise DBException(f'"columns" are required.')

    execute_sp_with_required_in_args(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'SAVE USER SELECTION',
        new_data['user_id'],
        new_data['report_name'].upper(),
        new_data['report_descrip'],
        new_data['share_dttm'],
        get_columns_xml(new_data['columns'])
    )

    return fetch_report(new_data['user_id'], new_data['report_name'])


def update_report(data):
    """
    Updates a report and returns the report's information.
    :param data: New report data
    :type data: dict
    """
    report = fetch_report(data['user_id'], data['report_name'])
    if report is None:
        raise DBValidationException(f'The report is invalid.', 'report_name')

    current_data = {
        'user_id': data['user_id'],
        'report_name': report['report_name'],
        'report_descrip': report['report_descrip'],
        'share_dttm': report['share_dttm'],
        'columns': []
    }

    new_data = assign(
        {},
        current_data,
        pick(
            data,
            'report_name',
            'report_descrip',
            'share_dttm',
            'columns'
        )
    )

    if len(new_data['columns']) < 1:
        raise DBException(f'"columns" are required.')

    execute_sp_with_required_in_args(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'SAVE USER SELECTION',
        new_data['user_id'],
        new_data['report_name'].upper(),
        new_data['report_descrip'],
        new_data['share_dttm'],
        get_columns_xml(new_data['columns'])
    )

    return fetch_report(new_data['user_id'], new_data['report_name'])


def report_table_exists(report_id, table_schema, table_name):
    """ Checks if a report table exists. """
    results = execute_sp(
        'MWH_FILES.C8_COLLEGE_SCORECARD_TABLE',
        {
            'message': 'DOES TABLE EXISTS',
            'USER_REPORT_ID': report_id,
            'TABLE_SCHEMA': table_schema,
            'TABLE_NAME': table_name
        }
    )

    result = get_sp_result_set(results)

    if not result:
        return False

    row_count = 0 if result[0]['row_count'] is None else result[0]['row_count']
    return row_count > 0


def save_report_table(report_id, table_schema, table_name, filename, overwrite=0):
    """ Saves the report table. """
    if overwrite is False and report_table_exists(report_id, table_schema, table_name):
        raise DBValidationException(f'The table name already exists.', 'table_name')

    results = execute_sp(
        'MWH_FILES.C8_COLLEGE_SCORECARD_TABLE',
        {
            'message': 'CREATE TABLE USING REPORT XML',
            'USER_REPORT_ID': report_id,
            'TABLE_SCHEMA': table_schema,
            'TABLE_NAME': table_name,
            'D_CSV_FILE_NAME': filename
        }
    )

    if len(results) < 1:
        return {
          'row_count': 0
        }

    result = get_sp_result_set(results)
    if not result:
        raise DBValidationException(f'The table could not be created.', 'table_name')

    row_count = 0 if result[0]['row_count'] is None else result[0]['row_count']
    if row_count < 1:
        raise DBValidationException(f'The table could not be created.', 'table_name')

    return result[0]


def save_uma_column_title(user_id, column_name, uma_excel_column_name):
    """ Saves the new UMA column title. """
    out_arg = 'return_cnt'
    results = execute_sp_with_required_in_args(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'SAVE_UMA_COLUMN_TITLE',
        column_name,
        uma_excel_column_name,
        str(user_id),
        out_arg=out_arg
    )
    status_code = get_out_arg(results, out_arg)
    if status_code < 0:
        raise DBException(f'"{column_name}" could not be saved.')

    return {
      'column_name': column_name,
      'uma_excel_column_name': uma_excel_column_name
    }


def get_excel_export_data(columns, file_name):
    output = io.BytesIO()
    wb = xlsxwriter.Workbook(output)

    # Prints the title worksheet
    ws_title = wb.add_worksheet('TITLE')
    print_ws_export_title(ws_title, columns, file_name)

    # Prints the data worksheet
    ws_data = wb.add_worksheet('DATA')
    print_ws_export_data(ws_data, columns, file_name)

    wb.close()
    return output.getvalue()


def print_ws_data(ws, header, rows):
    """ Print the data in the specified worksheet instance. """
    columns_width = {}

    for i, header_cell in enumerate(header):
        ws.write_string(0, i, str(header_cell))
        columns_width[i] = len(str(header_cell)) + cell_width_padding

    for i, row in enumerate(rows):
        for x, cell_value in enumerate(row):
            cell_length = len(str(cell_value))

            if cell_value is None or cell_value == 'NULL':
                ws.write_string(i + 1, x, '')
            elif is_float(cell_value):
                ws.write_number(i + 1, x, float(cell_value))
            elif is_int(cell_value):
                ws.write_number(i + 1, x, int(cell_value))
            elif is_datetime(cell_value):
                ws.write_string(i + 1, x, cell_value.strftime('%Y-%m-%d %H:%M:%S'))
            else:
                ws.write_string(i + 1, x, cell_value)

            if x in columns_width:
                if cell_length > columns_width[x]:
                    columns_width[x] = cell_length
            else:
                columns_width[x] = cell_length

    for i, width in columns_width.items():
        new_width = width + cell_width_padding
        ws.set_column(i, i, new_width if new_width < max_cell_width else max_cell_width)


def print_ws_export_title(ws, columns, file_name):
    """ Prints the title worksheet. """
    column_groups = list(list_chunks(columns, 10))
    header = []
    raw_data = []

    for cg_i, column_group in enumerate(column_groups):
        xml = get_columns_xml(column_group)

        data_result = execute_sp(
            sp_name='MWH_FILES.MANAGE_CollegeScorecard_Console',
            in_args={
                'message': 'EXPORT',
                'VARCHAR_01': 'TITLE PAGE',
                'VARCHAR_02': file_name,
                'VARCHAR_03': xml,
                'VARCHAR_04': '',
                'VARCHAR_05': '',
                'VARCHAR_06': '',
                'VARCHAR_07': '',
                'VARCHAR_08': '',
                'VARCHAR_09': ''
            },
            out_arg=None,
            as_dict=False
        )

        if len(data_result) < 1:
            raise Exception('No title data returned in the call to the MWH_FILES.MANAGE_CollegeScorecard_Console SP.')

        if len(header) < 1:
            for col in data_result[0]:
                header.append(col.upper())

        for row in data_result[1]:
            raw_data.append(row)

    # Print the excel data
    print_ws_data(ws, header, raw_data)


def print_ws_export_data(ws, columns, file_name):
    """ Prints the data worksheet. """
    column_groups = list(list_chunks(columns, 10))
    header = []
    raw_data = []

    for cg_i, column_group in enumerate(column_groups):
        xml = get_columns_xml(column_group, True)

        data_result = execute_sp(
            sp_name='MWH_FILES.MANAGE_CollegeScorecard_Console',
            in_args={
                'message': 'EXPORT',
                'VARCHAR_01': 'DATA',
                'VARCHAR_02': file_name,
                'VARCHAR_03': xml,
                'VARCHAR_04': '',
                'VARCHAR_05': '',
                'VARCHAR_06': '',
                'VARCHAR_07': '',
                'VARCHAR_08': '',
                'VARCHAR_09': ''
            },
            out_arg=None,
            as_dict=False
        )

        if len(data_result) < 1:
            raise Exception('No title data returned in the call to the MWH_FILES.MANAGE_CollegeScorecard_Console SP.')

        for j, col in enumerate(data_result[0]):
            if (cg_i == 0 and j == 0) or j > 2:
                header.append(col.upper())

        for j, raw_row in enumerate(data_result[1]):
            row = []
            for k, cell in enumerate(raw_row):
                if (cg_i == 0 and k == 0) or k > 2:
                    row.append(cell)

            if cg_i == 0:
                raw_data.append(row)
            else:
                raw_data[j].extend(row)

    # Print the excel data
    print_ws_data(ws, header, raw_data)


def execute_categories_sp(*args, out_arg='sp_status_code'):
  """
  Helper function to execute the MWH_FILES.MANAGE_COLLEGE_SCORECARD_D_CATEGORY stored procedure.
  """
  results = execute_sp_with_required_in_args(*args, sp_args_length=11, out_arg=out_arg)
  status_code = get_out_arg(results, out_arg)

  if status_code < 0:
    raise SPException(f'Stored Procedure call to "{args[0]}" failed.', status_code)

  result = get_sp_result_set(results, 0, out_arg)
  if not result:
    return []

  return result


def save_category(category_name, description, csv_file, where_unit_id_table, formula, category_id=''):
  """ Creates/Updates a category. """
  execute_categories_sp(
    'MWH_FILES.MANAGE_COLLEGE_SCORECARD_D_CATEGORY',
    'UPDATE_COLLEGE_SCORECARD_D_CATEGORY' if not is_blank(category_id) else 'SAVE_COLLEGE_SCORECARD_D_CATEGORY',
    category_id,
    category_name,
    description,
    formula,
    csv_file,
    where_unit_id_table
  )


def execute_scheduled_tasks_sp(*args):
  """
  Helper function to execute the MWH.MANAGE_SCHEDULE_TASK_JOBS stored procedure.
  """
  return execute_admin_console_sp(*args, sp_args_length=11)


def schedule_task(filename, new_filename=''):
    job_name = ''
    if 'MERGED' in filename:
        job_name = 'COLLEGE SCORECARD COHORTS DATA'
    elif 'FieldOfStudyData' in filename: 
        job_name = 'COLLEGE SCORECARD FIELDS OF STUDY'
    elif filename == 'Most Recent Institution-Level Data': 
        job_name = 'MOST RECENT COLLEGE SCORECARD COHORTS DATA'
        res = requests.head(LATEST_COHORTS_DATA_URL)
        last_modified = datetime.datetime.strptime(res.headers['Last-Modified'], '%a, %d %b %Y %H:%M:%S %Z')
        new_filename = new_filename.split('.', 1)[0]
        filename = f"{new_filename}_{last_modified.strftime('%Y-%m-%d')}.csv"
    elif filename == 'Most Recent Data by Field of Study': 
        job_name = 'MOST RECENT COLLEGE SCORECARD FIELDS OF STUDY'
        res = requests.head(LATEST_FIELDS_OF_STUDY_DATA_URL)
        last_modified = datetime.datetime.strptime(res.headers['Last-Modified'], '%a, %d %b %Y %H:%M:%S %Z')
        new_filename = new_filename.split('.', 1)[0]
        filename = f"{new_filename}_{last_modified.strftime('%Y-%m-%d')}.csv"
    elif '.yaml' in filename:
        job_name = 'COLLEGE SCORECARD FIELDS DICTIONARY'
    else:
        raise SPException(f'"{filename}" is an invalid filename.', -1)

    return execute_scheduled_tasks_sp('MWH.MANAGE_SCHEDULE_TASK_JOBS', 'SCHEDULE_TASK_JOB', job_name, filename, 'UMA_TELECOM\\in')
 