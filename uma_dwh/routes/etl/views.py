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


@blueprint.route('/api/etl/errors/<error_id>', methods=('GET',))
@nocache
def get_error(error_id):
    error = etl.fetch_error(error_id)
    raise InvalidUsage.etl_error(f'get_error({error_id})', error)


@blueprint.route('/api/etl/<path:path>', methods=('GET', 'POST', 'DELETE', 'PUT',))
@nocache
@jwt_required
def get_sp_data(path):
    return execute_sp_func_from_view(path, request.method, path_sp_args_map)
