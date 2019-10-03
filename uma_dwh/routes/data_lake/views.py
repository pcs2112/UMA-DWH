from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from uma_dwh.utils.nocache import nocache


blueprint = Blueprint('data_lake', __name__)


@blueprint.route('/api/data_lake/entries', methods=('GET',))
@nocache
@jwt_required
def get_entries():
    data = [
        {
            'id': 1,
            'primary_source': 'US Census Bureau',
            'data_type': 'Total Work Experience',
            'data_range': 'yearly',
            'data_format': 'csv',
            'file': 'US Census Bureau.csv',
            'url': 'www.census.gov/stats',
            'file_location': 'mnt/hgfs/UMA_DATA/UMA-DWH/US Census Bureau.csv',
            'data_lake_table': 'DLake.USCB_Wrk_Exp'
        }
    ]
    return jsonify(data)

