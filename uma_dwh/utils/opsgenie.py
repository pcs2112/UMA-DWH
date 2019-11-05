import sys
from uma_dwh.db.mssql_db import execute_sp
from datetime import datetime
from opsgenie.swagger_client import AlertApi
from opsgenie.swagger_client import configuration
from opsgenie.swagger_client.models import CreateAlertRequest

this = sys.modules[__name__]
this.is_enabled = True


def init_opsgenie(config):
    configuration.api_key['Authorization'] = config['OPSGENIE_API_KEY']
    configuration.api_key_prefix['Authorization'] = config['OPSGENIE_GENIE_KEY']
    this.is_enabled = config['IS_PRODUCTION']


def send_alert_for_error(error):
    return _send_alert('UMA DWH Error', 'P3', {
      'error_id': error['id'],
      'error_code': error['err'],
      'error_dttm': error['insert_dttm'],
      'error_severity': error['error_severity'],
      'error_state': error['error_state'],
      'error_procedure': error['error_procedure'],
      'error_line': error['error_line'],
      'error_message': error['error_message'],
      'error_etl_procedure_name': error['etl_procedure_name']
    })


def send_etl_status_alert(data_mart):
    title = 'DWH ETL FAILED'
    priority = 'P3'
    details = {
      'data_mart_name': data_mart['data_mart_name'],
      'data_mart_status': data_mart['data_mart_status_internal'],
      'data_mart_status_internal': data_mart['data_mart_status']
    }

    response = _send_alert(title, priority, details)

    request_id = '[TESTING]'
    if response is not None:
        request_id = response.request_id

    return {
      'id': request_id,
      'title': title,
      'details': details
    }


def _send_alert(message, priority, details=None):
    if this.is_enabled is False:
        return None

    return AlertApi().create_alert(
      body=CreateAlertRequest(
        message=message,
        priority=priority,
        details=details
      )
    )
