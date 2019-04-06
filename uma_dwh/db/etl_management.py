from py_utils.mssql_db import execute_sp


def fetch_current_values():
    """ Returns the current values. """
    result = execute_sp(
        'MWH.MNG_ETL_CONTROL_MANAGER',
        {
            'message': 'LIST CURRENT VALUES',
            'DATA_MART_NAME': 'ALL',
            'PROCEDURE_NAME': ''
        }
    )
    
    return result[0]
