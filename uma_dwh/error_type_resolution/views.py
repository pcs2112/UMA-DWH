from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import DBException
from uma_dwh.db.error_type_resolution import fetch_files, create_file, update_file


blueprint = Blueprint('error_type_resolution', __name__)


@blueprint.route('/api/error_type_resolution/files', methods=('GET',))
@jwt_required
def get_files():
    return jsonify(fetch_files())


@blueprint.route('/api/error_type_resolution/files', methods=('POST',))
@jwt_required
def post_create_file():
    body = request.get_json(silent=True)
    try:
        return jsonify(create_file(body['description'], body['file_path_filename']))
    except DBException as e:
        if e.code == -1:
            raise InvalidUsage.form_validation_error({'file_path_filename': e.message})
        else:
            raise InvalidUsage.etl_error(message='Error updating file.')


@blueprint.route('/api/error_type_resolution/files/<file_id>', methods=('POST',))
@jwt_required
def post_update_file(file_id):
    body = request.get_json(silent=True)
    try:
        return jsonify(update_file(file_id, body['file_path_filename'], body['description']))
    except DBException as e:
        if e.code == -1:
            raise InvalidUsage.form_validation_error({'file_path_filename': e.message})
        else:
            raise InvalidUsage.etl_error(message='Error updating file.')
