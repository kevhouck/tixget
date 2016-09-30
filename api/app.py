from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Resource, Api
from flask_cors import CORS
#from flask_socketio import SocketIO

app = Flask(__name__)
api = Api(app)
app.config.from_object("config.DevelopmentConfig")
db = SQLAlchemy(app)
CORS(app)
#socketio = SocketIO(app)#, async_mode='eventlet')
