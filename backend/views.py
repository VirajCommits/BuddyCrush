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

groups = []

# Auto-incrementing ID for new groups (for simplicity)
next_group_id = len(groups) + 1

def create_group():
    global next_group_id

    # Get the logged-in user
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user["email"]
    user_name = user["name"]

    # Get group details from request body
    data = request.get_json()
    group_name = data.get("name")
    group_description = data.get("description")

    user_picture = user["picture"]
    # Validate input
    if not group_name or not group_description:
        return jsonify({"error": "Group name and description are required"}), 400

    # Create the new group
    new_group = {
        "id": next_group_id,
        "name": group_name,
        "description": group_description,
        "members": [{"name": user_name, "email": user_email , "picture": user_picture}],  # Add creator as the first member
    }
    groups.append(new_group)
    next_group_id += 1

    return jsonify({"message": f"Group '{group_name}' created successfully!", "group": new_group})


def discover_groups():
    # Get the logged-in user
    user = session.get("user") 
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    # Filter groups if the user has already joined
    available_groups = [
        group for group in groups
    ]

    return jsonify({"groups": available_groups})

def join_group(group_id):
    # Get the logged-in user
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user["email"]
    user_name = user["name"]
    user_picture = user["picture"]

    # Find the group by ID
    group = next((group for group in groups if group["id"] == group_id), None)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    # Check if the user is already a member
    if any(member["email"] == user_email for member in group["members"]):
        return jsonify({"message": "You are already a member of this group"}), 400

    # Add the user to the group's members list (name and email)
    group["members"].append({"name": user_name, "email": user_email, "picture": user_picture})
    return jsonify({"message": f"Joined group '{group['name']}' successfully!"})

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
