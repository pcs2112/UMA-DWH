from .mssql_db import get_sp_result_set, get_out_arg
from .utils import execute_sp_with_required_in_args
from .exceptions import SPException


def manage_cubes(*args):
    return execute_sp(*args, sp_args_length=9)


def save_cube(active_flag, cube_name, view_name, materialize, table_namey, cube_date_start, cube_date_end):
    """ Creates/updates a cube. """
    manage_cubes(
        'UMA_CUBEVIEW.MANAGE_CUBEVIEW_DATA',
        'SAVE_CUBE',
        active_flag,
        cube_name,
        view_name,
        materialize,
        table_namey,
        cube_date_start,
        cube_date_end
    )


def manage_cubes_schedule(*args):
    return execute_sp(*args, sp_args_length=17)


def save_cube_schedule(cube_id, name, frequency, monday, tuesday, wednesday, thursday, friday, saturday, sunday, daily_frequency, daily_start, daily_end, daily_occurs_interval, duration_start, duration_end, xml):
    """ Creates/updates a cube. """
    manage_cubes_schedule(
        'UMA_CUBEVIEW.MANAGE_CUBEVIEW_SCHEDULE',
        'SAVE_SCHEDULE',
        cube_id,
        name,
        frequency,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        daily_frequency,
        daily_start,
        daily_end,
        daily_occurs_interval,
        duration_start,
        duration_end,
        xml
    )


def execute_sp(*args, sp_args_length, out_arg='sp_status_code'):
    """
    Helper function to execute the [UMA_CUBEVIEW] stored procedures.
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    results = execute_sp_with_required_in_args(*args, sp_args_length, sp_in_arg_prefix='VARIABLE_')
    status_code = get_out_arg(results, out_arg)

    if status_code != 0:
        raise SPException(f'Stored Procedure call to "{args[0]}" failed.', status_code)

    result = get_sp_result_set(results, 0, out_arg)
    if not result:
        return []

    return result
