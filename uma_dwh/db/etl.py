import uma_dwh.utils.appcache as appcache
import uma_dwh.utils.opsgenie as opsgenie
from uma_dwh.utils import date_diff_in_seconds
from datetime import datetime
from .mssql_db import execute_sp
from .exceptions import SPException

ADMIN_CONSOLE_SP_IN_ARGS_LENGTH = 10


def fetch_current_status(send_alert=True):
    result = execute_sp(
      'MWH.GET_CURRENT_ETL_CYCLE_STATUS',
      {
        'FirstDataMartInCycle': 'I3_NON-MCS'
      }
    )

    data_marts = []

    # Alert not required, just return the data marts
    if send_alert is False:
        for data_mart_data in result[0]:
            data_mart = get_data_mart(data_mart_data)
            data_marts.append(data_mart)

        return data_marts

    # Alert required
    cached_data_marts = appcache.get_item('DATA_MARTS') or {}

    for data_mart_data in result[0]:
        cached_data_mart = None
        if data_mart_data['data_mart_name'] in cached_data_marts:
            cached_data_mart = cached_data_marts[data_mart_data['data_mart_name']]

        data_mart = get_data_mart(data_mart_data, cached_data_mart)
        data_marts.append(data_mart)

    # Save data marts data into storage
    new_cached_data_marts = {}
    for data_mart in data_marts:
        new_cached_data_marts[data_mart['data_mart_name']] = {
          'data_mart_status': data_mart['data_mart_status'],
          'data_mart_status_updated': data_mart['data_mart_status_updated'],
          'data_mart_alert_sent': data_mart['data_mart_alert_sent']
        }

    appcache.set_item('DATA_MARTS', new_cached_data_marts)

    if send_alert:
        opsgenie.send_etl_status_alert(data_marts[0:len(data_marts)-1])

    return data_marts


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
              'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
              'GET TABLES AND STORED PROCEDURES',
              server_name,
              db_name
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


def get_data_mart(raw_data_mart, cached_data_mart=None):
    """
    Helper function to return a data mart data from its raw data.
    :param raw_data_mart: Data mart data
    :type raw_data_mart: dict
    :param cached_data_mart: Cached Data mart data
    :type cached_data_mart: dict
    :return: dict
     """
    data_mart = raw_data_mart.copy()
    past_date = '1970-01-01 00:00:00'

    if cached_data_mart is None:
        cached_data_mart = {
          'data_mart_status': 'RUNNING',
          'data_mart_status_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
          'data_mart_alert_sent': past_date
        }

    data_mart['data_mart_status_updated'] = cached_data_mart['data_mart_status_updated']
    data_mart['data_mart_alert_sent'] = cached_data_mart['data_mart_alert_sent']
    data_mart['data_mart_send_alert'] = False

    current_status = data_mart['data_mart_status']
    last_status = cached_data_mart['data_mart_status']
    last_status_updated_datetime = datetime.strptime(cached_data_mart['data_mart_status_updated'], '%Y-%m-%d %H:%M:%S')
    last_alert_sent_datetime = datetime.strptime(cached_data_mart['data_mart_alert_sent'], '%Y-%m-%d %H:%M:%S')
    now_datetime = datetime.now()

    if current_status == 'STOPPED!':
        current_status = 'FAILED'
    elif current_status == 'NOT STARTED':
        current_status = 'FAILED'
    elif current_status == 'STOPPED':
        current_status = 'PAUSED'

    if current_status == 'FAILED':
        if last_status == 'FAILED' \
          and date_diff_in_seconds(now_datetime, last_status_updated_datetime) >= 1800 \
          and date_diff_in_seconds(now_datetime, last_alert_sent_datetime) >= 86400:
            data_mart['data_mart_alert_sent'] = now_datetime.strftime('%Y-%m-%d %H:%M:%S')
            data_mart['data_mart_send_alert'] = True

    # Reset the status last updated and alert sent date times
    if current_status != last_status:
        data_mart['data_mart_status_updated'] = now_datetime.strftime('%Y-%m-%d %H:%M:%S')
        data_mart['data_mart_alert_sent'] = past_date

    # Set the status
    data_mart['data_mart_status_display'] = data_mart['data_mart_status']
    data_mart['data_mart_status'] = current_status

    return data_mart


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
