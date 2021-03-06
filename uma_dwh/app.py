import logging
from logging.handlers import RotatingFileHandler
from flask import Flask, jsonify
from flask_jwt_extended import JWTManager
from uma_dwh.routes import (
  college_scorecard, error_type_resolution, etl, users, telecom, data_lake, data_cubes
)
from uma_dwh.db.mssql_db import init_db, close
from uma_dwh.extensions import cors
from uma_dwh.exceptions import InvalidUsage, http_error_template
from uma_dwh.json import JSONEnhanced
from uma_dwh.utils.opsgenie import init_opsgenie


def create_app(config_object):
    """An application factory, as explained here:
    http://flask.pocoo.org/docs/patterns/appfactories/.

    :param config_object: The configuration object to use.
    """
    app = Flask(__name__.split('.')[0])
    app.url_map.strict_slashes = False
    app.config.from_object(config_object)
    app.json_encoder = JSONEnhanced

    register_db(app)
    register_opsgenie(app)
    register_blueprints(app)
    register_jwt(app)
    register_errorhandlers(app)
    register_logger(app)

    return app


def register_db(app):
    init_db(app.config)
    app.teardown_request(close)


def register_opsgenie(app):
    init_opsgenie(app.config)


def register_blueprints(app):
    """Register Flask blueprints."""
    origins = app.config.get('CORS_ORIGIN_WHITELIST', '*')
    cors.init_app(college_scorecard.views.blueprint, origins=origins)
    cors.init_app(error_type_resolution.views.blueprint, origins=origins)
    cors.init_app(etl.views.blueprint, origins=origins)
    cors.init_app(users.views.blueprint, origins=origins)
    cors.init_app(telecom.views.blueprint, origins=origins)
    cors.init_app(data_lake.views.blueprint, origins=origins)

    app.register_blueprint(college_scorecard.views.blueprint)
    app.register_blueprint(error_type_resolution.views.blueprint)
    app.register_blueprint(etl.views.blueprint)
    app.register_blueprint(users.views.blueprint)
    app.register_blueprint(telecom.views.blueprint)
    app.register_blueprint(data_lake.views.blueprint)
    app.register_blueprint(data_cubes.views.blueprint)


def register_errorhandlers(app):
    """Register api error handling"""
    def error_handler(error):
        response = error.to_json()
        response.status_code = error.status_code
        return response

    app.errorhandler(InvalidUsage)(error_handler)


def register_logger(app):
    """Register the application logging"""
    if app.config['LOGGING_ENABLED']:
        formatter = logging.Formatter("[%(asctime)s] {%(pathname)s:%(lineno)d} %(levelname)s - %(message)s")
        log_handler = RotatingFileHandler(app.config['APP_DIR'] + '/logs/app.txt', maxBytes=100000, backupCount=5)
        log_handler.setFormatter(formatter)
        log_handler.setLevel(app.config['LOGGING_LEVEL'])
        app.logger.setLevel(app.config['LOGGING_LEVEL'])
        app.logger.addHandler(log_handler)


def register_jwt(app):
    """Register JWT and its loaders"""
    jwt = JWTManager(app)

    @jwt.user_claims_loader
    def add_claims_to_access_token(identity):
        return {
          'email': identity
        }

    @jwt.unauthorized_loader
    def unauthorized_loader_callback(err):
        return jsonify(http_error_template(401, 'JWT_ERROR', err, [])['message']), 401

    @jwt.invalid_token_loader
    def invalid_token_loader_callback(err):
        return jsonify(http_error_template(422, 'JWT_ERROR', err, [])['message']), 422

    @jwt.expired_token_loader
    def expired_token_loader_callback(err):
        return jsonify(http_error_template(401, 'JWT_ERROR', err, [])['message']), 401

    @jwt.revoked_token_loader
    def revoked_token_loader_callback(err):
        return jsonify(http_error_template(401, 'JWT_ERROR', err, [])['message']), 401
