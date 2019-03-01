from .mssql_db import execute_sp


def get_export_data(columns, file_name):
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
    
    for row in data:
        rows.append(row)

    return rows
