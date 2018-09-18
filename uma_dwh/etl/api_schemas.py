from webargs import fields

pagination_args = {
  'start_cycle_group': fields.Int(missing=0),
  'end_cycle_group': fields.Int(missing=9),
  'date': fields.Str(missing='')
}

run_check_args = {
  'run_check_name': fields.Str(required=True)
}

procedure_history_args = {
  'db_name': fields.Str(required=True),
  'procedure_name': fields.Str(required=True),
  'date': fields.Str(required=True)
}

server_db_procedures_args = {
  'server_name': fields.Str(required=True),
  'db_name': fields.Str(required=True)
}

report_history_args = {
  'start_date': fields.Str(missing=''),
  'end_date': fields.Str(missing='')
}

report_statistics_args = {
  'report_name': fields.Str(missing='ALL')
}

report_runs_args = {
  'report_name': fields.Str(required=True),
  'from_num': fields.Str(missing=''),
  'to_num': fields.Str(missing='')
}

procedure_runtime_chart_data_args = {
  'procedure_name': fields.Str(required=True),
  'date': fields.Str(missing=''),
  'months': fields.Int(missing=6)
}

report_runtime_chart_data_args = {
  'report_name': fields.Str(required=True),
  'date': fields.Str(missing=''),
  'months': fields.Int(missing=6)
}
