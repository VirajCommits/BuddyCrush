# views.py

from flask import redirect, request, jsonify, session
from flask_socketio import send, join_room, leave_room, emit
from extensions import socketio  # Import the SocketIO instance
from oauthlib.oauth2 import WebApplicationClient
import requests
import os

next_group_id = 1


# Google OAuth Config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_AUTH_URI = os.getenv("GOOGLE_AUTH_URI")
GOOGLE_TOKEN_URI = os.getenv("GOOGLE_TOKEN_URI")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

# OAuth2 Client
client = WebApplicationClient(GOOGLE_CLIENT_ID)

# In-memory users database (for simplicity)
users = {}

groups = []

# Initialize messages storage
messages = {}  # Store messages for each group (group_id -> list of messages)

def get_google_provider_cfg():
    return {
        "authorization_endpoint": GOOGLE_AUTH_URI,
        "token_endpoint": GOOGLE_TOKEN_URI,
        "userinfo_endpoint": "https://openidconnect.googleapis.com/v1/userinfo",
    }

# View Functions

def google_login():
    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=GOOGLE_REDIRECT_URI,
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

def google_callback():
    print("CALLBACK INITIATING ......................")
    code = request.args.get("code")

    if not code:
        return jsonify({"error": "Authorization code not found"}), 400

    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

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

    client.parse_request_body_response(token_response.text)

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    user_info = userinfo_response.json()
    email = user_info["email"]
    name = user_info["name"]
    picture = user_info.get("picture")

    if email not in users:
        users[email] = {"name": name, "email": email, "picture": picture}

    session["user"] = users[email]
    print("Session contents at google_callback:", session)

    return redirect("http://localhost:3000/profile")

def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

def profile():
    print("Session contents at profile:", session)
    user = session.get("user")
    if user:
        return jsonify({"user": user})
    return jsonify({"error": "Not logged in"}), 401

def create_group():
    global next_group_id

    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user["email"]
    user_name = user["name"]

    data = request.get_json()
    group_name = data.get("name")
    group_description = data.get("description")

    user_picture = user["picture"]

    if not group_name or not group_description:
        return jsonify({"error": "Group name and description are required"}), 400

    new_group = {
        "id": next_group_id,
        "name": group_name,
        "description": group_description,
        "members": [{"name": user_name, "email": user_email, "picture": user_picture}],
    }
    groups.append(new_group)
    next_group_id += 1

    return jsonify({"message": f"Group '{group_name}' created successfully!", "group": new_group})

def discover_groups():
    print("Session contents at discover_groups:", session)
    user = session.get("user")
    print("This is the user: ", user)
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    available_groups = [group for group in groups]

    return jsonify({"groups": available_groups})

def join_group(group_id):
    print("Session contents at join_group:", session)
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user["email"]
    user_name = user["name"]
    user_picture = user["picture"]

    group = next((group for group in groups if group["id"] == group_id), None)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    if any(member["email"] == user_email for member in group["members"]):
        return jsonify({"message": "You are already a member of this group"}), 400

    group["members"].append({"name": user_name, "email": user_email, "picture": user_picture})
    return jsonify({"message": f"Joined group '{group['name']}' successfully!"})

def send_message_to_group(group_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_name = user["name"]

    data = request.get_json()
    message = data.get("message")
    if not message:
        return jsonify({"error": "Message is required"}), 400

    group = next((g for g in groups if g["id"] == group_id), None)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    if group_id not in messages:
        messages[group_id] = []
    messages[group_id].append({"user": user_name, "message": message})

    # Broadcast the message to the group via WebSocket
    socketio.emit("group_message", {"user": user_name, "message": message}, room=group_id)

    return jsonify({"message": "Message sent successfully!"})

def get_messages(group_id):
    if group_id not in messages:
        return jsonify({"messages": []})
    return jsonify({"messages": messages[group_id]})

# Socket.IO Event Handlers

@socketio.on("join_group")
def handle_join_group(data):
    group_id = data.get("group_id")
    user = session.get("user")
    if not user:
        emit("error", {"error": "Not logged in"})
        return

    user_name = user["name"]
    join_room(group_id)
    emit("message", {"message": f"{user_name} has joined the group!"}, room=group_id)

@socketio.on("leave_group")
def handle_leave_group(data):
    group_id = data.get("group_id")
    user = session.get("user")
    if not user:
        emit("error", {"error": "Not logged in"})
        return

    user_name = user["name"]
    leave_room(group_id)
    emit("message", {"message": f"{user_name} has left the group!"}, room=group_id)

@socketio.on("send_message")
def handle_send_message(data):
    group_id = data.get("group_id")
    message = data.get("message")
    user = session.get("user")
    if not user:
        emit("error", {"error": "Not logged in"})
        return

    user_name = user["name"]
    if group_id not in messages:
        messages[group_id] = []

    messages[group_id].append({"user": user_name, "message": message})

    emit("group_message", {"user": user_name, "message": message}, room=group_id)
