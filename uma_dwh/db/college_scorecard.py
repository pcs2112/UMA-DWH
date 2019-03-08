import xlwt
import io
from .mssql_db import execute_sp
from uma_dwh.utils import is_float, is_int, is_datetime, list_chunks

cell_width_padding = 367


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
        xml = '<COLUMNS>'

        for col in column_group:
            xml += f'<COLUMN NAME="{col}" />'

        xml += '</COLUMNS>'

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
        xml = '<COLUMNS>'
        xml += f'<COLUMN NAME="INSTNM" />'
        xml += f'<COLUMN NAME="OPEID" />'

        for col in column_group:
            xml += f'<COLUMN NAME="{col}" />'

        xml += '</COLUMNS>'

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
