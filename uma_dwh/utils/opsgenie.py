from opsgenie.swagger_client import AlertApi
from opsgenie.swagger_client import configuration
from opsgenie.swagger_client.models import CreateAlertRequest
from uma_dwh.db.etl import fetch_error


def init_opsgenie(app):
    configuration.api_key['Authorization'] = app.config['OPSGENIE_API_KEY']
    configuration.api_key_prefix['Authorization'] = app.config['OPSGENIE_GENIE_KEY']


def send_alert(error_id):
    error = fetch_error(error_id)
    response = AlertApi().create_alert(
        body=CreateAlertRequest(
            message='UMA DWH Error',
            priority='P3',
            details={
              'error_id': error['id'],
              'error_dttm': error['insert_dttm'],
              'error_severity': error['error_severity'],
              'error_state': error['error_state'],
              'error_procedure': error['error_procedure'],
              'error_line': error['error_line'],
              'error_message': error['error_message'],
              'error_etl_procedure_name': error['etl_procedure_name']
            }
        )
    )


def send_etl_status_alert():
    response = AlertApi().create_alert(
      body=CreateAlertRequest(
        message='UMA DWH ETL FAILED RUNNING',
        priority='P3'
      )
    )
