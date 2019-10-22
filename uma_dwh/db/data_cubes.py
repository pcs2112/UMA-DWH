from .mssql_db import get_sp_result_set, get_out_arg
from .utils import execute_sp_with_required_in_args
from .exceptions import SPException


def execute_sp(*args, sp_args_length=17, out_arg='sp_status_code'):
    """
    Helper function to execute the [UMA_CUBEVIEW] stored procedures.
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    results = execute_sp_with_required_in_args(*args, sp_args_length, sp_in_arg_prefix='VARIABLE_')
    status_code = get_out_arg(results, out_arg)

    if status_code == 0:
        raise SPException(f'Stored Procedure call to "{args[0]}" failed.', status_code)

    result = get_sp_result_set(results, 0, out_arg)
    if not result:
        return []

    return result
