import os
from .mssql_db import execute_sp, fetch_rows, fetch_row
from .exceptions import DBException
from .schemas.error_type_resolution import files_schema


def fetch_files():
    """
    Returns the list of files.
    """
    sql = f'SELECT * FROM MWH.ERROR_RESOLUTIONS ORDER BY ID ASC'
    return fetch_rows(sql=sql, schema=files_schema)


def fetch_file_by_id(id_):
    """
    Returns the file information.
    :param id_: File ID
    :type id_: int
    """
    sql = f'SELECT * FROM MWH.ERROR_RESOLUTIONS WHERE ID = ?'
    return fetch_row(sql=sql, in_args=[id_], schema=files_schema)


def fetch_last_inserted_file():
    """
    Returns the last inserted file record.
    """
    sql = f'SELECT * FROM MWH.ERROR_RESOLUTIONS ORDER BY ID DESC'
    return fetch_row(sql=sql, schema=files_schema)


def create_file(description, file_path_filename):
    """
    Creates an error type resolution file record.
    :param description: File description
    :param file_path_filename: Full file path with file name
    :type description: str
    :type file_path_filename: str
    """
    if not is_valid_file_run_book(file_path_filename):
        raise DBException(f'"{file_path_filename}" does not exist under the run_books directory', -1)

    execute_sp(
      'MWH.ERROR_RESOLUTIONS_MGR',
      {
        'message': 'save',
        'ID': '',
        'ACTIVE_FLAG': '1',
        'DESCRIPTION': description,
        'FILE_PATH_FILENAME': file_path_filename
      }
    )

    return fetch_last_inserted_file()


def update_file(id_, file_path_filename, description):
    """
    Updates an error type resolution file.
    :param id_: File ID
    :param file_path_filename: Full file path with file name
    :param description: File description
    :type id_: int
    :type file_path_filename: str
    :type description: str
    """
    if not is_valid_file_run_book(file_path_filename):
        raise DBException(f'"{file_path_filename}" does not exist under the run_books directory.', -1)

    execute_sp(
      'MWH.ERROR_RESOLUTIONS_MGR',
      {
        'message': 'save',
        'ID': str(id_),
        'ACTIVE_FLAG': '1',
        'DESCRIPTION': description,
        'FILE_PATH_FILENAME': file_path_filename
      }
    )

    return fetch_file_by_id(id_)


def get_run_books_dir():
    return os.path.dirname(os.path.dirname(os.path.abspath(__file__))) + '/static/run_books'


def is_valid_file_run_book(file_path_filename):
    return os.path.isfile(get_run_books_dir() + '/' + file_path_filename)
