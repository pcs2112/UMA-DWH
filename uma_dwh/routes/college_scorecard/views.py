import xlwt
import mimetypes
import io
from flask import Blueprint, request, Response
from werkzeug.datastructures import Headers
from flask_jwt_extended import jwt_required
from uma_dwh.utils.nocache import nocache
from uma_dwh.utils.views import execute_sp_func_from_view
from uma_dwh.db.college_scorecard import get_export_data
from .api_config import path_sp_args_map


blueprint = Blueprint('college_scorecard', __name__)


@blueprint.route('/api/college_scorecard/export', methods=('POST',))
def post_export():
    body = request.get_json(silent=True)
    
    # Get export data
    data = get_export_data(body['columns'], body['in_filename'])
    
    # Create workbook
    wb = xlwt.Workbook(encoding='UTF-8')
    ws = wb.add_sheet('DATA')

    for i, row in enumerate(data):
        for x, cell in enumerate(row):
            ws.write(i, x, cell)
            if i == 0:
                ws.col(x).width = (len(row[x]) + 4) * 367

    output = io.BytesIO()
    wb.save(output)
    
    # Create response object
    response = Response()
    response.status_code = 200
    response.data = output.getvalue()
    
    filename = body['out_filename']
    mimetype_tuple = mimetypes.guess_type(filename)

    # HTTP headers for forcing file download
    response_headers = Headers({
      'Pragma': 'public',
      'Expires': '0',
      'Cache-Control': 'must-revalidate, post-check=0, pre-check=0',
      'Content-Type': 'application/ms-excel',
      'Content-Disposition': 'attachment; filename=\"%s\";' % filename,
      'Content-Transfer-Encoding': 'binary',
      'Content-Length': len(response.data)
    })

    if not mimetype_tuple[1] is None:
        response.update({
          'Content-Encoding': mimetype_tuple[1]
        })

    response.headers = response_headers

    return response


@blueprint.route('/api/college_scorecard/<path:path>', methods=('GET', 'POST'))
@nocache
@jwt_required
def get_sp_data(path):
    return execute_sp_func_from_view(path, request.method, path_sp_args_map)
