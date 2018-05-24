from .mssql_db import fetch_rows, execute_sp, result_set_as_dicts
from .exceptions import SPException
from .schemas.etl import (control_manager_schema, current_cycle_status_schema, cycle_history_schema,
                          procedure_history_schema, server_db_procedures_schema, server_dbs_schema,
                          try_catch_error_schema)

ADMIN_CONSOLE_SP_IN_ARGS_LENGTH = 9


def fetch_control_manager():
    """
    Returns a the list of procedures in the ETL_CONTROL_MANAGER table.
    """
    sql = f'SELECT * FROM MWH.ETL_CONTROL_MANAGER_view ORDER BY DATA_MART_NAME ASC, PRIORITY DESC'
    return fetch_rows(sql=sql, schema=control_manager_schema)


def fetch_current_status():
    """
    Returns the current status for the ETL data marts.
    """
    result = execute_sp(
      'MWH.GET_CURRENT_ETL_CYCLE_STATUS',
      {
        'FirstDataMartInCycle': 'I3_MCS'
      }
    )

    return result_set_as_dicts(current_cycle_status_schema, result[0])


def fetch_cycle_history(start_cycle_group=0, end_cycle_group=9):
    """
    Returns the ETL history.
    :param start_cycle_group: Starting cycle group
    :param end_cycle_group: Ending cycle group
    :type start_cycle_group: int
    :type end_cycle_group: int
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'LOAD_ETL_HISTORY',
        'VARCHAR_01': str(start_cycle_group),
        'VARCHAR_02': str(end_cycle_group)
      },
      'TryCatchError_ID',
      cycle_history_schema
    )


def fetch_procedure_history(db_name, procedure_name):
    """
    Returns the ETL procedure history.
    :param db_name: DB name
    :param procedure_name: Stored procedure name
    :type db_name: str
    :type procedure_name: str
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'GET_ETL_PROCEDURE_HISTORY',
        'VARCHAR_01': db_name,
        'VARCHAR_02': procedure_name
      },
      'TryCatchError_ID',
      procedure_history_schema
    )


def fetch_servers():
    """
    Returns the ETL servers with their dbs and procedures.
    """
    server_dbs = execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'GET SERVER DB LIST'
      },
      'TryCatchError_ID',
      server_dbs_schema
    )

    tmp_servers_dict = {}

    for server in server_dbs:
        if server['source_server_name'] not in tmp_servers_dict:
            tmp_servers_dict[server['source_server_name']] = []

        tmp_servers_dict[server['source_server_name']].append(server['source_db_name'])

    servers = []

    for server_name in tmp_servers_dict:
        server = {
          'name': server_name,
          'dbs': []
        }

        for db_name in tmp_servers_dict[server_name]:
            server['dbs'].append({
              'name': db_name,
              'procedures': fetch_server_db_procedures(server_name, db_name)
            })

        servers.append(server)

    return servers


def fetch_server_db_procedures(server_name, db_name):
    """
    Returns the ETL server db procedures.
    :param server_name: DB name
    :param db_name: DB name
    :type server_name: str
    :type db_name: str
    """
    """
    Returns the ETL procedure names.
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'GET TABLES AND STORED PROCEDURES',
        'VARCHAR_01': server_name,
        'VARCHAR_02': db_name
      },
      'TryCatchError_ID',
      server_db_procedures_schema
    )


def fetch_error(error_id):
    """
    Returns the ETL error record.
    :param error_id: Error record ID
    :type error_id: int
    """
    result = execute_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      fill_in_admin_console_sp_in_args({
        'message': 'GET_ERROR_TEXT',
        'VARCHAR_01': str(error_id),
      })
    )

    return result_set_as_dicts(try_catch_error_schema, result[0])


def fetch_run_check(run_check_name):
    """
    Returns the ETL run check.
    :param run_check_name: Run check name
    :type run_check_name: str
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'RUN_CHECK',
        'VARCHAR_01': run_check_name
      },
      'TryCatchError_ID'
    )


def fill_in_admin_console_sp_in_args(in_args):
    """
    Helper function to ensure the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE SP
    is always called with the correct number of in arguments.

    :param in_args: SP in arguments
    :type in_args: dict
    :return: dict
    """
    new_in_args = in_args.copy()
    in_args_length = len(new_in_args.keys())
    if in_args_length < ADMIN_CONSOLE_SP_IN_ARGS_LENGTH:
        for x in range(in_args_length + 1, ADMIN_CONSOLE_SP_IN_ARGS_LENGTH + 1):
            in_arg_prefix = '0' if x < 10 else ''
            in_arg_name = f'VARCHAR_{in_arg_prefix}{(x-1)}'
            new_in_args[in_arg_name] = ''

    return new_in_args


def execute_admin_console_sp(sp_name, in_args, out_arg, schema=()):
    """
    Helper function to execute the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE stored procedure.

    :param sp_name: Stored procedure name
    :param in_args: Dictionary of store procedure parameters and values
    :param out_arg: Output parameter
    :param schema: List of column names to map to each row value
    :type sp_name: str
    :type in_args: dict
    :type out_arg: str
    :type schema: list
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    result = execute_sp(sp_name, fill_in_admin_console_sp_in_args(in_args), out_arg)

    status_code = result[len(result) - 1][0][0]

    if status_code != 0:
        raise SPException(f'Stored Procedure call to SP "{sp_name}" failed.', status_code)

    if len(schema) > 1:
        data = result_set_as_dicts(schema, result[0])
    else:
        data = []
        for row in result[0]:
            data.append([x for x in row])

    return data
