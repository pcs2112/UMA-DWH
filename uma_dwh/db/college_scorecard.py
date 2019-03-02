import xlwt
import io
from .mssql_db import execute_sp
from uma_dwh.utils import is_float, is_int


def get_excel_export_data(columns, file_name):
    xml = '<COLUMNS>'
    for col in columns:
        xml += f'<COLUMN NAME="{col}" />'

    xml += '</COLUMNS>'

    result = execute_sp(
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
    
    if len(result) < 1:
        return []
    
    data = result[0]
    rows = []
    
    header = [
      'ROW_NUMBER'
    ]
    
    for col in columns:
        header.append(col.upper())

    rows.append(header)
    
    for tmp_row in data:
        rows.append(tmp_row)

    wb = xlwt.Workbook(encoding='UTF-8')
    ws = wb.add_sheet('DATA')

    for i, row in enumerate(rows):
        for x, cell in enumerate(row):
            label = cell
            if label is None:
                label = ''
            elif is_float(cell):
                label = float(cell)
            elif is_int(cell):
                label = int(cell)
                
            ws.write(i, x, label)
            if i == 0:
                ws.col(x).width = (len(row[x]) + 4) * 367

    output = io.BytesIO()
    wb.save(output)
    return output.getvalue()
