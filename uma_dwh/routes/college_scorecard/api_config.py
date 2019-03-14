path_sp_args_map = {
  'files': {
    'module_name': 'uma_dwh.db.etl',
    'module_func': 'execute_admin_console_sp',
    'sp_name': 'MWH_FILES.MANAGE_CollegeScorecard_Console',
    'sp_message': 'LIST CSV FILES'
  },
  'data/details': {
    'module_name': 'uma_dwh.db.etl',
    'module_func': 'execute_admin_console_sp',
    'sp_name': 'MWH_FILES.MANAGE_CollegeScorecard_Console',
    'sp_message': 'LIST DATA',
    'sp_in_args': ['mode', 'filename', 'populated']
  },
  'data/summary': {
    'module_name': 'uma_dwh.db.etl',
    'module_func': 'execute_admin_console_sp',
    'sp_name': 'MWH_FILES.MANAGE_CollegeScorecard_Console',
    'sp_message': 'LIST DATA',
    'sp_in_args': ['mode', 'filename', 'group']
  },
  'reports': {
    'module_name': 'uma_dwh.db.etl',
    'module_func': 'execute_admin_console_sp',
    'sp_name': 'MWH_FILES.MANAGE_CollegeScorecard_Console',
    'sp_message': 'GET USER REPORTS',
    'sp_in_args': ['uid']
  }
}
