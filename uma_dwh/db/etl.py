import time
import uma_dwh.utils.appcache as appcache
import uma_dwh.utils.opsgenie as opsgenie
from datetime import datetime, timedelta
from .mssql_db import execute_sp, result_as_dict, result_set_as_dicts
from .exceptions import SPException
from .schemas import etl as etl_schemas

ADMIN_CONSOLE_SP_IN_ARGS_LENGTH = 10

message_schema_map = {
  'LIST_CONTROL_MANAGER_DETAILS': etl_schemas.control_manager_schema,
  'LOAD_ETL_HISTORY': etl_schemas.cycle_history_schema,
  'GET_ETL_PROCEDURE_HISTORY': etl_schemas.procedure_history_schema,
  'GET TABLES AND STORED PROCEDURES': etl_schemas.server_db_procedures_schema,
  'DISPLAY_REPORT_BY_DATE': etl_schemas.report_history_schema,
  'LOAD_ETL_SEARCH_CHART': etl_schemas.procedure_runtime_chart_data_schema,
  'LOAD_REPORT_SEARCH_CHART': etl_schemas.report_runtime_chart_data_schema,
  'GET SERVER DB LIST': etl_schemas.server_dbs_schema,
  'REPORT_SELECT_BY_DATE': etl_schemas.reports_schema,
  'LOAD_TryCatch_Search_Chart': etl_schemas.try_catch_errors_chart_data_schema,
  'DISPLAY_TryCatch_Daily_Errors': etl_schemas.try_catch_errors_schema
}


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


def fetch_servers():
    """
    Returns the ETL servers with their dbs and procedures.
    """
    server_dbs = execute_admin_console_sp('MWH.UMA_WAREHOUSE_ADMIN_CONSOLE', 'GET SERVER DB LIST')

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
            procedures = execute_admin_console_sp(
              'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE', 'GET TABLES AND STORED PROCEDURES', server_name, db_name
            )

            server['dbs'].append({
              'name': db_name,
              'procedures': procedures
            })

        servers.append(server)

    return servers


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
        'VARCHAR_01': error_id
      })
    )

    return result_as_dict(etl_schemas.try_catch_error_schema, result[0][0])


def fetch_reports(date):
    reports = execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
      'REPORT_SELECT_BY_DATE',
      date
    )

    if len(reports) < 1:
        date_datetime = datetime.today() if date == '' else datetime.strptime(date, '%Y-%m-%d')
        today_datetime = datetime.today()

        if date_datetime.date() == today_datetime.date():
            date = (today_datetime - timedelta(1)).strftime('%Y-%m-%d')
            reports = execute_admin_console_sp(
              'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
              'REPORT_SELECT_BY_DATE',
              date
            )

    return reports


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


def execute_admin_console_sp(*args, schema=None):
    """
    Helper function to execute the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE stored procedure.
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    sp_name = args[0]
    sp_message = args[1]
    out_arg = 'TryCatchError_ID'

    if schema is None:
        schema = []
        if sp_message in message_schema_map:
            schema = message_schema_map[sp_message]

    in_args = {
      'message': sp_message
    }

    for x in range(2, len(args)):
        in_arg_prefix = '0' if x < 10 else ''
        in_arg = f'VARCHAR_{in_arg_prefix}{x - 1}'
        in_args[in_arg] = str(args[x])

    result = execute_sp(sp_name, fill_in_admin_console_sp_in_args(in_args), out_arg)
    result_count = len(result)

    status_code = result[result_count - 1][0][0]

    if status_code > 1:
        raise SPException(f'Stored Procedure call to SP "{sp_name}" failed.', status_code)

    if result_count == 1:
        return []

    if len(schema) > 1:
        data = result_set_as_dicts(schema, result[0])
    else:
        data = []
        for row in result[0]:
            data.append([x for x in row])

    return data
