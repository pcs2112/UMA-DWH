import uma_dwh.db.etl as etl
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import SPException
from uma_dwh.utils.opsgenie import send_alert
from uma_dwh.utils.nocache import nocache
from .api_config import path_sp_args_map


blueprint = Blueprint('etl', __name__)


@blueprint.route('/api/etl/status', methods=('GET',))
@nocache
def get_status():
    return jsonify(etl.fetch_current_status())


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


@blueprint.route('/api/etl/<path:path>', methods=('GET',))
@nocache
@jwt_required
def get_sp_data(path):
    if path not in path_sp_args_map:
        raise InvalidUsage.not_found()

    path_data = path_sp_args_map[path]

    try:
        func = getattr(etl, path_data['sp_func'])

        return jsonify(func(
          path_data['sp_name'],
          path_data['sp_message'],
          path_data['sp_in_args'] if 'sp_in_args' in path_data else [],
          request.args
        ))
    except SPException as e:
        if e.error_id == -1:
            raise InvalidUsage.etl_error(message=e.message)

        raise InvalidUsage.etl_error(e.message, etl.fetch_error(e.error_id))
