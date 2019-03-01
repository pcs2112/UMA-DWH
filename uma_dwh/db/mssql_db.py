""" DB module used to interact with SQL server """
import sys
import pyodbc
import re
from flask import g

this = sys.modules[__name__]
this.config = None   # Reference to the DB configuration settings


def init_db(app):
    this.config = {
        'DB_DRIVER': app.config['DB_DRIVER'],
        'DB_SERVER': app.config['DB_SERVER'],
        'DB_NAME': app.config['DB_NAME'],
        'DB_USER': app.config['DB_USER'],
        'DB_PASSWORD': app.config['DB_PASSWORD'],
        'DB_TRUSTED_CONNECTION': app.config['DB_TRUSTED_CONNECTION'] == '1'
    }

    app.teardown_request(close)


def get_db():
    """
    Returns the current DB connection. This function makes sure there only
    exists one connection per request.
    """
    db = getattr(g, '_database', None)
    if db is None:
        if this.config['DB_TRUSTED_CONNECTION']:
            cnxn_str = 'Driver=%s;Server=%s;DATABASE=%s;Trusted_Connection=yes;' % (
              this.config['DB_DRIVER'],
              this.config['DB_SERVER'],
              this.config['DB_NAME']
            )

            db = g._database = pyodbc.connect(
              cnxn_str,
              autocommit=True
            )
        else:
            db = g._database = pyodbc.connect(
              p_str=None,
              driver=this.config['DB_DRIVER'],
              server=this.config['DB_SERVER'],
              database=this.config['DB_NAME'],
              uid=this.config['DB_USER'],
              pwd=this.config['DB_PASSWORD'],
              autocommit=True
            )
    return db


def close(*varargs):
    """
    Closes the current DB connection if any.
    """
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


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


def normalize_column_name(name):
    """Function to convert column names to snake case"""
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).replace(' ', '_').lower()


def get_column_names(result_set_description):
    """
    Gets the columns names using cursor's description.
    :param result_set_description: Cursor description
    :type result_set_description: list
    """
    column_names = []
    for description in result_set_description:
        if description[0]:
            column_names.append(normalize_column_name(description[0]))

    return column_names


def fetch_rows(sql, in_args=()):
    """
    Returns a list of records.

    :param sql: SQL command
    :param in_args: Parameters to bind into the query
    :type sql: str
    :type in_args: list
    :return:
    :rtype: list
    """
    cursor = get_db().cursor()
    cursor.execute(sql, in_args)
    rows = cursor.fetchall()
    column_names = get_column_names(cursor.description)
    cursor.close()

    if len(rows) < 1:
        return ()

    return result_set_as_dicts(column_names, rows)


def fetch_row(sql, in_args=()):
    """
    Returns one record.

    :param sql: SQL command
    :param in_args: Parameters to bind into the query
    :type sql: str
    :type in_args: list
    :return:
    :rtype: dict or list or None
    """
    cursor = get_db().cursor()
    cursor.execute(sql, in_args)
    row = cursor.fetchone()
    column_names = get_column_names(cursor.description)
    cursor.close()

    if row is None:
        return None

    return result_as_dict(column_names, row)


def execute_sp(sp_name, in_args, out_arg=None, as_dict=True):
    """
    Executes a stored procedure and returns the result sets.
    The 0 index in the return value contains the value for the out_arg if an out_arg is specified.

    :param sp_name: Stored procedure name
    :param in_args: Dictionary of store procedure parameters and values
    :param out_arg: Output parameter
    :param as_dict: Return result set as a Dictionary
    :type sp_name: str
    :type in_args: dict
    :type out_arg: str
    :type as_dict: boolean
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
        in_params.append(str(in_args[key]))   # Convert all in args to string

    sql = sql.rstrip(', ')
    sql += f';'

    if out_arg is not None:
        sql += f'SELECT @{out_arg};'

    cursor = get_db().cursor()
    cursor.execute(sql, in_params)

    result = []

    while 1:
        try:
            result_set = cursor.fetchall()
            column_names = get_column_names(cursor.description) if as_dict else []
            if len(column_names) > 0:
                result.append(result_set_as_dicts(column_names, result_set))
            else:
                result.append(result_set)
        except pyodbc.ProgrammingError:
            pass

        if cursor.nextset() is not True:
            break

    cursor.close()

    return result
