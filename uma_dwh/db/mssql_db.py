""" DB module used to interact with SQL server """
import sys
import pyodbc

this = sys.modules[__name__]
this.db = None  # Reference to the DB connection
this.config = None   # Reference to the DB configuration settings


def init_db(app):
    if this.db is not None:
        raise RuntimeError('Database is already initialized.')

    this.config = {
        'DB_DRIVER': app.config["DB_DRIVER"],
        'DB_SERVER': app.config["DB_SERVER"],
        'DB_NAME': app.config["DB_NAME"],
        'DB_USER': app.config["DB_USER"],
        'DB_PASSWORD': app.config["DB_PASSWORD"]
    }

    app.teardown_request(close)


def get_db():
    """
    Returns the current DB connection. This function makes sure there only
    exists one connection per request.
    """
    if this.db is None:
        this.db = pyodbc.connect(
            p_str=None,
            driver=this.config["DB_DRIVER"],
            server=this.config["DB_SERVER"],
            database=this.config["DB_NAME"],
            uid=this.config["DB_USER"],
            pwd=this.config["DB_PASSWORD"],
            autocommit=True
        )

    return this.db


def close(*varargs):
    """
    Closes the current DB connection if any.
    """
    if this.db is not None:
        pyodbc.pooling = False
        this.db.close()
        this.db = None


def result_as_dict(schema, row):
    """
    Converts a result to a dict using the values in
    schema as the keys.

    :param schema: Row schema
    :param row: Raw result
    :type schema: list
    :type row: list
    :return:
    :rtype: dict
    """
    return dict(zip([field.lower() for field in schema], row))


def result_set_as_dicts(schema, rows):
    """
    Converts a result set rows to dicts using the values in
    schema as the keys.

    :param schema: Row schema
    :param rows: Raw result set
    :type schema: list
    :type rows: list
    :return:
    :rtype: list
    """
    return [dict(zip([field.lower() for field in schema], row)) for row in rows]


def fetch_rows(sql, in_args=(), schema=()):
    """
    Returns a list of records.

    :param sql: SQL command
    :param in_args: Parameters to bind into the query
    :param schema: List of column names to map to each row value
    :type sql: str
    :type in_args: list
    :type schema: list
    :return:
    :rtype: list
    """
    cursor = get_db().cursor()
    cursor.execute(sql, in_args)
    rows = cursor.fetchall()
    cursor.close()
    if len(rows) < 1:
        return ()

    if len(schema) > 1:
        return result_set_as_dicts(schema, rows)

    return rows


def fetch_row(sql, in_args=(), schema=()):
    """
    Returns one record.

    :param sql: SQL command
    :param in_args: Parameters to bind into the query
    :param schema: List of column names to map to each row value
    :type sql: str
    :type in_args: list
    :type schema: list
    :return:
    :rtype: dict or list or None
    """
    cursor = get_db().cursor()
    cursor.execute(sql, in_args)
    row = cursor.fetchone()
    cursor.close()

    if row is None:
        return None

    if len(schema) > 1:
        return result_as_dict(schema, row)

    return row


def execute_sp(sp_name, in_args, out_arg=None):
    """
    Executes a stored procedure and returns the result sets.
    The 0 index in the return value contains the value for the out_arg if an out_arg is specified.

    :param sp_name: Stored procedure name
    :param in_args: Dictionary of store procedure parameters and values
    :param out_arg: Output parameter
    :type sp_name: str
    :type in_args: dict
    :type out_arg: str
    :return: Stored procedure result sets and out argument
    :rtype: list
    """
    sql = ''

    if out_arg is not None:
        sql = f'DECLARE @{out_arg} INTEGER;'
        sql += f'EXEC @{out_arg} = {sp_name} '
    else:
        sql += f'EXEC {sp_name} '

    in_params = []
    for key in in_args:
        sql += f'@{key} = ?, '
        in_params.append(in_args[key])

    sql = sql.rstrip(', ')
    sql += f';'

    if out_arg is not None:
        sql += f'SELECT @{out_arg};'

    cursor = get_db().cursor()
    cursor.execute(sql, in_params)

    result = []

    while 1:
        try:
            result.append(cursor.fetchall())
        except pyodbc.ProgrammingError:
            pass

        if cursor.nextset() is not True:
            break

    cursor.close()

    return result
