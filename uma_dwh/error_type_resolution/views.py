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
def post_file():
    body = request.get_json(silent=True)
    try:
        return jsonify(create_file(body.description, body.file_path_filename))
    except DBException:
        raise InvalidUsage.etl_error(message='Error creating file.')


@blueprint.route('/api/error_type_resolution/files/<file_id>', methods=('POST',))
@jwt_required
def post_file(file_id):
    body = request.get_json(silent=True)
    try:
        return jsonify(update_file(file_id, body.description, body.file_path_filename))
    except DBException:
        raise InvalidUsage.etl_error(message='Error updating file.')
