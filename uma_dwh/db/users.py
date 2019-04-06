from pydash.objects import pick, assign
from pydash.predicates import is_empty
from passlib.hash import pbkdf2_sha256 as sha256
from .exceptions import DBException
from .etl import execute_admin_console_sp


def fetch_users():
    """
    Returns the list of Admin Console users.
    """
    return execute_admin_console_sp(
        'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
        'LIST_ADMIN_CONSOLE_USERS'
    )


def fetch_user_by_id(id_):
    """
    Returns the user information.
    :param id_: User ID
    :type id_: int
    """
    result = execute_admin_console_sp(
        'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
        'LIST_ADMIN_CONSOLE_USER_BY_ID',
        id_
    )

    if len(result) < 1:
        return None

    return result[0]


def fetch_user_by_email(email):
    """
    Returns the user information.
    :param email: User email
    :type email: str
    """
    result = execute_admin_console_sp(
        'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE_REPORTS',
        'LIST_ADMIN_CONSOLE_USER_BY_EMAIL',
        email
    )

    if len(result) < 1:
        return None

    return result[0]


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
        'employee_cellphone': '',
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
            'employee_cellphone',
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
        'SAVE ADMIN CONSOLE USER',
        '',
        new_data['employee_last_name'],
        new_data['employee_first_name'],
        new_data['employee_email'],
        new_data['employee_phone'],
        new_data['employee_cellphone'],
        '',
        generate_password_hash(new_data['employee_password'])
    )

    if len(result) < 1:
        raise DBException("The new user account could not be created.")

    return fetch_user_by_id(result[0]['id'])


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
        'employee_cellphone': user['employee_cellphone'],
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
            'employee_cellphone',
            'employee_password'
        )
    )

    execute_admin_console_sp(
        'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
        'SAVE ADMIN CONSOLE USER',
        id_,
        new_data['employee_last_name'],
        new_data['employee_first_name'],
        new_data['employee_email'],
        new_data['employee_phone'],
        new_data['employee_cellphone'],
        user['employee_password'],
        new_data['employee_password'] if is_empty(new_data['employee_password']) else ''
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
        'LOGIN',
        email,
        user_result['employee_password']
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
        'PASSWORD RESET',
        email,
        user_result['employee_password'],
        generate_password_hash(new_password)
    )

    return user_result['id']


def forgot_password(data, scenario):
    user_result = fetch_user_by_email(data['email'])
    if user_result is None:
        raise DBException(f'"{data["email"]}" is an invalid account.', -1)

    if scenario == 1:
        return '123456'

    if scenario == 2:
        if data['verification_code'] != '123456':
            raise DBException(f'"{data["verification_code"]}" is an invalid verification code.', -2)

        return ''

    if scenario == 3:
        execute_admin_console_sp(
            'MWH.UMA_WAREHOUSE_ADMIN_CONSOLE',
            'PASSWORD RESET',
            user_result['employee_email'],
            user_result['employee_password'],
            generate_password_hash(data['new_password'])
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
