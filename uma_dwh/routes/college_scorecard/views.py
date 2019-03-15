import mimetypes
from flask import Blueprint, request, Response, jsonify
from werkzeug.datastructures import Headers
from flask_jwt_extended import jwt_required, get_jwt_claims
from uma_dwh.utils.nocache import nocache
from uma_dwh.utils.views import execute_sp_func_from_view
from uma_dwh.db.college_scorecard import get_excel_export_data, fetch_reports, fetch_report_by_id, create_report
from uma_dwh.db.users import fetch_user_by_email
from uma_dwh.exceptions import InvalidUsage
from uma_dwh.db.exceptions import DBException
from .api_config import path_sp_args_map


blueprint = Blueprint('college_scorecard', __name__)


def get_user_id():
    claims = get_jwt_claims()
    result = fetch_user_by_email(claims['email'])
    if result is None:
      raise InvalidUsage.unauthorized_request()
    
    return result['id']


@blueprint.route('/api/college_scorecard/export', methods=('POST',))
@jwt_required
def post_export():
    body = request.get_json(silent=True)
    in_filename = body['in_filename']
    out_filename = body['out_filename']
    
    # Get export data
    output = get_excel_export_data(body['columns'], in_filename)

    # Create response object
    response = Response()
    response.status_code = 200
    response.data = output
    
    mimetype_tuple = mimetypes.guess_type(out_filename)

    # HTTP headers for forcing file download
    response_headers = Headers({
      'Pragma': 'public',
      'Expires': '0',
      'Cache-Control': 'must-revalidate, post-check=0, pre-check=0',
      'Content-Type': mimetype_tuple[0],
      'Content-Disposition': 'attachment; filename=\"%s\";' % out_filename,
      'Content-Transfer-Encoding': 'binary',
      'Content-Length': len(response.data)
    })

    if not mimetype_tuple[1] is None:
        response.update({
          'Content-Encoding': mimetype_tuple[1]
        })

    response.headers = response_headers

    return response
    

@blueprint.route('/api/college_scorecard/reports', methods=('GET',))
@nocache
@jwt_required
def get_reports():
    try:
        return jsonify(fetch_reports(get_user_id()))
    except DBException as e:
        raise InvalidUsage.form_validation_error({'report_name': e.message})
    

@blueprint.route('/api/college_scorecard/reports', methods=('POST',))
@nocache
@jwt_required
def post_report():
    body = request.get_json(silent=True)
    try:
        return jsonify(create_report(get_user_id(), body))
    except DBException as e:
        raise InvalidUsage.form_validation_error({'report_name': e.message})
    
    
@blueprint.route('/api/college_scorecard/reports/<report_id>', methods=('GET',))
@nocache
@jwt_required
def get_report(report_id):
    try:
        return jsonify(fetch_report_by_id(report_id, get_user_id()))
    except DBException as e:
        raise InvalidUsage.form_validation_error({'report_name': e.message})


@blueprint.route('/api/college_scorecard/<path:path>', methods=('GET', 'POST'))
@nocache
@jwt_required
def get_sp_data(path):
    return execute_sp_func_from_view(path, request.method, path_sp_args_map)
