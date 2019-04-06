import uma_dwh.utils.opsgenie as opsgenie
from uma_dwh.utils import date_diff_in_seconds
from datetime import datetime
from py_utils.mssql_db import execute_sp, get_sp_result_set, get_out_arg
from .exceptions import SPException
from .utils import execute_sp_with_required_in_args, fill_in_sp_in_args


def fetch_current_status():
    result = execute_sp(
        'MWH.GET_CURRENT_ETL_CYCLE_STATUS',
        {
            'FirstDataMartInCycle': 'I3_NON-MCS'
        }
    )

    data_marts = []

    for data_mart_data in result[0]:
        data_mart = get_data_mart(data_mart_data)
        data_marts.append(data_mart)

    return data_marts


def check_current_status():
    """
    Checks the data mart statuses and sends the Opsgenie alert.
    """
    result = execute_sp(
        'MWH.GET_CURRENT_ETL_CYCLE_STATUS',
        {
            'FirstDataMartInCycle': 'I3_NON-MCS'
        }
    )

    data_marts = {}

    for data_mart_data in result[0]:
        data_mart = get_data_mart(data_mart_data)
        data_marts[data_mart['data_mart_name']] = data_mart

    last_run_result = execute_admin_console_sp(
        'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
        'GET_LAST_DATAMART_RUN'
    )

    alerts_sent = []

    for data_mart_last_run in last_run_result:
        data_mart_name = data_mart_last_run['data_mart_name']
        if data_mart_name in data_marts:
            data_mart = data_marts[data_mart_name]
            done_dttm = data_mart_last_run['done_dttm']
            now_datetime = datetime.now()
            if data_mart['data_mart_status'] == 'FAILED' and date_diff_in_seconds(now_datetime, done_dttm) > 3600:
                last_alert_result = execute_admin_console_sp(
                    'MWH.MANAGE_OPS_GENIE_ALERT',
                    'GET DATE BY DATAMART NAME',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    '',
                    data_mart_name
                )

                if len(last_alert_result) > 0 and last_alert_result[0]['insert_dttm'].date() < datetime.today().date():
                    alerts_sent.append(data_mart)
                    opsgenie.send_etl_status_alert(data_mart)

    return alerts_sent


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


def queue_stats(tables):
    """
    Queue stats on the specified tables
    :param tables: List of schemas and tables
    :type tables: list
    """
    for table in tables:
        execute_sp(
            'MWH.MANAGE_STATISTICS_SP',
            {
                'VARCHAR_01': 'QUEUE',
                'VARCHAR_02': 'MLK-EDM-D-SQ02',
                'VARCHAR_03': table['database'],
                'VARCHAR_04': table['schema'],
                'VARCHAR_05': table['table'],
                'VARCHAR_06': 'FULLSCAN'
            }
        )


def dequeue_stats(tables):
    """
    Dequeue stats on the specified tables
    :param tables: List of schemas and tables
    :type tables: list
    """
    for table in tables:
        execute_sp(
            'MWH.MANAGE_STATISTICS_SP',
            {
                'VARCHAR_01': 'DEQUEUE',
                'VARCHAR_02': 'MLK-EDM-D-SQ02',
                'VARCHAR_03': table['database'],
                'VARCHAR_04': table['schema'],
                'VARCHAR_05': table['table'],
                'VARCHAR_06': 'FULLSCAN'
            }
        )


def fetch_error(error_id):
    """
    Returns the ETL error record.
    :param error_id: Error record ID
    :type error_id: int
    """
    result = execute_sp(
        'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
        fill_in_sp_in_args({
            'message': 'GET_ERROR_TEXT',
            'VARCHAR_01': error_id
        })
    )

    return result[0][0]


def get_data_mart(raw_data_mart):
    """
    Helper function to return a data mart data from its raw data.
    :param raw_data_mart: Data mart data
    :type raw_data_mart: dict
    :return: dict
     """
    data_mart = raw_data_mart.copy()

    current_status = data_mart['data_mart_status']

    if current_status == 'STOPPED!':
        current_status = 'FAILED'
    elif current_status == 'NOT STARTED':
        current_status = 'FAILED'
    elif current_status == 'STOPPED':
        current_status = 'PAUSED'

    # Set the status
    data_mart['data_mart_status_internal'] = data_mart['data_mart_status']
    data_mart['data_mart_status'] = current_status

    return data_mart


def execute_admin_console_sp(*args, out_arg='sp_status_code'):
    """
    Helper function to execute the MWH.UMA_WAREHOUSE_ADMIN_CONSOLE stored procedure.
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    results = execute_sp_with_required_in_args(*args)
    status_code = get_out_arg(results, out_arg)
    
    if status_code > 1:
        raise SPException(f'Stored Procedure call to "{args[0]}" failed.', status_code)
    
    result = get_sp_result_set(results, 0, out_arg)
    if not result:
        return []

    return result
