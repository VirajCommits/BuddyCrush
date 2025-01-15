from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
import os
from dotenv import load_dotenv

from extensions import db
from socketio_instance import socketio
from urls import setup_routes
import redis
from redis import SSLConnection

# Load environment variables from .env
load_dotenv()

# Allow insecure transport for development (ONLY FOR DEVELOPMENT)
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_default_secret_key")

# Database configuration
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URL", "sqlite:///app.db").replace("postgres://", "postgresql://")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.config["SESSION_TYPE"] = "redis"
app.config["SESSION_REDIS"] = redis.from_url("redis://127.0.0.1:6379/0")  # Local Redis instance
app.config["SESSION_PERMANENT"] = True

app.config["PERMANENT_SESSION_LIFETIME"] = 3600  # 1 hour
app.config["SESSION_USE_SIGNER"] = True  # Sign session cookies
app.config["SESSION_KEY_PREFIX"] = "session:"  # Prefix for Redis keys


db.init_app(app)
migrate = Migrate(app, db)  # Use Flask-Migrate for schema changes

# Socket.IO configuration
socketio.init_app(app, cors_allowed_origins="http://localhost:3000")

# CORS Configuration
CORS(
    app,
    resources={r"/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True,
)

# Cookie settings for secure cross-origin cookies
app.config.update(
    SESSION_COOKIE_SECURE=False,   # True in production with HTTPS
    SESSION_COOKIE_HTTPONLY=True,  # Prevent JavaScript from accessing cookies
    SESSION_COOKIE_SAMESITE="None", # Required for cross-origin cookies
)
Session(app)

# Register REST API routes
setup_routes(app)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
