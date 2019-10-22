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
        'active_flag', 'cube_name', 'view_name', 'materialize', 'table_namey', 'cube_date_start', 'cube_date_end'
      ]
    }
  },
  'schedule': {
    'GET': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'manage_cubes_schedule',
      'sp_name': 'UMA_CUBEVIEW.MANAGE_CUBEVIEW_SCHEDULE',
      'sp_message': 'Get_SCHEDULE'
    },
    'POST': {
      'module_name': 'uma_dwh.db.data_cubes',
      'module_func': 'save_cube_schedule',
      'sp_in_args': [
        'cube_id', 'name', 'frequency', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'daily_frequency', 'daily_start', 'daily_end',
        'daily_occurs_interval', 'duration_start', 'duration_end', 'xml'
      ]
    }
  }
}
