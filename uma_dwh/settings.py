"""Application configuration."""
import os


class Config(object):
    """Base configuration."""

    APP_DIR = os.path.abspath(os.path.dirname(__file__))  # This directory
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
    OPSGENIE_API_KEY = ''
    OPSGENIE_GENIE_KEY = ''


class ProdConfig(Config):
    """Production configuration."""

    ENV = 'prod'
    IS_PRODUCTION = True
    DEBUG = False
    DB_SERVER = "127.0.0.1"
    DB_NAME = "UMA_DWH"
    DB_USER = "sa"
    DB_PASSWORD = "1F0rg0t1"


class DevConfig(Config):
    """Development configuration."""

    ENV = "dev"
    IS_PRODUCTION = False
    DEBUG = True
    DB_SERVER = "127.0.0.1"
    DB_NAME = "UMA_DWH"
    DB_USER = "sa"
    DB_PASSWORD = "1F0rg0t1"
