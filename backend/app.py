from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

from backend.extensions import db
from backend.socketio_instance import socketio
from backend.urls import setup_routes
import redis

# Load environment variables from .env
load_dotenv()

# Allow insecure transport for development (ONLY FOR DEVELOPMENT)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_default_secret_key")

# Database config
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///app.db").replace("postgres://", "postgresql://")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SESSION_TYPE"] = "redis"

db.init_app(app)
migrate = Migrate(app, db)  # Use Flask-Migrate for schema changes

socketio.init_app(app, cors_allowed_origins="http://localhost:3000")

# CORS Configuration
CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
)

app.config["SESSION_TYPE"] = "filesystem"
app.config.update(
    SESSION_COOKIE_SECURE=False,   # True in production with HTTPS
    SESSION_COOKIE_HTTPONLY=True,  # Prevent JavaScript from accessing cookies
    SESSION_COOKIE_SAMESITE="None", # Mitigate CSRF attacks
)
Session(app)

# Register REST API routes
setup_routes(app)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
