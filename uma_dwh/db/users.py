from pydash.objects import pick, assign
from pydash.predicates import is_empty
from passlib.hash import pbkdf2_sha256 as sha256
from .mssql_db import fetch_rows, fetch_row
from .exceptions import DBException
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
    required_data = {
      'employee_last_name': '',
      'employee_first_name': '',
      'employee_email': '',
      'employee_phone': '',
      'employee_cell_phone': '',
      'employee_password': ''
    }

    new_data = assign(
      required_data,
      pick(
        data,
        'employee_last_name',
        'employee_first_name',
        'employee_email',
        'employee_phone',
        'employee_cell_phone',
        'employee_password'
      )
    )

    if is_empty(new_data['employee_email']):
        raise DBException(f'"employee_email" is required.')

    existing_user = fetch_user_by_email(new_data['employee_email'])
    if existing_user:
        raise DBException(f"{new_data['employee_email']} already exists.")

    result = execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'SAVE ADMIN CONSOLE USER',
        'VARCHAR_01': '',
        'VARCHAR_02': new_data['employee_last_name'],
        'VARCHAR_03': new_data['employee_first_name'],
        'VARCHAR_04': new_data['employee_email'],
        'VARCHAR_05': new_data['employee_phone'],
        'VARCHAR_06': new_data['employee_cell_phone'],
        'VARCHAR_07': '',
        'VARCHAR_08': generate_password_hash(new_data['employee_password'])
      },
      'TryCatchError_ID'
    )

    return fetch_user_by_id(result[0][0])


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
        raise DBException(f'{id_} is and invalid user ID.')

    current_data = {
      'employee_last_name': user['employee_last_name'],
      'employee_first_name': user['employee_first_name'],
      'employee_email': user['employee_email'],
      'employee_phone': user['employee_phone'],
      'employee_cell_phone': user['employee_cell_phone'],
      'employee_password': user['employee_password']
    }

    new_data = assign(
      {},
      current_data,
      pick(
        data,
        'employee_last_name',
        'employee_first_name',
        'employee_email',
        'employee_phone',
        'employee_cell_phone',
        'employee_password'
      )
    )

    execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'SAVE ADMIN CONSOLE USER',
        'VARCHAR_01': id_,
        'VARCHAR_02': new_data['employee_last_name'],
        'VARCHAR_03': new_data['employee_first_name'],
        'VARCHAR_04': new_data['employee_email'],
        'VARCHAR_05': new_data['employee_phone'],
        'VARCHAR_06': new_data['employee_cell_phone'],
        'VARCHAR_07': user['employee_password'],
        'VARCHAR_08': new_data['employee_password'] if is_empty(new_data['employee_password']) else ''
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
        raise DBException(f'"{email}" is an invalid account.', -1)

    if verify_password_hash(password, user_result['employee_password']) is False:
        raise DBException(f'"{email}" is an invalid account.', -2)

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


def reset_user_password(email, existing_password, new_password):
    """
    Resets a user's password.
    :param email: User email
    :type email: str
    :param existing_password: Raw existing user password
    :type existing_password: str
    :param new_password: Raw new user password
    :type new_password: str
    """
    user_result = fetch_user_by_email(email)
    if user_result is None:
        raise DBException(f'"{email}" is an invalid account.', -1)

    if verify_password_hash(existing_password, user_result['employee_password']) is False:
        raise DBException('The password is invalid.', -2)

    execute_admin_console_sp(
      'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
      {
        'message': 'PASSWORD RESET',
        'VARCHAR_01': email,
        'VARCHAR_02': user_result['employee_password'],
        'VARCHAR_03': generate_password_hash(new_password)
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
