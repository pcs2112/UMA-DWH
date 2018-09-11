"""Create an application instance."""
import logging
from logging.handlers import RotatingFileHandler
from flask import make_response
from uma_dwh.app import create_app
from uma_dwh.settings import Settings
from uma_dwh.utils.nocache import set_no_cache_headers

CONFIG = Settings

app = create_app(CONFIG)


@app.route('/api/run_books/<path:path>')
def run_books(path):
    return app.send_static_file('run_books/' + path)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if "dist/" in path:
        return app.send_static_file(path)

    if "run_books/" in path:
        return app.send_static_file(path)

    body = app.send_static_file('dist/index.html' if app.config["IS_PRODUCTION"] else 'templates/index.dev.html')
    res = set_no_cache_headers(make_response(body))

    return res


if __name__ == '__main__':
    logHandler = RotatingFileHandler('app.log')
    logHandler.setLevel(logging.WARNING)
    app.logger.setLevel(logging.WARNING)
    app.logger.addHandler(logHandler)
    app.run(host='0.0.0.0', debug=CONFIG.DEBUG)
