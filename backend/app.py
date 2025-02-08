# app.py
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_session import Session
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
import redis
from .extensions import db
from socketio_instance import socketio
from urls import setup_routes

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
    app.config["SESSION_REDIS"] = redis.from_url("redis://127.0.0.1:6379/0")
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

    # Socket.IO
    socketio.init_app(app, cors_allowed_origins="*")

    # Register routes
    setup_routes(app)

    # Serve Next.js exported build from /out
    PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
    OUT_FOLDER = os.path.join(PROJECT_ROOT, "out")

    @app.route("/")
    def serve_index():
        return send_from_directory(OUT_FOLDER, "index.html")

    @app.route("/<path:path>")
    def serve_static(path):
        full_path = os.path.join(OUT_FOLDER, path)
        if not os.path.isfile(full_path):
            # If `profile.html` exists, serve that
            possible_html = os.path.join(OUT_FOLDER, f"{path}.html")
            if os.path.isfile(possible_html):
                return send_from_directory(OUT_FOLDER, f"{path}.html")
            # Otherwise fallback
            return send_from_directory(OUT_FOLDER, "index.html")
        return send_from_directory(OUT_FOLDER, path)


    # Optionally enable CORS if needed
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

    return app

if __name__ == "__main__":
    app = create_app()
    socketio.run(app, host="127.0.0.1", port=5000, debug=True)
