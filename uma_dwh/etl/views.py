import uma_dwh.db.etl as etl
from flask import Blueprint, jsonify
from webargs.flaskparser import use_args
from flask_jwt_extended import jwt_required
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import SPException
from uma_dwh.utils.opsgenie import send_alert
from uma_dwh.utils.nocache import nocache
from .api_schemas import *


blueprint = Blueprint('etl', __name__)


@blueprint.route('/api/etl/control_manager', methods=('GET',))
@nocache
@jwt_required
def get_control_manager():
    return jsonify(etl.execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS', 'LIST_CONTROL_MANAGER_DETAILS'
    ))


@blueprint.route('/api/etl/status', methods=('GET',))
@nocache
def get_status():
    return jsonify(etl.fetch_current_status())


@blueprint.route('/api/etl/history', methods=('GET',))
@nocache
@jwt_required
@use_args(pagination_args, locations=('query',))
def get_history(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
          'LOAD_ETL_HISTORY',
          args['start_cycle_group'],
          args['end_cycle_group'],
          args['date']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/reports', methods=('GET',))
@nocache
@jwt_required
@use_args(reports_args, locations=('query',))
def get_reports(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
          'REPORT_SELECT_BY_DATE',
          args['date']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/report_history', methods=('GET',))
@nocache
@jwt_required
@use_args(report_history_args, locations=('query',))
def get_report_history(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
          'DISPLAY_REPORT_BY_DATE',
          args['report_name'],
          args['date']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/procedure_history', methods=('GET',))
@nocache
@jwt_required
@use_args(procedure_history_args, locations=('query',))
def get_procedure_history(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
          'GET_ETL_PROCEDURE_HISTORY',
          args['db_name'],
          args['procedure_name'],
          args['date']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/servers', methods=('GET',))
@nocache
@jwt_required
def get_servers():
    try:
        return jsonify(etl.fetch_servers())
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/errors/<error_id>/alert', methods=('GET',))
@nocache
def post_error_alert(error_id):
    send_alert(error_id)


@blueprint.route('/api/etl/errors/<error_id>', methods=('GET',))
@nocache
def get_error(error_id):
    error = etl.fetch_error(error_id)
    raise InvalidUsage.etl_error(f'get_error({error_id})', error)


@blueprint.route('/api/etl/run_check', methods=('GET',))
@nocache
@jwt_required
@use_args(run_check_args, locations=('query',))
def get_run_check(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE', 'RUN_CHECK', args['run_check_name']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/procedure_runtime_chart_data', methods=('GET',))
@nocache
@jwt_required
@use_args(procedure_runtime_chart_data_args, locations=('query',))
def get_procedure_runtime_chart_data(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
          'LOAD_ETL_SEARCH_CHART',
          args['procedure_name'],
          args['date'],
          args['months']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/report_runtime_chart_data', methods=('GET',))
@nocache
@jwt_required
@use_args(report_runtime_chart_data_args, locations=('query',))
def get_report_runtime_chart_data(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
          'LOAD_REPORT_SEARCH_CHART',
          args['report_name'],
          args['date'],
          args['months']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/try_catch_errors_chart_data', methods=('GET',))
@nocache
@jwt_required
@use_args(try_catch_errors_chart_data_args, locations=('query',))
def get_try_catch_errors_chart_data(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
          'LOAD_TryCatch_Search_Chart',
          args['date'],
          args['months']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/try_catch_errors', methods=('GET',))
@nocache
@jwt_required
@use_args(try_catch_errors_args, locations=('query',))
def get_try_catch_errors(args):
    try:
        return jsonify(etl.execute_admin_console_sp(
          'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
          'DISPLAY_TryCatch_Daily_Errors',
          args['date']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))
