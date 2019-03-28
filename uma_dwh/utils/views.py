import importlib
from flask import jsonify, request
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import SPException, DBValidationException
from uma_dwh.db.etl import fetch_error


def get_sp_func_in_args_from_dict(required_args, args):
    """
    Returns the in args for a helper SP function.
    :param required_args:
    :type required_args: list
    :param args:
    :type args: dict
    :return: List of in arguments for the admin_console_sp function
    """
    out_args = []

    if len(required_args) > 0:
        for required_arg in required_args:
            if required_arg not in args:
                raise SPException(
                  f' Missing required argument "{required_arg}".',
                  -1
                )

            out_args.append(args[required_arg])

    return out_args


def execute_sp_func_from_view(path, http_method, path_sp_args_map):
    """
    Executes a SP function helper from a Flask view.
    :param path:
    :type path: str
    :param http_method: HTTP method name
    :type http_method: str
    :param path_sp_args_map:
    :type path_sp_args_map: dict
    :return: List of in arguments for the SP function helper call
    """
    if path not in path_sp_args_map:
        raise InvalidUsage.not_found()

    path_data = path_sp_args_map[path]

    try:
        module = importlib.import_module(path_data['module_name'])
        func = getattr(module, path_data['module_func'])

        #  Get the SP in arguments from the request
        in_args = []
        if 'sp_in_args' in path_data:
            req_args = request.args if http_method == 'GET' else request.get_json(silent=True)

            in_args = get_sp_func_in_args_from_dict(
              path_data['sp_in_args'],
              req_args
            )

        if 'sp_name' in path_data:
            return jsonify(func(
              path_data['sp_name'],
              path_data['sp_message'],
              *in_args
            ))

        return jsonify(func(*in_args))
    except SPException as e:
        if e.error_id == -1:
            raise InvalidUsage.etl_error(message=e.message)

        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))
    except DBValidationException as e:
        err_response = {}
        err_response[e.field_name] = e.message
        raise InvalidUsage.form_validation_error(err_response)
