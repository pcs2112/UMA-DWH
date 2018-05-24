from webargs import fields

pagination_args = {
  'start_cycle_group': fields.Int(missing=0),
  'end_cycle_group': fields.Int(missing=9)
}

run_check_args = {
  'run_check_name': fields.Str(required=True)
}

procedure_history_args = {
  'db_name': fields.Str(required=True),
  'procedure_name': fields.Str(required=True)
}

server_db_procedures_args = {
  'server_name': fields.Str(required=True),
  'db_name': fields.Str(required=True)
}
