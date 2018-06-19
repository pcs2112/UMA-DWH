from flask import Blueprint, jsonify
from webargs.flaskparser import use_args
from flask_jwt_extended import jwt_required
from uma_dwh.db.etl import (fetch_control_manager, fetch_current_status, fetch_cycle_history,
                            fetch_powerbi_report_history, fetch_powerbi_report_statistics, fetch_procedure_history,
                            fetch_server_db_procedures, fetch_servers, fetch_error, fetch_run_check)
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import SPException
from uma_dwh.utils.opsgenie import send_alert
from .api_schemas import (pagination_args, run_check_args, procedure_history_args, server_db_procedures_args,
                          powerbi_report_history_args, powerbi_report_statistics_args)


blueprint = Blueprint('etl', __name__)


@blueprint.route('/api/etl/control_manager', methods=('GET',))
@jwt_required
def get_control_manager():
    return jsonify(fetch_control_manager())


@blueprint.route('/api/etl/status', methods=('GET',))
@jwt_required
def get_status():
    return jsonify(fetch_current_status())


@blueprint.route('/api/etl/history', methods=('GET',))
@jwt_required
@use_args(pagination_args, locations=('query',))
def get_history(args):
    try:
        return jsonify(fetch_cycle_history(args['start_cycle_group'], args['end_cycle_group']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))


@blueprint.route('/api/etl/powerbi_report_history', methods=('GET',))
@jwt_required
@use_args(powerbi_report_history_args, locations=('query',))
def get_powerbi_report_history(args):
    try:
        return jsonify(fetch_powerbi_report_history(args['start_date'], args['end_date']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))


@blueprint.route('/api/etl/powerbi_report_statistics', methods=('GET',))
@jwt_required
@use_args(powerbi_report_statistics_args, locations=('query',))
def get_powerbi_report_statistics(args):
    try:
        return jsonify(fetch_powerbi_report_statistics(args['report_name']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))


@blueprint.route('/api/etl/procedure_history', methods=('GET',))
@jwt_required
@use_args(procedure_history_args, locations=('query',))
def get_procedure_history(args):
    try:
        return jsonify(fetch_procedure_history(args['db_name'], args['procedure_name']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))


@blueprint.route('/api/etl/server_db_procedures', methods=('GET',))
@jwt_required
@use_args(server_db_procedures_args, locations=('query',))
def get_server_db_procedures(args):
    try:
        return jsonify(fetch_server_db_procedures(args.server_name, args.db_name))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))


@blueprint.route('/api/etl/servers', methods=('GET',))
@jwt_required
def get_servers():
    try:
        return jsonify(fetch_servers())
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))


@blueprint.route('/api/etl/errors/<error_id>/alert', methods=('GET',))
def post_error_alert(error_id):
    send_alert(error_id)


@blueprint.route('/api/etl/errors/<error_id>', methods=('GET',))
def get_error(error_id):
    error = fetch_error(error_id)
    raise InvalidUsage.etl_error(f'get_error({error_id})', error)


@blueprint.route('/api/etl/run_check', methods=('GET',))
@jwt_required
@use_args(run_check_args, locations=('query',))
def get_run_check(args):
    try:
        return jsonify(fetch_run_check(args['run_check_name']))
    except SPException as e:
        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))
