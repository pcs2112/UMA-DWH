"""Create an application instance."""
from flask.helpers import get_debug_flag
from uma_dwh.app import create_app
from uma_dwh.settings import DevConfig, ProdConfig

CONFIG = DevConfig if get_debug_flag() else ProdConfig

app = create_app(CONFIG)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if "dist/" in path:
        return app.send_static_file(path)

    return app.send_static_file('dist/index.html' if app.config["IS_PRODUCTION"] else 'templates/index.dev.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=CONFIG.DEBUG)
