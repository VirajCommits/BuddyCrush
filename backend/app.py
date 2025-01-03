from flask import Flask
from flask_cors import CORS
from socketio_instance import socketio  # Import socketio from the new module
from dotenv import load_dotenv
import os
from urls import setup_routes

# Load environment variables from .env
load_dotenv()

# Allow insecure transport for development (ONLY FOR DEVELOPMENT)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# Flask App Initialization
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY")
CORS(app, supports_credentials=True)

# Register REST API routes
setup_routes(app)

if __name__ == "__main__":
    socketio.init_app(app)
    socketio.run(app, debug=True, port=5000)
