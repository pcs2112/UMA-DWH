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
    return jsonify(etl.fetch_control_manager())


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
        return jsonify(etl.fetch_cycle_history(args['start_cycle_group'], args['end_cycle_group']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/powerbi_report_history', methods=('GET',))
@nocache
@jwt_required
@use_args(powerbi_report_history_args, locations=('query',))
def get_powerbi_report_history(args):
    try:
        return jsonify(etl.fetch_powerbi_report_history(args['start_date'], args['end_date']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/powerbi_report_statistics', methods=('GET',))
@nocache
@jwt_required
@use_args(powerbi_report_statistics_args, locations=('query',))
def get_powerbi_report_statistics(args):
    try:
        return jsonify(etl.fetch_powerbi_report_statistics(args['report_name']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/powerbi_report_runs', methods=('GET',))
@nocache
@jwt_required
@use_args(powerbi_report_runs_args, locations=('query',))
def get_powerbi_report_runs(args):
    try:
        return jsonify(etl.fetch_powerbi_report_runs(args['report_name'], args['from_num'], args['to_num']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/procedure_history', methods=('GET',))
@nocache
@jwt_required
@use_args(procedure_history_args, locations=('query',))
def get_procedure_history(args):
    try:
        return jsonify(etl.fetch_procedure_history(args['db_name'], args['procedure_name']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/server_db_procedures', methods=('GET',))
@nocache
@jwt_required
@use_args(server_db_procedures_args, locations=('query',))
def get_server_db_procedures(args):
    try:
        return jsonify(etl.fetch_server_db_procedures(args.server_name, args.db_name))
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
        return jsonify(etl.fetch_run_check(args['run_check_name']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))


@blueprint.route('/api/etl/procedure_runtime_chart_data', methods=('GET',))
@nocache
@jwt_required
@use_args(procedure_runtime_chart_data_args, locations=('query',))
def get_procedure_runtime_chart_data(args):
    try:
        return jsonify(etl.fetch_procedure_runtime_chart_data(
          args['procedure_name'], args['start_date'], args['months']
        ))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))
