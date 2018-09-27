from webargs import fields

path_sp_args_map = {
  'control_manager': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'LIST_CONTROL_MANAGER_DETAILS'
  },
  'history': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
    'sp_message': 'LOAD_ETL_HISTORY',
    'sp_in_args': ['start_cycle_group', 'end_cycle_group', 'date']
  },
  'procedure_history': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
    'sp_message': 'GET_ETL_PROCEDURE_HISTORY',
    'sp_in_args': ['db_name', 'procedure_name', 'date']
  },
  'procedure_runtime_chart_data': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'LOAD_ETL_SEARCH_CHART',
    'sp_in_args': ['procedure_name', 'date', 'months']
  },
  'report_history': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'DISPLAY_REPORT_BY_DATE',
    'sp_in_args': ['report_name', 'date']
  },
  'report_runtime_chart_data': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'LOAD_REPORT_SEARCH_CHART',
    'sp_in_args': ['report_name', 'date', 'months']
  },
  'run_check': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
    'sp_message': 'RUN_CHECK',
    'sp_in_args': ['run_check_name']
  },
  'statistics': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'DISPLAY_STATISTICS_DATA_BY_DATE',
    'sp_in_args': ['date', 'schema']
  },
  'statistics/schemas': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'REPORT_RUN_STATISTICS_SELECT_BY_DATE',
    'sp_in_args': ['date']
  },
  'statistics/chart': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'LOAD_STATISTICS_Search_Chart',
    'sp_in_args': ['date', 'months', 'schema']
  },
  'try_catch_errors': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'DISPLAY_TryCatch_Daily_Errors',
    'sp_in_args': ['date']
  },
  'try_catch_errors_chart_data': {
    'sp_name': 'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
    'sp_message': 'LOAD_TryCatch_Search_Chart',
    'sp_in_args': ['date', 'months']
  }
}

reports_args = {
  'date': fields.Str(missing=''),
}
