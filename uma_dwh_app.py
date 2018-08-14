"""Create an application instance."""
from uma_dwh.app import create_app
from uma_dwh.settings import Settings

CONFIG = Settings

app = create_app(CONFIG)


@app.after_request
def set_response_headers(response):
    response.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate'
    response.headers['Pragma'] = 'no-cache'
    response.headers['Expires'] = '0'
    return response


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

    return app.send_static_file('dist/index.html' if app.config["IS_PRODUCTION"] else 'templates/index.dev.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=CONFIG.DEBUG)
