import importlib
import re
from flask import jsonify, request
from flask_jwt_extended import get_jwt_claims
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import SPException, DBValidationException
from uma_dwh.db.etl import fetch_error
from uma_dwh.db.users import fetch_user_by_email


def _build_path_pattern(path):
    path_regex = re.sub(r'(<\w+>)', r'(?P\1.+)', path)
    return re.compile("^{}$".format(path_regex))


def _get_normalized_path(path, path_sp_args_map):
  if path in path_sp_args_map:
      return path
  
  for curr_path in path_sp_args_map:
      path_pattern = _build_path_pattern(curr_path)
      m = path_pattern.match(path)
      if m:
          return curr_path
  
  return None


def _get_sp_func_in_args_from_request(path, normalized_path, http_method, path_data):
    """
    Returns the in args from the current request used for SP function call.
    :param path:
    :type path: str
    :param normalized_path:
    :type normalized_path: str
    :param http_method:
    :type http_method: str
    :param path_data:
    :type path_data: dict or list
    :return: List or dict of in arguments for the SP function call
    """
    as_dict = False if 'sp_name' in path_data else True
    request_args = {}
    
    sp_in_args = [] if 'sp_in_args' not in path_data else path_data['sp_in_args'].copy()
    
    if len(sp_in_args) > 0:
        request_args = request.args.to_dict() if http_method == 'GET' else request.get_json(silent=True)

    # Inject the parameters found in the URL
    if '<' in normalized_path:
        path_pattern = _build_path_pattern(normalized_path)
        m = path_pattern.match(path)
        path_params = m.groupdict()
        for path_param in path_params:
            request_args[path_param] = path_params[path_param]
            sp_in_args.append(path_param)
    
    # Inject the current user id to the SP in arguments
    if 'sp_in_args_inject_user' in path_data:
        request_args[path_data['sp_in_args_inject_user']] = get_user_id()
        sp_in_args.append(path_data['sp_in_args_inject_user'])

    out_args = {} if as_dict else []

    if len(sp_in_args) > 0:
        for required_arg in sp_in_args:
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


def get_user_id():
    claims = get_jwt_claims()
    result = fetch_user_by_email(claims['email'])
    if result is None:
        raise SPException(
          f'Current user not available.',
          -1
        )
    
    return result['id']


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
    # Get the normalized path
    normalized_path = _get_normalized_path(path, path_sp_args_map)
    
    # Get the path config data
    if normalized_path not in path_sp_args_map:
        raise InvalidUsage.not_found()
    
    if http_method in path_sp_args_map[normalized_path]:
        path_data = path_sp_args_map[normalized_path][http_method]
    else:
        path_data = path_sp_args_map[normalized_path]
        
    # Execute the resolved module function
    try:
        module = importlib.import_module(path_data['module_name'])
        func = getattr(module, path_data['module_func'])
        in_args = _get_sp_func_in_args_from_request(path, normalized_path, http_method, path_data)

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
