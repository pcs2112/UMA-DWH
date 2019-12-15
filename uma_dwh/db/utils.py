from .mssql_db import execute_sp, get_out_arg, get_sp_result_set
from .exceptions import SPException


def fill_in_sp_in_args(in_args, sp_args_length=10, sp_in_arg_prefix='VARCHAR_'):
    """
    Helper function to ensure calls to stored procedures are always called with the correct number of in arguments.
  
    :param in_args: SP in arguments
    :type in_args: dict
    :param sp_args_length: Number of in args
    :type sp_args_length: int
    :param sp_in_arg_prefix: In arg name prefix
    :type sp_in_arg_prefix: str
    :return: dict
    """
    new_in_args = in_args.copy()
    in_args_length = len(new_in_args.keys())
    if in_args_length < sp_args_length:
        for x in range(in_args_length, sp_args_length):
            in_arg_name_prefix = '0' if x < 10 else ''
            in_arg_name = f'{sp_in_arg_prefix}{in_arg_name_prefix}{x}'
            new_in_args[in_arg_name] = ''
    
    return new_in_args


def execute_sp_with_required_in_args(*args, sp_args_length=10, out_arg='sp_status_code', sp_in_arg_prefix='VARCHAR_'):
    """
    Helper function to call a stored procedure where the in args are not optional and their
    name prefix is the same.
    
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    sp_name = args[0]
    sp_message = args[1]
    
    in_args = {
        'message': sp_message
    }

    in_args_len = len(args)
    for x in range(2, in_args_len):
        in_arg_prefix = '0' if x <= 10 else ''
        in_arg = f'{sp_in_arg_prefix}{in_arg_prefix}{x - 1}'
        in_args[in_arg] = str(args[x])
        
    results = execute_sp(sp_name, fill_in_sp_in_args(in_args, sp_args_length, sp_in_arg_prefix), out_arg)
    
    get_out_arg(results, out_arg)
    
    return results


def execute_admin_console_sp(*args, sp_args_length=10, out_arg='sp_status_code', sp_in_arg_prefix='VARCHAR_'):
    """
    Helper function to execute the stored procedures.
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    results = execute_sp_with_required_in_args(*args, sp_args_length=sp_args_length, out_arg=out_arg, sp_in_arg_prefix=sp_in_arg_prefix)
    status_code = get_out_arg(results, out_arg)
    
    if status_code > 1:
        raise SPException(f'Stored Procedure call to "{args[0]}" failed.', status_code)
    elif status_code == 0:
        raise SPException(f'Stored Procedure call to "{args[0]}" failed.', -1)
    
    result = get_sp_result_set(results, 0, out_arg)
    if not result:
        return []

    return result
