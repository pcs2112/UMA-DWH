import xlwt
import io
from .mssql_db import execute_sp
from uma_dwh.utils import is_float, is_int, list_chunks


def get_excel_export_data(columns, file_name):
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

    wb = xlwt.Workbook(encoding='UTF-8')
    ws_data = wb.add_sheet('DATA')

    # Print the data tab header
    print_ws_header(ws_data, header)

    # Print rows
    print_ws_data(ws_data, raw_data)

    output = io.BytesIO()
    wb.save(output)
    return output.getvalue()


def print_ws_header(ws, header):
    for x, cell in enumerate(header):
        ws.write(0, x, cell)
        ws.col(x).width = (len(header[x]) + 4) * 367


def print_ws_data(ws, rows):
    for i, row in enumerate(rows):
        for x, cell in enumerate(row):
            label = cell
            if label is None or label == 'NULL':
                label = ''
            elif is_float(cell):
                label = float(cell)
            elif is_int(cell):
                label = int(cell)

            ws.write(i + 1, x, label)
