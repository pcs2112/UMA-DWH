import datetime
import decimal
from flask.json import JSONEncoder


class JSONEnhanced(JSONEncoder):
    """
    Used to help jsonify Decimals and Datetimes.
    """
    def default(self, obj):
        if isinstance(obj, decimal.Decimal):
            return float(obj)
        elif isinstance(obj, datetime.datetime):
            return obj.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(obj, datetime.date):
            return obj.strftime('%Y-%m-%d')
        elif isinstance(obj, datetime.time):
            return obj.strftime('%H:%M:%S')
        else:
            return JSONEncoder.default(self, obj)
