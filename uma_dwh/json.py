from decimal import *
from flask.json import JSONEncoder
from datetime import *


class JSONEnhanced(JSONEncoder):
    """
    Used to help jsonify Decimals and Datetimes.
    """
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        elif isinstance(obj, datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, date):
            return obj.strftime('%Y-%m-%d')
        else:
            return JSONEncoder.default(self, obj)
