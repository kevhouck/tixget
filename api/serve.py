# NOTE: MUST IMPORT ALL MODULES IN THIS FILE
# IN ORDER FOR THE SERVER TO WORK
from app import app, db
from api import *


if __name__ == '__main__':
    app.run()
