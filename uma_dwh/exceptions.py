""" Implemented module for api errors as mentioned in http://flask.pocoo.org/docs/0.12/patterns/apierrors/ """
from flask import jsonify


def http_error_template(status_code, error_type, message, payload):
    return {
      'message': {
        'status_code': status_code,
        'error_type': error_type,
        'message': message,
        'payload': payload
      }
    }


INVALID_REQUEST = http_error_template(400, 'INVALID_REQUEST', 'Invalid request.', [])
UNAUTHORIZED_REQUEST = http_error_template(401, 'UNAUTHORIZED_REQUEST', 'Unauthorized request.', [])
INVALID_ACTION = http_error_template(403, 'INVALID_ACTION', 'Invalid action.', [])
NOT_FOUND = http_error_template(404, 'NOT_FOUND', 'Invalid route.', [])
UNKNOWN_ERROR = http_error_template(500, 'UNKNOWN_ERROR', 'Unknown error.', [])


class InvalidUsage(Exception):
    status_code = 500
    error_type = 'UNKNOWN_ERROR'

    def __init__(self, message, status_code=None, error_type=None, payload=None):
        Exception.__init__(self)
        self.message = message

        if 'status_code' in message:
            status_code = message['status_code']

        if status_code is not None:
            self.status_code = status_code

        if 'error_type' in message:
            error_type = message['error_type']

        if error_type is not None:
            self.error_type = error_type

        self.payload = payload

    def to_json(self):
        rv = self.message
        return jsonify(rv)

    @classmethod
    def invalid_request(cls):
        return cls(**INVALID_REQUEST)

    @classmethod
    def unauthorized_request(cls):
        return cls(**UNAUTHORIZED_REQUEST)

    @classmethod
    def invalid_action(cls):
        return cls(**INVALID_ACTION)

    @classmethod
    def not_found(cls):
        return cls(**NOT_FOUND)

    @classmethod
    def unknown_error(cls):
        return cls(**UNKNOWN_ERROR)

    @classmethod
    def etl_error(cls, message, payload=None):
        etl_error = http_error_template(500, 'ETL_ERROR', message, payload)
        return cls(**etl_error)

    @classmethod
    def form_validation_error(cls, payload):
        form_validation_error = http_error_template(401, 'FORM_VALIDATION_ERROR', 'Validation error.', payload)
        return cls(**form_validation_error)
