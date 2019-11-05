from uma_dwh.db.mssql_db import init_db, get_db, close, execute_sp
from uma_dwh.settings import Settings
from uma_dwh.utils.opsgenie import init_opsgenie, send_alert_for_error


def opsgenie_alert():
    db_config = {
        'DB_DRIVER': Settings.DB_DRIVER,
        'DB_SERVER': Settings.DB_SERVER,
        'DB_NAME': Settings.DB_NAME,
        'DB_USER': Settings.DB_USER,
        'DB_PASSWORD': Settings.DB_PASSWORD,
        'DB_TRUSTED_CONNECTION': Settings.DB_TRUSTED_CONNECTION
    }

    init_db(db_config)

    results = execute_sp('MWH.Ops_Gene_Alert_Check')
    if len(results) < 1 or len(results[0]) < 1:
      close()
      return

    error = results[0][0]

    init_opsgenie({
      'OPSGENIE_API_KEY': Settings.OPSGENIE_API_KEY,
      'OPSGENIE_GENIE_KEY': Settings.OPSGENIE_GENIE_KEY,
      'IS_PRODUCTION': Settings.IS_PRODUCTION
    })

    send_alert_for_error(error)

    close()
