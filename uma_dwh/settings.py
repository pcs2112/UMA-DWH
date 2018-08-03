"""Application configuration."""
import os
from flask.helpers import get_debug_flag
from dotenv import load_dotenv


class Settings(object):
    """Base configuration."""

    # load dotenv in the base root
    dotenv_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    load_dotenv(dotenv_path)

    # Set config
    ENV = os.getenv('FLASK_ENV')
    IS_PRODUCTION = os.getenv('FLASK_ENV') == 'production'
    DEBUG = get_debug_flag()
    APP_DIR = os.path.abspath(os.path.dirname(__file__))
    DB_SERVER = os.getenv('DB_HOST')
    DB_NAME = os.getenv('DB_NAME')
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_DRIVER = os.getenv('DB_DRIVER')
    DB_TRUSTED_CONNECTION = os.getenv('DB_TRUSTED_CONNECTION')
    SECRET_KEY = 'DWH-ADMIN-CONSOLE-SECRET'
    JWT_SECRET_KEY = 'DWH-ADMIN-CONSOLE-JWT'
    JWT_TOKEN_LOCATION = ['headers']
    JWT_HEADER_NAME = 'Authorization'
    JWT_HEADER_TYPE = 'Bearer'
    JWT_ACCESS_TOKEN_EXPIRES = False
    JWT_REFRESH_TOKEN_EXPIRES = False
    CORS_ORIGIN_WHITELIST = [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:5000',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001',
        'http://127.0.0.1:5000'
    ]
    OPSGENIE_API_KEY = '602e1fed-1cee-496a-8454-5d63520bfba4'
    OPSGENIE_GENIE_KEY = 'GenieKey'
