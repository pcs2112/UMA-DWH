import sys
import json
import uma_dwh.db.etl
from flask import current_app as app
from opsgenie.swagger_client import AlertApi
from opsgenie.swagger_client import configuration
from opsgenie.swagger_client.models import CreateAlertRequest

this = sys.modules[__name__]
this.is_enabled = True


def init_opsgenie(app):
    configuration.api_key['Authorization'] = app.config['OPSGENIE_API_KEY']
    configuration.api_key_prefix['Authorization'] = app.config['OPSGENIE_GENIE_KEY']
    this.is_enabled = app.config['OPSGENIE_ENABLED']


def send_alert(error_id):
    error = uma_dwh.db.etl.fetch_error(error_id)
    return _send_alert('UMA DWH Error', 'P3', {
      'error_id': error['id'],
      'error_dttm': error['insert_dttm'],
      'error_severity': error['error_severity'],
      'error_state': error['error_state'],
      'error_procedure': error['error_procedure'],
      'error_line': error['error_line'],
      'error_message': error['error_message'],
      'error_etl_procedure_name': error['etl_procedure_name']
    })


def send_etl_status_alert(data_marts):
    for data_mart in data_marts:
        if 'data_mart_send_alert' in data_mart and data_mart['data_mart_send_alert'] is True:
            _send_alert(f"DWH ETL {data_mart['data_mart_status']}", 'P3', {
              'error_data_marts': data_mart['data_mart_name']
            })


def _send_alert(message, priority, details=None):
    app.logger.debug(f'message={message} priority={priority} details={json.dumps(details)}')

    if this.is_enabled:
        response = AlertApi().create_alert(
          body=CreateAlertRequest(
            message=message,
            priority=priority,
            details=details
          )
        )
