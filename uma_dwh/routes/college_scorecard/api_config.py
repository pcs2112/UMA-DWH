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
  'save_report_table': {
    'module_name': 'uma_dwh.db.college_scorecard',
    'module_func': 'save_report_table',
    'sp_in_args': ['table_name', 'table_schema', 'report_id', 'filename', 'overwrite']
  },
  'reports': {
    'GET': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'fetch_reports',
      'sp_in_args_inject_user': 'user_id'
    },
    'POST': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'create_report',
      'sp_in_args': ['report_name', 'report_descrip', 'share_dttm', 'columns'],
      'sp_in_args_inject_user': 'user_id',
      'sp_in_args_as_payload': True
    },
    'PUT': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'update_report',
      'sp_in_args': ['report_name', 'report_descrip', 'share_dttm', 'columns'],
      'sp_in_args_inject_user': 'user_id',
      'sp_in_args_as_payload': True
    }
  },
  'reports/<id_>': {
    'GET': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'fetch_report_by_id',
      'sp_in_args_inject_user': 'user_id'
    }
  },
  'reports/column': {
    'POST': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'save_uma_column_title',
      'sp_in_args_inject_user': 'user_id',
      'sp_in_args': ['column_name', 'uma_excel_column_name']
    }
  },
  'categories': {
    'GET': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'execute_categories_sp',
      'sp_name': 'MWH_FILES.MANAGE_COLLEGE_SCORECARD_D_CATEGORY',
      'sp_message': 'LIST_COLLEGE_SCORECARD_D_CATEGORIES'
    },
    'POST': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'create_category',
      'sp_in_args': ['category', 'description', 'formula', 'file_name', 'where_unit_id_table'],
      'sp_in_args_inject_user': 'user_id',
      'sp_in_args_as_payload': True
    },
    'PUT': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'update_category',
      'sp_in_args': ['category', 'description', 'formula', 'file_name', 'where_unit_id_table'],
      'sp_in_args_inject_user': 'user_id',
      'sp_in_args_as_payload': True
    }
  },
  'formula_tables': {
    'GET': {
      'module_name': 'uma_dwh.db.college_scorecard',
      'module_func': 'execute_categories_sp',
      'sp_name': 'MWH_FILES.MANAGE_COLLEGE_SCORECARD_D_CATEGORY',
      'sp_message': 'LIST_COLLEGE_SCORECARD_FORMULA_TABLES'
    }
  }
}
