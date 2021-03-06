from .mssql_db import get_sp_result_set, get_out_arg
from .utils import execute_sp_with_required_in_args
from .exceptions import SPException


def manage_cubes(*args):
    return execute_sp(*args, sp_args_length=9)


def save_cube(cube_name, active_flag, view_name, table_name, materalize, cube_date_start, cube_date_end, schedule, definition):
    """ Creates/updates a cube. """
    active_flag = '1' if active_flag is True else '0'
    materalize = '1' if materalize is True else '0'

    if materalize == '0':
        table_name = '' 

    xml = '<CUBE>'
    xml += f'<ELEMENT ACTIVE_FLAG="{active_flag}" />'
    xml += f'<ELEMENT CUBE_NAME="{cube_name}" />'
    xml += f'<ELEMENT VIEW_NAME="{view_name}" />'
    xml += f'<ELEMENT MATERALIZE="{materalize}" />'
    xml += f'<ELEMENT TABLE_NAME="{table_name}" />'
    xml += f'<ELEMENT CUBE_DATE_START="{cube_date_start}" />'
    xml += f'<ELEMENT CUBE_DATE_END="{cube_date_end}" />'
    
    factsDimsMap = {}
    for dim in definition:
        if dim['fact_table'] not in factsDimsMap:
            factsDimsMap[dim['fact_table']] = []

        factsDimsMap[dim['fact_table']].append(dim)
        
    for fact, dims in factsDimsMap.items(): 
        xml += f'<fact table="{fact}">'
        for dim in dims:
            xml += '<dimension>%s</dimension>' % dim['column_name']
        xml += f'</fact>'

    xml += '</CUBE>'

    result = manage_cubes(
        'UMA_CUBEVIEW.MANAGE_CUBEVIEW_DATA',
        'SAVE_CUBE',
        active_flag,
        cube_name,
        view_name,
        materalize,
        table_name,
        cube_date_start,
        cube_date_end,
        '',
        xml
    )

    daily_start = schedule['daily_start']
    daily_occurs_interval = schedule.get('daily_occurs_interval', 0)

    if schedule['daily_frequency'] == 1:
        daily_end = daily_start
        daily_occurs_interval = 0
    else:
        daily_end = schedule['daily_end']

    save_cube_schedule(
        result[0]['id'],
        schedule.get('name', ''),
        schedule.get('frequency'),
        '1' if schedule.get('monday', False) is True else '0',
        '1' if schedule.get('tuesday', False) is True else '0',
        '1' if schedule.get('wednesday', False) is True else '0',
        '1' if schedule.get('thursday', False) is True else '0',
        '1' if schedule.get('friday', False) is True else '0',
        '1' if schedule.get('saturday', False) is True else '0',
        '1' if schedule.get('sunday', False) is True else '0',
        schedule['daily_frequency'],
        daily_start,
        daily_end,
        daily_occurs_interval,
        schedule['duration_start'],
        schedule['duration_end'],
        xml
    )

    return result[0]
    

def manage_cubes_schedule(*args):
    return execute_sp(*args, sp_args_length=17)


def save_cube_schedule(cube_id, name, frequency, monday, tuesday, wednesday, thursday, friday, saturday, sunday, daily_frequency, daily_start, daily_end, daily_occurs_interval, duration_start, duration_end, xml):
    """ Creates/updates a cube. """
    manage_cubes_schedule(
        'UMA_CUBEVIEW.MANAGE_CUBEVIEW_SCHEDULE',
        'SAVE_SCHEDULE',
        cube_id,
        name if name else f'CUBE_{cube_id}_SCHEDULE',
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
    results = execute_sp_with_required_in_args(*args, sp_args_length=sp_args_length, sp_in_arg_prefix='VARIABLE_', out_arg=out_arg)
    status_code = get_out_arg(results, out_arg)

    if status_code > 10:
        raise SPException(f'Stored Procedure call to "{args[0]}" failed.', status_code)

    result = get_sp_result_set(results, 0, out_arg)
    if not result:
        return []

    return result
