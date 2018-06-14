from .mssql_db import execute_sp, fetch_rows, fetch_row
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


def create_file(description, file_path_filename):
    """
    Creates an error type resolution file record.
    :param description: File description
    :param file_path_filename: Full file path with file name
    :type description: str
    :type file_path_filename: str
    """
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


def update_file(_id, description, file_path_filename):
    """
    Updates an error type resolution file.
    :param _id: File ID
    :param description: File description
    :param file_path_filename: Full file path with file name
    :type _id: int
    :type description: str
    :type file_path_filename: str
    """
    execute_sp(
      'MWH.ERROR_RESOLUTIONS_MGR',
      {
        'message': 'save',
        'ID': str(_id),
        'ACTIVE_FLAG': '1',
        'DESCRIPTION': description,
        'FILE_PATH_FILENAME': file_path_filename
      }
    )
