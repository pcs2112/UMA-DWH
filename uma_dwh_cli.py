import sys
import importlib
from uma_dwh.db.mssql_db import close

arg_count = len(sys.argv)


def main(args):
    if len(args) == 1:
        print("Please enter a command.")
        exit()
    
    try:
        module = importlib.import_module('uma_dwh.cli')
        cmd = getattr(module, args[1])
    except KeyError:
        print(f"\"{args[1]}\" is an invalid command.")
        exit()
    
    try:
        if len(args) > 2:
            cmd(*args[2:len(args)])
        else:
            cmd()
    except Exception as e:
        close()
        raise e


if __name__ == '__main__':
    main(sys.argv)
