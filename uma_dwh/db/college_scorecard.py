import xlwt
import io
import xml.etree.ElementTree as ET
from pydash.objects import pick, assign
from pydash.predicates import is_empty
from .mssql_db import execute_sp, get_sp_result_set
from uma_dwh.utils import is_float, is_int, is_datetime, list_chunks
from .etl import execute_admin_console_sp
from .exceptions import DBException, DBValidationException

cell_width_padding = 367
max_cell_width = 65535


def get_columns_xml(columns, prepend_default=False):
    """ Returns the columns xml for the list of specified columns. """
    xml = '<COLUMNS>'

    if prepend_default:
        xml += f'<COLUMN NAME="INSTNM" />'
        xml += f'<COLUMN NAME="OPEID" />'

    for col in columns:
        xml += f'<COLUMN NAME="{col}" />'

    xml += '</COLUMNS>'

    return xml


def get_columns_from_xml(xml):
    """ Returns the list of columns from an xml string. """
    tree = ET.ElementTree(ET.fromstring(xml))
    root = tree.getroot()
    columns = []

    for col in root:
        columns.append(col.attrib['NAME'])

    return columns


def report_exists(user_id, report_name):
    """ Checks the report exists. """
    result = execute_admin_console_sp(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'CHECK_IF_REPORT_NAME_EXISTS',
        str(user_id),
        report_name.upper()
    )

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
    result = execute_admin_console_sp(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'GET REPORT',
        str(id_),
        report_name.upper(),
        str(user_id)
    )

    if len(result) < 1:
        return None

    report = result[0]

    if 'xml_data' in report:
        report['columns'] = get_columns_from_xml(report['xml_data'])
        del report['xml_data']

    return report


def fetch_reports(user_id):
    """ Fetches the reports for the specified user. """
    return execute_admin_console_sp(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'GET USER REPORTS',
        str(user_id)
    )


def create_report(data):
    """
    Creates a report and returns the report's information.
    :param data: Report data
    :type data: dict
    """
    if not is_empty(data['report_name']) and report_exists(data['user_id'], data['report_name']):
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

    execute_admin_console_sp(
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

    execute_admin_console_sp(
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


def save_report_table(report_id, table_schema, table_name, overwrite=0):
    """ Saves the report table. """
    if overwrite is False and report_table_exists(report_id, table_schema, table_name):
        raise DBValidationException(f'The table name already exists.', 'table_name')

    return execute_sp(
        'MWH_FILES.C8_COLLEGE_SCORECARD_TABLE',
        {
          'message': 'CREATE TABLE USING REPORT XML',
          'USER_REPORT_ID': report_id,
          'TABLE_SCHEMA': table_schema,
          'TABLE_NAME': table_name
        }
    )
    
    """
    print(results)

    result = get_sp_result_set(results)
    if not result:
        raise DBValidationException(f'The table could not be created.', 'table_name')
    
    row_count = 0 if result[0]['row_count'] is None else result[0]['row_count']
    if row_count < 1:
        raise DBValidationException(f'The table could not be created.', 'table_name')
    
    return result[0]
    """


def get_excel_export_data(columns, file_name):
    wb = xlwt.Workbook(encoding='UTF-8')

    # Prints the title worksheet
    ws_data = wb.add_sheet('TITLE')
    print_ws_export_title(ws_data, columns, file_name)

    # Prints the data worksheet
    ws_data = wb.add_sheet('DATA')
    print_ws_export_data(ws_data, columns, file_name)

    output = io.BytesIO()
    wb.save(output)
    return output.getvalue()


def print_ws_header(ws, header):
    """ Print the header in the specified worksheet instance. """
    for x, cell in enumerate(header):
        ws.write(0, x, cell)
        ws.col(x).width = len(str(cell)) * cell_width_padding


def print_ws_data(ws, rows):
    """ Print the data in the specified worksheet instance. """
    columns_width = {}
    for i, row in enumerate(rows):
        for x, cell_value in enumerate(row):
            cell_length = len(str(cell_value))

            if cell_value is None or cell_value == 'NULL':
                cell_value = ''
            elif is_float(cell_value):
                cell_value = float(cell_value)
            elif is_int(cell_value):
                cell_value = int(cell_value)
            elif is_datetime(cell_value):
                cell_value = cell_value.strftime('%Y-%m-%d %H:%M:%S')

            if x in columns_width:
                if cell_length > columns_width[x]:
                    columns_width[x] = cell_length
            else:
                columns_width[x] = cell_length

            ws.write(i + 1, x, cell_value)

    for i, width in columns_width.items():
        new_width = width * cell_width_padding
        if ws.col(i).width <= new_width:
            ws.col(i).width = new_width if new_width < max_cell_width else max_cell_width


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
            out_arg='TryCatchError_ID',
            as_dict=False
        )

        if len(data_result) < 1:
            raise Exception('No title data returned in the call to the MWH_FILES.MANAGE_CollegeScorecard_Console SP.')

        if len(header) < 1:
            for col in data_result[0]:
                header.append(col.upper())

        for row in data_result[1]:
            raw_data.append(row)

    # Print the data tab header
    print_ws_header(ws, header)

    # Print rows
    print_ws_data(ws, raw_data)


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
            out_arg='TryCatchError_ID',
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

    # Print the data tab header
    print_ws_header(ws, header)

    # Print rows
    print_ws_data(ws, raw_data)
