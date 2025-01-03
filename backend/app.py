from flask import Flask
from flask_cors import CORS
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

# Register routes
setup_routes(app)

if __name__ == "__main__":
    app.run(debug=True, port=5000)
