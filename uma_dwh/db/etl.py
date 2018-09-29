import time
import uma_dwh.utils.appcache as appcache
import uma_dwh.utils.opsgenie as opsgenie
from datetime import datetime, timedelta
from .mssql_db import execute_sp
from .exceptions import SPException

ADMIN_CONSOLE_SP_IN_ARGS_LENGTH = 10


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

    status_data = result[0]
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

    return result[0][0]


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


def get_admin_console_sp_in_args_from_dict(required_args, args):
    """
    Returns the admin_console_sp in args from data in a dictionary.
    :param required_args:
    :type required_args: list
    :param args:
    :type args: dict
    :return: List of in arguments for the admin_console_sp function
    """
    out_args = []

    if len(required_args) > 0:
        for required_arg in required_args:
            if required_arg not in args:
                raise SPException(
                  f' Missing required argument "{required_arg}".',
                  -1
                )

            out_args.append(args[required_arg])

    return out_args


def execute_admin_console_sp_from_date(sp_name, sp_message, required_params, request_params):
    """
    Helper function to execute the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE stored procedure from a Flask route.
    This function returns data from yesterday if no data is found today
    :param sp_name: Stored procedure name
    :type sp_name: str
    :param sp_message: Stored procedure message
    :type sp_message: str
    :param required_params: List of required http query params
    :type required_params: list
    :param request_params: Http request parameters
    :type request_params: dict
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    in_args = get_admin_console_sp_in_args_from_dict(required_params, request_params)
    date = in_args[0]

    reports = execute_admin_console_sp(
      sp_name,
      sp_message,
      date
    )

    if len(reports) < 1:
        date_datetime = datetime.today() if date == '' else datetime.strptime(date, '%Y-%m-%d')
        today_datetime = datetime.today()

        if date_datetime.date() == today_datetime.date():
            date = (today_datetime - timedelta(1)).strftime('%Y-%m-%d')
            reports = execute_admin_console_sp(
              sp_name,
              sp_message,
              date
            )

    return reports


def execute_admin_console_sp_from_route(sp_name, sp_message, required_params, request_params):
    """
    Helper function to execute the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE stored procedure from a Flask route.
    :param sp_name: Stored procedure name
    :type sp_name: str
    :param sp_message: Stored procedure message
    :type sp_message: str
    :param required_params: List of required http query params
    :type required_params: list
    :param request_params: Http request parameters
    :type request_params: dict
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    in_args = get_admin_console_sp_in_args_from_dict(required_params, request_params)

    return execute_admin_console_sp(
      sp_name,
      sp_message,
      *in_args
    )


def execute_admin_console_sp(*args):
    """
    Helper function to execute the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE stored procedure.
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    sp_name = args[0]
    sp_message = args[1]
    out_arg = 'TryCatchError_ID'

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

    return result[0]
