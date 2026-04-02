# app.py
import os

# Only monkey-patch when running locally with eventlet (not on Vercel serverless)
if not os.environ.get("VERCEL"):
    try:
        import eventlet
        eventlet.monkey_patch()
    except ImportError:
        pass

from flask import Flask
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from dotenv import load_dotenv
import redis
from .extensions import db
from .socketio_instance import socketio
from .urls import setup_routes

load_dotenv()
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # Dev only

def create_app():
    app = Flask(__name__, static_folder=None)
    app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_default_secret_key")

    # Database config
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        os.getenv("DATABASE_URL", "sqlite:///app.db").replace("postgres://", "postgresql://")
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Redis session config
    app.config["SESSION_TYPE"] = "redis"
    redis_url = os.getenv("REDIS_URL", "redis://127.0.0.1:6379/0")
    if redis_url.startswith("rediss://"):
        app.config["SESSION_REDIS"] = redis.from_url(redis_url, ssl_cert_reqs=None)
    else:
        app.config["SESSION_REDIS"] = redis.from_url(redis_url)
    # app.config["SESSION_REDIS"] = redis.from_url(redis_url)
    app.config["SESSION_PERMANENT"] = True
    app.config["PERMANENT_SESSION_LIFETIME"] = 3600
    app.config["SESSION_USE_SIGNER"] = True
    app.config["SESSION_KEY_PREFIX"] = "session:"
    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="None",  # if you need cross-origin
    )

    db.init_app(app)
    Migrate(app, db)
    Session(app)

    # Socket.IO (only useful when running locally, not on Vercel serverless)
    if not os.environ.get("VERCEL"):
        socketio.init_app(app, cors_allowed_origins="*")

    # Register routes
    setup_routes(app)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    return app

app = create_app()

if __name__ == "__main__":
    socketio.init_app(app, cors_allowed_origins="*")
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)
