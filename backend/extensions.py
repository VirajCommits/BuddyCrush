# extensions.py

from flask_socketio import SocketIO
from flask_session import Session

# Initialize SocketIO without binding to the app yet
socketio = SocketIO(manage_session=False)

# Initialize Session without binding to the app yet
session = Session()
