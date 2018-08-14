from flask import make_response
from functools import wraps, update_wrapper
from datetime import datetime


def set_no_cache_headers(res):
    res.headers['Last-Modified'] = datetime.now()
    res.headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, post-check=0, pre-check=0, max-age=0'
    res.headers['Pragma'] = 'no-cache'
    res.headers['Expires'] = '-1'
    return res


def nocache(view):
    @wraps(view)
    def no_cache(*args, **kwargs):
        response = set_no_cache_headers(make_response(view(*args, **kwargs)))
        return response

    return update_wrapper(no_cache, view)
