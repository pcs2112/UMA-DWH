from .mssql_db import execute_sp


def save_error_resolution_file(description, file_path_filename):
    """
    Stores an error type resolution file.
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
