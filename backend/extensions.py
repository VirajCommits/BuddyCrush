# extensions.py

from flask_socketio import SocketIO
from flask_session import Session

# extensions.py
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

# Initialize Session without binding to the app yet
session = Session()
