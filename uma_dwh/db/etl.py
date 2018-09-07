import time
import uma_dwh.utils.appcache as appcache
import uma_dwh.utils.opsgenie as opsgenie
from .mssql_db import execute_sp, result_as_dict, result_set_as_dicts
from .exceptions import SPException
from .schemas import etl as etl_schemas

ADMIN_CONSOLE_SP_IN_ARGS_LENGTH = 10


def fetch_control_manager():
    """
    Returns a the list of procedures in the ETL_CONTROL_MANAGER table.
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
      {
        'message': 'LIST_CONTROL_MANAGER_DETAILS'
      },
      'TryCatchError_ID',
      etl_schemas.control_manager_schema
    )


def fetch_current_status():
    """
    Returns the current status for the ETL data marts.
    """
    result = execute_sp(
      'MWH.GET_CURRENT_ETL_CYCLE_STATUS',
      {
        'FirstDataMartInCycle': 'I3_NON-MCS'
      }
    )

    status_data = result_set_as_dicts(etl_schemas.current_cycle_status_schema, result[0])
    # check_etl_status(status_data)

    return status_data


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
      etl_schemas.cycle_history_schema
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
      etl_schemas.procedure_history_schema
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
      etl_schemas.server_dbs_schema
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
      etl_schemas.server_db_procedures_schema
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

    return result_as_dict(etl_schemas.try_catch_error_schema, result[0][0])


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


def fetch_powerbi_report_history(start_date='', end_date=''):
    """
    Returns the POWERBI report history. Set the start_date and end_date
    parameters to select a report within a date range.
    :param start_date
    :type start_date: str
    :param end_date
    :type end_date: str
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'GET POWER BI REPORT HISTORY',
        'VARCHAR_01': start_date,
        'VARCHAR_02': end_date
      },
      'TryCatchError_ID',
      etl_schemas.powerbi_report_history_schema
    )


def fetch_powerbi_report_statistics(report_name='ALL'):
    """
    Returns the POWERBI report stats. Set the report_name parameter to filter by report name.
    :param report_name
    :type report_name: str
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'GET POWER BI REPORT STATISTICS',
        'VARCHAR_01': report_name
      },
      'TryCatchError_ID',
      etl_schemas.powerbi_report_statistics_schema
    )


def fetch_powerbi_report_runs(report_name, from_num='', to_num=''):
    """
    Returns the POWERBI report runs for the specified report.
    :param report_name
    :type report_name: str
    :param from_num
    :type from_num: str
    :type from_num: int
    :param to_num
    :type to_num: str
    :type to_num: int
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'LIST REPORT RUNS',
        'VARCHAR_01': report_name,
        'VARCHAR_02': str(from_num),
        'VARCHAR_03': str(to_num)
      },
      'TryCatchError_ID',
      etl_schemas.powerbi_report_runs_schema
    )


def check_etl_status(status_data):
    """
    Helper function to retrieve the current ETL status.
    :param status_data: SP in arguments
    :type status_data: list
    :return: str
     """
    new_etl_status = status_data[-1]['data_mart_status']

    if 'STOPPED' not in new_etl_status:
        new_etl_status = 'RUNNING'
    elif new_etl_status == 'STOPPED!':
        new_etl_status = 'FAILED'
    elif new_etl_status == 'STOPPED':
        new_etl_status = 'PAUSED'

    current_etl_status = appcache.get_item('ETL_STATUS') or 'RUNNING'

    if current_etl_status != 'FAILED' and new_etl_status == 'FAILED':
        opsgenie.send_etl_status_alert()

    if new_etl_status != current_etl_status:
        appcache.set_item('ETL_STATUS', new_etl_status)
        appcache.set_item('ETL_STATUS_UPDATED', time.time())

    status_data[-1]['data_mart_status'] = new_etl_status

    return new_etl_status


def fetch_procedure_load_search_chart_data(procedure_name, start_date, months=6):
    """
    Returns the data for a procedure's load search chart.
    :param procedure_name
    :type procedure_name: str
    :param start_date
    :type start_date: str
    :type months: int
    :param months
    """
    return execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
      {
        'message': 'LOAD_SEARCH_CHART',
        'VARCHAR_01': procedure_name,
        'VARCHAR_02': start_date,
        'VARCHAR_03': str(months)
      },
      'TryCatchError_ID',
      etl_schemas.procedure_load_search_chart_data_schema
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
        for x in range(in_args_length, ADMIN_CONSOLE_SP_IN_ARGS_LENGTH):
            in_arg_prefix = '0' if x < 10 else ''
            in_arg_name = f'VARCHAR_{in_arg_prefix}{x}'
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

    if status_code > 1:
        raise SPException(f'Stored Procedure call to SP "{sp_name}" failed.', status_code)

    if len(schema) > 1:
        data = result_set_as_dicts(schema, result[0])
    else:
        data = []
        for row in result[0]:
            data.append([x for x in row])

    return data
