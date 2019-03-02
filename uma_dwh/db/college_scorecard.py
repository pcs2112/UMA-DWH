import xlwt
import io
from .mssql_db import execute_sp
from uma_dwh.utils import is_float, is_int


def get_excel_export_data(columns, file_name):
    xml = '<COLUMNS>'
    
    for col in columns:
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
  
    raw_data = data_result[0]
  
    header = [
        'ROW_NUMBER'
    ]
  
    for col in columns:
        header.append(col.upper())
    
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
            if label is None:
                label = ''
            elif is_float(cell):
                label = float(cell)
            elif is_int(cell):
                label = int(cell)
                
            ws.write(i + 1, x, label)
