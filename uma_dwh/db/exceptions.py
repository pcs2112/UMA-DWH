class SPException(Exception):
    def __init__(self, message, error_id):
        Exception.__init__(self)
        self.message = message
        self.error_id = error_id
