import pyodbc
from passlib.hash import pbkdf2_sha256 as sha256
from .mssql_db import fetch_rows, fetch_row
from .etl import execute_admin_console_sp
from .schemas.users import users_schema


def fetch_users():
    """
    Returns the list of Admin Console users.
    """
    sql = f'SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER ORDER BY ID ASC'
    return fetch_rows(sql=sql, schema=users_schema)


def fetch_user_by_id(id_):
    """
    Returns the user information.
    :param id_: User ID
    :type id_: int
    """
    sql = f'SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER WHERE ID = ?'
    return fetch_row(sql=sql, in_args=[id_], schema=users_schema)


def fetch_user_by_email(email):
    """
    Returns the user information.
    :param email: User email
    :type email: str
    """
    sql = f'SELECT * FROM MWH_DIM.D_ADMIN_CONSOLE_USER WHERE EmployeeEMAIL = ?'
    return fetch_row(sql=sql, in_args=[email], schema=users_schema)


def create_user(data):
    """
    Creates a user and returns the new user information.
    :param data: New user data
    :type data: dict
    """
    execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'SAVE ADMIN CONSOLE USER',
        'VARCHAR_01': '',
        'VARCHAR_02': data['employee_last_name'],
        'VARCHAR_03': data['employee_first_name'],
        'VARCHAR_04': data['employee_email'],
        'VARCHAR_05': data['employee_phone'],
        'VARCHAR_06': data['employee_cell_phone'],
        'VARCHAR_07': '',
        'VARCHAR_08': data['employee_password']
      },
      'TryCatchError_ID'
    )

    user = fetch_user_by_id(data['employee_email'])
    if user is None:
        raise pyodbc.ProgrammingError('The new user could not be created.')

    return user


def update_user(id_, data):
    """
    Updates a user and returns the new user information.
    :param id_: User ID
    :type id_: int
    :param data: New user data
    :type data: dict
    """
    user = fetch_user_by_id(id_)
    if user is None:
        raise pyodbc.ProgrammingError(f'{id_} is and invalid user ID.')

    execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'SAVE ADMIN CONSOLE USER',
        'VARCHAR_01': id_,
        'VARCHAR_02': data['employee_last_name'],
        'VARCHAR_03': data['employee_first_name'],
        'VARCHAR_04': data['employee_email'],
        'VARCHAR_05': data['employee_phone'],
        'VARCHAR_06': data['employee_cell_phone'],
        'VARCHAR_07': user['employee_password'],
        'VARCHAR_08': data['employee_password']
      },
      'TryCatchError_ID'
    )

    return fetch_user_by_id(id_)


def login_user(email, password):
    """
    Returns True if the login credentials are valid.
    :param email: User email
    :type email: str
    :param password: Raw user password
    :type password: str
    """
    user_result = fetch_user_by_email(email)
    if user_result is None:
        return -1

    if verify_password_hash(password, user_result['employee_password']) is False:
        return -2

    execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'LOGIN',
        'VARCHAR_01': email,
        'VARCHAR_02': user_result['employee_password']
      },
      'TryCatchError_ID'
    )

    return user_result['id']


def generate_password_hash(raw_password):
    """
    Encrypts a raw password using the sha256 algorithm.
    :param raw_password: Raw password text
    :type raw_password: str
    """
    return sha256.hash(raw_password)


def verify_password_hash(raw_password, hashed_password):
    """
    Returns true if the specified raw password matches the specified hashed password.
    :param raw_password: Raw password text
    :type raw_password: str
    :param hashed_password: Hashed password text
    :type hashed_password: str
    """
    return sha256.verify(raw_password, hashed_password)
