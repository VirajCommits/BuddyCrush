from flask import redirect, request, jsonify, session
from oauthlib.oauth2 import WebApplicationClient
import requests
import os

# Google OAuth Config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_AUTH_URI = os.getenv("GOOGLE_AUTH_URI")
GOOGLE_TOKEN_URI = os.getenv("GOOGLE_TOKEN_URI")
GOOGLE_CERTS_URL = os.getenv("GOOGLE_CERTS_URL")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# OAuth2 Client
client = WebApplicationClient(GOOGLE_CLIENT_ID)

# In-memory users database (for simplicity)
users = {}


def get_google_provider_cfg():
    return {
        "authorization_endpoint": GOOGLE_AUTH_URI,
        "token_endpoint": GOOGLE_TOKEN_URI,
        "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
    }


# View functions
def google_login():
    # Get Google's authorization endpoint
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    # Build the authorization URL
    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=GOOGLE_REDIRECT_URI,
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)


def google_callback():
    # Get the authorization code from Google
    code = request.args.get("code")

    # Get Google's token endpoint
    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Exchange the authorization code for tokens
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=GOOGLE_REDIRECT_URI,
        code=code,
        client_id=GOOGLE_CLIENT_ID,
        client_secret=GOOGLE_CLIENT_SECRET,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET),
    )

    # Parse the tokens
    client.parse_request_body_response(token_response.text)

    # Get the user's information from Google's userinfo endpoint
    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    # Extract user info
    user_info = userinfo_response.json()
    email = user_info["email"]
    name = user_info["name"]
    picture = user_info.get("picture")

    # Check if user already exists; if not, "register" them
    if email not in users:
        users[email] = {"name": name, "email": email, "picture": picture}

    # Store user info in session
    session["user"] = users[email]

    return jsonify({"message": "Logged in successfully", "user": users[email]})


def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})


def profile():
    # Return the logged-in user's profile
    if "user" in session:
        return jsonify({"user": session["user"]})
    return jsonify({"error": "Not logged in"}), 401
