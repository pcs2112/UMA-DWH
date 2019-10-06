from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from uma_dwh.utils.nocache import nocache


blueprint = Blueprint('data_cubes', __name__)


@blueprint.route('/api/data_cubes/cubes', methods=('GET',))
@nocache
@jwt_required
def get_entries():
    data = [
        {
            'id': 1,
            'active': '2019-10-03',
            'cube_name': 'Marketing call for student placement',
            'multi_fact': 'Yes',
            'primary_fact_table': 'F_MCS_CALLS',
            'schedule_type': 'Daily (overnight)',
            'facts_date_range': '2018-01-01 - current'
        }
    ]
    return jsonify(data)

