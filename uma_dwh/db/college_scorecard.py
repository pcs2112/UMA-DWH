import xlwt
import io
from pydash.objects import pick, assign
from pydash.predicates import is_empty
from .mssql_db import execute_sp
from uma_dwh.utils import is_float, is_int, is_datetime, list_chunks
from .etl import execute_admin_console_sp
from .exceptions import DBException

cell_width_padding = 367


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


def fetch_report(user_id, report_name):
    """ Fetches a report for the specified user and report name. """
    result = execute_admin_console_sp(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'GET USER REPORTS',
        str(user_id)
    )
    
    for report in result:
        if report['d_admin_console_user_id'] == user_id and report['report_name'] == report_name:
            return report
        
    return None


def fetch_report_by_id(id_, user_id, report_name):
    return execute_admin_console_sp(
      'MWH_FILES.MANAGE_CollegeScorecard_Console',
      'GET REPORT',
      str(id_),
      report_name,
      str(user_id)
    )


def create_report(data):
    """
    Creates a report and returns the report's information.
    :param data: Report data
    :type data: dict
    """
    if not is_empty(data['user_id']) and not is_empty(data['report_name']):
        report = fetch_report(data['user_id'], data['report_name'])
        if report:
            return update_report(data)
    
    required_data = {
        'user_id': '',
        'report_name': '',
        'report_descrip': '',
        'share_dttm': '',
        'columns': []
    }
    
    new_data = assign(
        required_data,
        pick(
            data,
            'user_id',
            'report_name',
            'report_descrip',
            'share_dttm',
            'columns'
        )
    )
    
    if len(new_data['columns']) < 1:
        raise DBException(f'"columns" are required.')

    result = execute_admin_console_sp(
        'MWH_FILES.MANAGE_CollegeScorecard_Console',
        'SAVE USER SELECTION',
        new_data['user_id'],
        new_data['report_name'],
        new_data['report_descrip'],
        new_data['share_dttm'],
        get_columns_xml(new_data['columns'])
    )
    
    if len(result) < 1:
        raise DBException("The new report could not be saved.")
    
    return fetch_report(new_data['user_id'], new_data['report_name'])


def update_report(data):
    """
    Updates a report and returns the report's information.
    :param data: New report data
    :type data: dict
    """
    report = fetch_report(data['user_id'], data['report_name'])
    if report is None:
        raise DBException(f'The report is invalid.')
    
    current_data = {
        'user_id': report['user_id'],
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
            'user_id',
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
        new_data['report_name'],
        new_data['report_descrip'],
        new_data['share_dttm'],
        get_columns_xml(new_data['columns'])
    )
    
    return fetch_report(new_data['user_id'], new_data['report_name'])


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
            ws.col(i).width = width * cell_width_padding


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
