import sys
import uma_dwh.db.etl
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
    data_marts_ct = len(data_marts)
    failed_data_marts = []
    for data_mart in data_marts:
        if 'data_mart_send_alert' in data_mart and data_mart['data_mart_send_alert']:
            failed_data_marts.append(data_mart['data_mart_name'])

    failed_data_marts_ct = len(failed_data_marts)

    if failed_data_marts_ct > 0:
        error_details = 'ALL Data marts failed.'
        if failed_data_marts_ct < data_marts_ct:
            error_details = ', '.join(str(failed_data_mart) for failed_data_mart in failed_data_marts)

        return _send_alert('DWH ETL FAILED RUNNING', 'P3', {
          'error_data_marts': error_details
        })


def _send_alert(message, priority, details):
    if this.is_enabled:
        response = AlertApi().create_alert(
          body=CreateAlertRequest(
            message=message,
            priority=priority,
            details=details
          )
        )
