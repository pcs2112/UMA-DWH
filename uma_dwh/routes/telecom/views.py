from flask import Blueprint, jsonify


blueprint = Blueprint('telecom', __name__)


@blueprint.route('/api/telecom/skill', methods=('GET',))
def get_skills():
    return jsonify([
      {
        'id': 1,
        'table': 'D_REP_SKILL',
        'rep_skill_display_name': 'LeadCap',
        'insert_dttm': '2910-08-08',
        'update_dttm': '2910-08-08',
        'rep_skill_update_type': 'SNAPSHOT'
      },
      {
        'id': 2,
        'table': 'D_REP_SKILL',
        'rep_skill_display_name': 'LeadCap',
        'insert_dttm': '2910-08-08',
        'update_dttm': '2910-08-08',
        'rep_skill_update_type': 'SNAPSHOT'
      },
      {
        'id': 3,
        'table': 'D_REP_SKILL',
        'rep_skill_display_name': 'LeadCap',
        'insert_dttm': '2910-08-08',
        'update_dttm': '2910-08-08',
        'rep_skill_update_type': 'SNAPSHOT'
      },
      {
        'id': 3,
        'table': 'D_REP_SKILL',
        'rep_skill_display_name': 'LeadCap',
        'insert_dttm': '2910-08-08',
        'update_dttm': '2910-08-08',
        'rep_skill_update_type': 'SNAPSHOT'
      },
      {
        'id': 4,
        'table': 'D_REP_SKILL',
        'rep_skill_display_name': 'LeadCap',
        'insert_dttm': '2910-08-08',
        'update_dttm': '2910-08-08',
        'rep_skill_update_type': 'SNAPSHOT'
      }
    ])
