from flask import Flask
from flask_cors import CORS
from flask_session import Session
from socketio_instance import socketio  # Import socketio
import os
from dotenv import load_dotenv
from urls import setup_routes

# Load environment variables
load_dotenv()

# Allow insecure transport for development (ONLY FOR DEVELOPMENT)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_default_secret_key")

# CORS Configuration
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},  # Allow specific frontend origin
    supports_credentials=True,  # Allow cookies to be sent
)

app.config["SESSION_TYPE"] = "filesystem"
app.config.update(
    SESSION_COOKIE_SECURE=False,  # Set to True in production with HTTPS
    SESSION_COOKIE_HTTPONLY=True,  # Prevent JavaScript from accessing cookies
    SESSION_COOKIE_SAMESITE="Lax",  # Mitigate CSRF attacks
)
Session(app)

# Register REST API routes
setup_routes(app)

if __name__ == "__main__":
    socketio.init_app(app, cors_allowed_origins="http://localhost:3000")
    socketio.run(app, debug=True, host="localhost", port=5000)
