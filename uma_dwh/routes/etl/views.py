import uma_dwh.db.etl as etl
from flask import Blueprint
from flask_jwt_extended import jwt_required
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.utils.opsgenie import send_alert
from uma_dwh.utils.nocache import nocache
from uma_dwh.utils.views import execute_sp_func_from_view
from .api_config import path_sp_args_map


blueprint = Blueprint('etl', __name__)


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
    return execute_sp_func_from_view(path, path_sp_args_map)
