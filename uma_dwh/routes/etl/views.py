import uma_dwh.db.etl as etl
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.utils.nocache import nocache
from uma_dwh.utils.views import execute_sp_func_from_view
from .api_config import path_sp_args_map


blueprint = Blueprint('etl', __name__)


@blueprint.route('/api/etl/status', methods=('GET',))
@nocache
def get_data_marts_status():
    return jsonify(etl.check_current_status())


@blueprint.route('/api/statistics/tables', methods=('POST',))
@nocache
def post_run_stats():
    body = request.get_json(silent=True)
    etl.run_stats(body['tables'])
    return jsonify(body['tables'])


@blueprint.route('/api/etl/errors/<error_id>', methods=('GET',))
@nocache
def get_error(error_id):
    error = etl.fetch_error(error_id)
    raise InvalidUsage.etl_error(f'get_error({error_id})', error)


@blueprint.route('/api/etl/<path:path>', methods=('GET',))
@nocache
@jwt_required
def get_sp_data(path):
    return execute_sp_func_from_view(path, path_sp_args_map)
