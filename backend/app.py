# this is the app.py file which is used to run the project

# utils/app.py

from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app, supports_credentials=True)  # Enable CORS for cross-origin requests

    @app.route('/api/test', methods=['GET'])
    def test_endpoint():
        return jsonify({"message": "Hello from Flask!"})

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)  # Run Flask on port 5000
