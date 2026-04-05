#!/usr/bin/env python3
"""Run Flask + Socket.IO for local development (port 5000)."""
from backend.app import app, socketio

if __name__ == "__main__":
    socketio.run(app, host="127.0.0.1", port=5000, debug=True, use_reloader=False)
