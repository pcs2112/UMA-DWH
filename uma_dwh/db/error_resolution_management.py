from .mssql_db import execute_sp


def insert_error_resolution_file(description, file_path_filename):
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


def update_error_resolution_file(_id, description, file_path_filename):
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
