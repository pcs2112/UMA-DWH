from flask import Blueprint, request
from flask_jwt_extended import jwt_required
from uma_dwh.utils.nocache import nocache
from uma_dwh.utils.views import execute_sp_func_from_view
from .api_config import path_sp_args_map


blueprint = Blueprint('data_cubes', __name__)


@blueprint.route('/api/data_cubes/<path:path>', methods=('GET', 'POST', 'PUT',))
@nocache
@jwt_required
def get_sp_data(path):
    return execute_sp_func_from_view(path, request.method, path_sp_args_map)
