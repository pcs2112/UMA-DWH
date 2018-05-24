from flask import Blueprint, jsonify, request
from flask_jwt_extended import (create_access_token, create_refresh_token, jwt_required, jwt_refresh_token_required,
                                get_jwt_identity, get_jwt_claims)
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.users import fetch_users, fetch_user_by_email, login_user


blueprint = Blueprint('users', __name__)


@blueprint.route('/api/users/current', methods=('GET',))
@jwt_required
def get_current_user():
    claims = get_jwt_claims()
    result = fetch_user_by_email(claims['email'])
    if result is None:
        raise InvalidUsage.unauthorized_request()

    return jsonify(result)


@blueprint.route('/api/users/login', methods=('POST',))
def post_login():
    body = request.get_json(silent=True)
    result = login_user(body['email'], body['password'])
    if result == -1:
        raise InvalidUsage.form_validation_error('Invalid account.', {'email': 'Invalid account.'})

    if result == -2:
        raise InvalidUsage.form_validation_error('Invalid password.', {'password': 'Invalid password.'})

    access_token = create_access_token(identity=body['email'])
    refresh_token = create_refresh_token(identity=body['email'])
    return jsonify({
      'access_token': access_token,
      'refresh_token': refresh_token
    })


@blueprint.route('/api/users/refresh_token', methods=('GET',))
@jwt_refresh_token_required
def get_refresh_token():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    return jsonify({
      'access_token': access_token
    })


@blueprint.route('/api/users', methods=('GET',))
@jwt_required
def get_users():
    return jsonify(fetch_users())
