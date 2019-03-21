from .etl import execute_admin_console_sp


def fetch_current_values():
    """ Returns the current values. """
    return execute_admin_console_sp(
        'MWH.MNG_ETL_CONTROL_MANAGER',
        'LIST CURRENT VALUES',
        'ALL',
        ''
    )
