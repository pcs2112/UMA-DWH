path_sp_args_map = {
  'skills': {
    'GET': {
      'module_name': 'uma_dwh.db.telecom',
      'module_func': 'execute_sp',
      'sp_name': 'MWH_FILES.MANAGE_API_CONSOLE_DATA',
      'sp_message': 'LIST_SKILLS'
    },
    'PUT': {
      'module_name': 'uma_dwh.db.telecom',
      'module_func': 'save_skill',
      'sp_in_args': ['skill_id', 'skill_update_type']
    }
  },
  'workgroups': {
    'GET': {
      'module_name': 'uma_dwh.db.telecom',
      'module_func': 'execute_sp',
      'sp_name': 'MWH_FILES.MANAGE_API_CONSOLE_DATA',
      'sp_message': 'LIST_WORKGROUPS'
    }
  },
  'reps': {
    'GET': {
      'module_name': 'uma_dwh.db.telecom',
      'module_func': 'execute_sp',
      'sp_name': 'MWH_FILES.MANAGE_API_CONSOLE_DATA',
      'sp_message': 'LIST_REPS'
    }
  },
  'roles': {
    'GET': {
      'module_name': 'uma_dwh.db.telecom',
      'module_func': 'execute_sp',
      'sp_name': 'MWH_FILES.MANAGE_API_CONSOLE_DATA',
      'sp_message': 'LIST_ROLES'
    }
  }
}
