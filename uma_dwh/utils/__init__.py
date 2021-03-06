import datetime


def date_diff_in_seconds(dt2, dt1):
    timedelta = dt2 - dt1
    return timedelta.days * 24 * 3600 + timedelta.seconds


def is_float(value):
    try:
        float(value)
        return True
    except TypeError:
        return False
    except ValueError:
        return False


def is_int(value):
    try:
        int(value)
        return True
    except TypeError:
        return False
    except ValueError:
        return False
    
    
def is_datetime(value):
    return isinstance(value, datetime.datetime)


def list_chunks(l, n):
    # Create a function called "chunks" with two arguments, l and n:
    # For item i in a range that is a length of l,
    for i in range(0, len(l), n):
        # Create an index range for l of n items:
        yield l[i:i+n]
        
        
def format_datetime(date, format_str="%Y-%m-%d %H:%M"):
    """ Formats the specified datetime. """
    return date.strftime(format_str)
