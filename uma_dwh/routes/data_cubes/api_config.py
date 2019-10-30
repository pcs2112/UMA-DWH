path_sp_args_map = {
  'cubes': {
    'GET': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'manage_cubes',
      'sp_name': 'UMA_CUBEVIEW.MANAGE_CUBEVIEW_DATA',
      'sp_message': 'LIST_CUBES'
    },
    'POST': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'save_cube',
      'sp_in_args': [
        'cube_name', 'active_flag', 'view_name', 'table_name', 'materialize', 'cube_date_start', 'cube_date_end', 'schedule', 'definition'
      ]
    }
  },
  'schedule': {
    'GET': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'manage_cubes_schedule',
      'sp_name': 'UMA_CUBEVIEW.MANAGE_CUBEVIEW_SCHEDULE',
      'sp_message': 'GET_SCHEDULE',
      'sp_in_args': ['cube_id']
    }
  },
  'facts': {
    'GET': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'manage_cubes',
      'sp_name': 'UMA_CUBEVIEW.MANAGE_CUBEVIEW_DATA',
      'sp_message': 'LIST_FACT_TABLES',
    }
  },
  'dims': {
    'GET': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'manage_cubes',
      'sp_name': 'UMA_CUBEVIEW.MANAGE_CUBEVIEW_DATA',
      'sp_message': 'LIST_FACT_DIMENSIONS',
    }
  }
}
