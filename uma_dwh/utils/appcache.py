import os
import json

filename = os.path.join(os.path.dirname(__file__), '..', '..', '.app_cache')


def _get_contents():
    if not os.path.isfile(filename):
        return '{}'

    f = open(filename, 'r')
    return f.read()


def _set_contents(data):
    f = open(filename, 'w')
    f.write(json.dumps(data))


def get_item(key):
    data = json.loads(_get_contents())
    if data is None or key not in data:
        return None

    return data[key]


def set_item(key, value):
    data = json.loads(_get_contents())
    if value is None:
        if key in data:
            data.pop(key, None)
    else:
        data[key] = value

    _set_contents(data)
