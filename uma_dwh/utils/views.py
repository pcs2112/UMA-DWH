import importlib
from flask import jsonify, request
from flask_jwt_extended import get_jwt_claims
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import SPException, DBValidationException
from uma_dwh.db.etl import fetch_error
from uma_dwh.db.users import fetch_user_by_email


def get_user_id():
  claims = get_jwt_claims()
  result = fetch_user_by_email(claims['email'])
  if result is None:
      raise SPException(
          f'Current user not available.',
          -1
      )
  
  return result['id']


def get_sp_func_in_args_from_request(http_method, path_data):
    """
    Returns the in args from the current request used for SP function call.
    :param http_method:
    :type http_method: str
    :param path_data:
    :type path_data: dict or list
    :return: List or dict of in arguments for the SP function call
    """
    as_dict = False if 'sp_name' in path_data else True
    request_args = {}
    
    if 'sp_in_args' in path_data:
        request_args = request.args if http_method == 'GET' else request.get_json(silent=True)
    
    # Inject the current user id to the SP in arguments
    if 'sp_in_args_inject_user' in path_data:
        request_args[path_data['sp_in_args_inject_user']] = get_user_id()
        if 'sp_in_args' not in path_data:
            path_data['sp_in_args'] = []

        path_data['sp_in_args'].append(path_data['sp_in_args_inject_user'])
      
    out_args = {} if as_dict else []

    if 'sp_in_args' in path_data and len(path_data['sp_in_args']) > 0:
        for required_arg in path_data['sp_in_args']:
            if required_arg not in request_args:
                raise SPException(
                    f'Missing required argument "{required_arg}".',
                    -1
                )

            if as_dict:
                out_args[required_arg] = request_args[required_arg]
            else:
                out_args.append(request_args[required_arg])

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
    
    if http_method in path_sp_args_map[path]:
        path_data = path_sp_args_map[path][http_method]
    else:
        path_data = path_sp_args_map[path]

    try:
        module = importlib.import_module(path_data['module_name'])
        func = getattr(module, path_data['module_func'])
        in_args = get_sp_func_in_args_from_request(http_method, path_data)

        if 'sp_name' in path_data:
            return jsonify(func(
              path_data['sp_name'],
              path_data['sp_message'],
              *in_args
            ))
        
        if 'sp_in_args_as_payload' in path_data:
            return jsonify(func(in_args))
        
        return jsonify(func(**in_args))
    except SPException as e:
        if e.error_id == -1:
            raise InvalidUsage.etl_error(message=e.message)

        raise InvalidUsage.etl_error(e.message, fetch_error(e.error_id))
    except DBValidationException as e:
        err_response = {}
        err_response[e.field_name] = e.message
        raise InvalidUsage.form_validation_error(err_response)
