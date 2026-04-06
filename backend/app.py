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
from werkzeug.middleware.proxy_fix import ProxyFix
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
from dotenv import load_dotenv
from .extensions import db
from .socketio_instance import socketio
from .urls import setup_routes

load_dotenv()
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"  # Dev only

def create_app():
    app = Flask(__name__, static_folder=None)
    app.secret_key = os.getenv("FLASK_SECRET_KEY", "your_default_secret_key")

    # Database config (Supabase uses POSTGRES_URL_NON_POOLING, Vercel uses POSTGRES_URL)
    db_url = os.getenv("POSTGRES_URL_NON_POOLING") or os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL") or "sqlite:///app.db"
    db_url = db_url.replace("postgres://", "postgresql://")
    # Ensure SSL for production PostgreSQL
    if db_url.startswith("postgresql://") and "sslmode" not in db_url:
        separator = "&" if "?" in db_url else "?"
        db_url += f"{separator}sslmode=require"
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    # Session config (use SQLAlchemy backed by Supabase Postgres)
    app.config["SESSION_TYPE"] = "sqlalchemy"
    app.config["SESSION_SQLALCHEMY"] = db
    app.config["SESSION_PERMANENT"] = True
    app.config["PERMANENT_SESSION_LIFETIME"] = 3600
    app.config["SESSION_USE_SIGNER"] = True
    app.config["SESSION_KEY_PREFIX"] = "session:"
    # Local http://localhost cannot use Secure cookies; production keeps Secure + None
    _prod = bool(os.environ.get("VERCEL")) or os.getenv("FLASK_ENV", "").lower() == "production"
    app.config.update(
        SESSION_COOKIE_SECURE=_prod,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="None" if _prod else "Lax",
    )

    db.init_app(app)
    Migrate(app, db)
    Session(app)

    # Auto-create tables if they don't exist
    with app.app_context():
        db.create_all()

    # Socket.IO: init for both local and Vercel (HTTP-triggered emits still work)
    socketio.init_app(app, cors_allowed_origins="*", async_mode="eventlet" if not os.environ.get("VERCEL") else "threading")

    # Register routes
    setup_routes(app)

    # Enable CORS
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Vercel terminates TLS; without this, request.url can be http://… and breaks OAuth token exchange
    if os.environ.get("VERCEL"):
        app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

    return app

app = create_app()

if __name__ == "__main__":
    socketio.init_app(app, cors_allowed_origins="*")
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)
