# views.py

from flask import redirect, request, jsonify, session
from flask_socketio import send, join_room, leave_room, emit
from .socketio_instance import socketio  # Import the SocketIO instance
from .models import Message
from .extensions import db
from oauthlib.oauth2 import WebApplicationClient
import requests
import os
from pathlib import Path

from dotenv import load_dotenv

from .models import Group,GroupMember, User, UserActivity
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, date

next_group_id = 1


# Google OAuth — only CLIENT_ID + CLIENT_SECRET are required locally; endpoints default to Google’s URLs.
GOOGLE_AUTH_URI = os.getenv("GOOGLE_AUTH_URI") or "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URI = os.getenv("GOOGLE_TOKEN_URI") or "https://oauth2.googleapis.com/token"


def _project_root() -> Path:
    """Directory that contains package.json (repo root), even if this file moves."""
    here = Path(__file__).resolve().parent
    for p in [here.parent, *here.parents]:
        if (p / "package.json").is_file():
            return p
    return here.parent


def _reload_oauth_env() -> None:
    """Re-read .env on each OAuth request so new files/values work without guessing cwd."""
    root = _project_root()
    load_dotenv(root / ".env")
    load_dotenv(root / "backend" / ".env")
    load_dotenv(root / ".env.local", override=True)


def _google_creds():
    cid = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    secret = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()
    # env.example placeholders — treat as unset until user replaces them
    if cid == "your-client-id.apps.googleusercontent.com":
        cid = ""
    if secret == "your-client-secret":
        secret = ""
    return cid, secret


def _google_redirect_uri():
    base = (os.getenv("FRONTEND_URL") or "http://localhost:3000").rstrip("/")
    explicit = os.getenv("GOOGLE_REDIRECT_URI", "").strip()
    return explicit or f"{base}/api/google/callback"

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
    _reload_oauth_env()
    raw_id = os.getenv("GOOGLE_CLIENT_ID", "").strip()
    raw_secret = os.getenv("GOOGLE_CLIENT_SECRET", "").strip()
    cid, secret = _google_creds()
    if not cid or not secret:
        root = _project_root()
        env_root = root / ".env"
        env_local = root / ".env.local"
        env_backend = root / "backend" / ".env"
        missing = []
        if not cid:
            missing.append("GOOGLE_CLIENT_ID")
        if not secret:
            missing.append("GOOGLE_CLIENT_SECRET")
        still_placeholder = (
            raw_id == "your-client-id.apps.googleusercontent.com"
            or raw_secret == "your-client-secret"
        )
        if still_placeholder and env_root.is_file():
            main_error = (
                ".env still has placeholder Google values. Replace GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET "
                "with your real OAuth client from Google Cloud Console (they are not optional)."
            )
        else:
            main_error = "Google OAuth not configured. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET, then restart Flask."
        return jsonify({
            "error": main_error,
            "missing": missing,
            "project_root": str(root),
            "env_file_root": str(env_root),
            "env_file_root_exists": env_root.is_file(),
            "env_file_local": str(env_local),
            "env_file_local_exists": env_local.is_file(),
            "env_file_backend": str(env_backend),
            "env_file_backend_exists": env_backend.is_file(),
            "still_using_template_values": still_placeholder,
            "hint": "Open Google Cloud Console → APIs & Services → Credentials → your OAuth 2.0 Client ID → copy Client ID and Client Secret into .env (same folder as package.json). Save the file; you can try login again without restarting Flask.",
        }), 500

    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]
    oauth = WebApplicationClient(cid)

    request_uri = oauth.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=_google_redirect_uri(),
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

# views.py

def google_callback():
    _reload_oauth_env()
    cid, secret = _google_creds()
    if not cid or not secret:
        return jsonify({"error": "Google OAuth not configured."}), 500

    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]
    oauth = WebApplicationClient(cid)
    redirect_uri = _google_redirect_uri()

    # Exchange the code immediately for tokens
    token_url, headers, body = oauth.prepare_token_request(
        token_endpoint,
        authorization_response=request.url,
        redirect_url=redirect_uri,
        code=code,
        client_id=cid,
        client_secret=secret,
    )
    token_response = requests.post(
        token_url,
        headers=headers,
        data=body,
        auth=(cid, secret),
    )
    
    if token_response.status_code != 200:
        return jsonify({"error": "Token exchange failed, try logging in again."}), 400

    oauth.parse_request_body_response(token_response.text)

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = oauth.add_token(userinfo_endpoint)
    userinfo_response = requests.get(uri, headers=headers, data=body)

    user_info = userinfo_response.json()
    email = user_info.get("email")
    name = user_info.get("name")
    picture = user_info.get("picture")

    if not email:
        return jsonify({"error": "Email not available from Google."}), 400

    # Fetch or create the user in the database
    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            name=name,
            email=email,
            picture=picture
        )
        db.session.add(user)
        db.session.commit()

    # Set session data directly
    session["user"] = {
        "name": user.name,
        "email": user.email,
        "picture": user.picture
    }
    session.permanent = True  # Optional: Makes the session permanent based on app config

    # Redirect to frontend profile page
    frontend_url = os.getenv("FRONTEND_URL", request.host_url.rstrip("/"))
    return redirect(f"{frontend_url}/profile")

def profile():
    user = session.get("user")
    if user:
        return jsonify({"user": user})
    return jsonify({"error": "Not logged in"}), 401
def test_redis():
    if request.method == "POST":
        session["test_key"] = "test_value"
        session.modified = True  # Ensure the session is marked as modified
        return jsonify({"message": "Session value set!"})
    else:
        return jsonify({"test_key": session.get("test_key", "Not set")})
def get_redis():
    return jsonify({"test_key": session.get("test_key", "Not set")})

def logout():
    session.clear()
    return jsonify({"message": "Logged out successfully"})

def intro():
    return jsonify({"Hey!": "Damn you found the Backend link!"})


def create_group():
    global next_group_id

    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user["email"]
    user_name = user["name"]

    data = request.get_json()
    if "group" in data:
        group_name = data["group"].get("name")
        group_description = data["group"].get("description")
    else:

        group_name = data.get("name")
        group_description = data.get("description")

    user_picture = user["picture"]

    if not group_name or not group_description:
        return jsonify({"error": "Group name and description are required"}), 400
    # Create the group
    new_group = Group(name=group_name, description=group_description)
    db.session.add(new_group)
    db.session.flush()  # Flush to get the group ID

    # Find the user in the database
    user_obj = User.query.filter_by(email=user_email).first()
    if not user_obj:
        return jsonify({"error": "User not found"}), 404

    # Create a GroupMember entry
    group_member = GroupMember(user_id=user_obj.id, group_id=new_group.id)
    db.session.add(group_member)

    # Commit all changes
    db.session.commit()


    return jsonify({
        "message": f"Group '{group_name}' created successfully!",
        "group": new_group.to_dict()
    })
def discover_groups():
    # Check if the user is logged in
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    # Query all groups from the database
    try:
        available_groups = Group.query.all()
        groups_data = [group.to_dict() for group in available_groups]  # Convert groups to dictionaries
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({"groups": groups_data})

def join_group(group_id):
    # 1. Retrieve user information from session
    user_info = session.get("user")
    if not user_info:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user_info.get("email")
    if not user_email:
        return jsonify({"error": "Invalid user session"}), 400

    try:
        # 2. Fetch the user from the database
        user = User.query.filter_by(email=user_email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        # 3. Fetch the group from the database
        group = Group.query.get(group_id)
        if not group:
            return jsonify({"error": "Group not found"}), 404

        # 4. Check if the user is already a member of the group
        existing_membership = GroupMember.query.filter_by(user_id=user.id, group_id=group.id).first()
        if existing_membership:
            return jsonify({"message": "You are already a member of this group."}), 400

        # 5. Create a new GroupMember entry
        new_membership = GroupMember(user_id=user.id, group_id=group.id)
        db.session.add(new_membership)

        # 6. Commit the transaction
        db.session.commit()

        # 7. Optional: Refresh the group to include the new member
        db.session.refresh(group)

        return jsonify({"message": f"Joined group '{group.name}' successfully!"}), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        # Log the error as needed
        return jsonify({"error": "An error occurred while joining the group."}), 500

    except Exception as e:
        # Log the error as needed
        return jsonify({"error": "An unexpected error occurred."}), 500
def complete_activity(group_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    # 1) Get the user from the database
    user_email = user["email"]
    user_obj = User.query.filter_by(email=user_email).first()
    if not user_obj:
        return jsonify({"error": "User not found"}), 404

    # 2) Check if user has completed this group's habit today
    today = date.today()
    existing_record = UserActivity.query.filter_by(
        user_id=user_obj.id,
        group_id=group_id,
        completed_date=today
    ).first()

    if existing_record:
        return jsonify({"error": "Already completed today"}), 400

    # 3) Otherwise create a new record
    #    completed_at is auto-set to datetime.utcnow() if specified as a default,
    #    or you can explicitly set it here if you prefer.
    activity = UserActivity(
        user_id=user_obj.id,
        group_id=group_id,
        completed_date=today,
        completed_at=datetime.utcnow()  # only needed if you want to override or be explicit
    )
    db.session.add(activity)
    db.session.commit()

    return jsonify({
        "message": f"Activity recorded successfully for {group.name}",
        "group_id": group_id,
        "user_email": user_email,
        "completed_date": today.isoformat(),
        "completed_at": activity.completed_at.isoformat()  # Return timestamp as well
    })
def get_leaderboard(group_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    # Using a join to get user info
    from sqlalchemy import func
    leaderboard = (
        db.session.query(
            User.id.label("user_id"),
            User.name.label("user_name"),
            User.picture.label("user_picture"),
            func.count(UserActivity.id).label("completion_count"),
            func.max(UserActivity.completed_date).label("last_completed")
        )
        .join(UserActivity, User.id == UserActivity.user_id)
        .filter(UserActivity.group_id == group_id)
        .group_by(User.id)
        .order_by(func.count(UserActivity.id).desc())  # sort by completion_count desc
        .all()
    )

    # Format leaderboard data
    leaderboard_data = []
    for entry in leaderboard:
        leaderboard_data.append({
            "user_id": entry.user_id,
            "user_name": entry.user_name,
            "user_picture": entry.user_picture,
            "completion_count": int(entry.completion_count),
            "last_completed": entry.last_completed.isoformat() if entry.last_completed else None
        })

    return jsonify({
        "group_id": group_id,
        "leaderboard": leaderboard_data
    })
def get_group_activity(group_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    # Join to get user info
    from sqlalchemy import desc
    activity_list = (
        db.session.query(
            UserActivity.completed_date,
            User.name.label("user_name"),
            User.picture.label("user_picture"),
            User.email.label("user_email")
        )
        .join(User, UserActivity.user_id == User.id)
        .filter(UserActivity.group_id == group_id)
        .order_by(desc(UserActivity.completed_date))
        .limit(10)  # last 10
        .all()
    )

    # Format
    data = []
    today = date.today()
    for record in activity_list:
        days_ago = (today - record.completed_date).days
        data.append({
            "user_name": record.user_name,
            "user_email": record.user_email,
            "user_picture": record.user_picture,
            "completed_date": record.completed_date.isoformat(),
            "days_ago": days_ago
        })

    return jsonify({"activity": data})

def send_message_to_group(group_id):
    """
    HTTP endpoint for sending a message to a group.
    This also emits a real-time 'group_message' event 
    so that connected Socket.IO clients update instantly.
    """
    user = session.get("user")
    user_picture = user["picture"]
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    group_id = int(group_id)  # ensure integer
    data = request.get_json()
    content = data.get("message")
    if not content:
        return jsonify({"error": "Message is required"}), 400

    # Save to DB
    new_message = Message(
        group_id=group_id, 
        user_name=user["name"], 
        content=content,
        user_image=user_picture
    )
    db.session.add(new_message)
    db.session.commit()

    # Broadcast to all clients in the group room
    socketio.emit(
        "group_message", 
        {"id": new_message.id, "user": user["name"], "message": content, "user_image": user_picture}, 
        room=group_id
    )

    return jsonify({"message": "Message sent successfully!"})

def get_messages(group_id):
    """
    HTTP endpoint to fetch all messages for a group from the DB.
    """
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    group_id = int(group_id)
    group_msgs = Message.query \
        .filter_by(group_id=group_id) \
        .order_by(Message.created_at.asc()) \
        .all()


    messages_data = [
        {
            "id": m.id,
            "user": m.user_name, 
            "message": m.content,
            "created_at": m.created_at.isoformat(),
            "user_image": m.user_image,
        }
        for m in group_msgs
    ]
    return jsonify({"messages": messages_data})

# ---------------------------
# Socket.IO Event Handlers
# ---------------------------

@socketio.on("join_group")
def handle_join_group(data):
    """
    Socket.IO event to join a group room for real-time updates.
    """
    user = session.get("user")
    if not user:
        emit("error", {"error": "Not logged in"})
        return

    group_id = int(data.get("group_id"))  # consistent with integer usage
    user_name = user["name"]

    join_room(group_id)
    emit("message", {
        "message": f"{user_name} has joined group {group_id}!"
    }, room=group_id)

@socketio.on("leave_group")
def handle_leave_group(data):
    """
    Socket.IO event to leave a group room.
    """
    user = session.get("user")
    if not user:
        emit("error", {"error": "Not logged in"})
        return

    group_id = int(data.get("group_id"))
    user_name = user["name"]

    leave_room(group_id)
    emit("message", {
        "message": f"{user_name} has left the group!"
    }, room=group_id)

@socketio.on("send_message")
def handle_send_message(data):
    """
    Socket.IO event for directly sending a message via WebSocket.
    Also saves to DB, then emits to the group room.
    """
    user = session.get("user")
    if not user:
        emit("error", {"error": "Not logged in"})
        return

    group_id = int(data.get("group_id"))
    content = data.get("message")
    if not content:
        emit("error", {"error": "Message content is empty"})
        return

    user_name = user["name"]
    user_picture = user["picture"]

    # Save to DB
    new_message = Message(
        group_id=group_id, 
        user_name=user_name, 
        content=content,
        user_image = user_picture
    )
    db.session.add(new_message)
    db.session.commit()

    # Emit to the group
    emit("group_message", {
        "user": user_name, 
        "message": content
    }, room=group_id)
def check_habit_completion(group_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_email = user["email"]
    today = date.today()

    # Find the user in the database to get their user_id
    user_obj = User.query.filter_by(email=user_email).first()
    if not user_obj:
        return jsonify({"completed": False})

    habit_completed = UserActivity.query.filter_by(
        user_id=user_obj.id,
        group_id=group_id,
        completed_date=today,
    ).first()

    return jsonify({"completed": bool(habit_completed)})

def delete_message(message_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    msg = Message.query.get(message_id)
    if not msg:
        return jsonify({"error": "Message not found"}), 404

    # Only the message author can delete their own message
    if msg.user_name != user["name"]:
        return jsonify({"error": "You can only delete your own messages"}), 403

    group_id = msg.group_id
    db.session.delete(msg)
    db.session.commit()

    # Notify connected clients about the deletion
    socketio.emit(
        "message_deleted",
        {"message_id": message_id},
        room=group_id
    )

    return jsonify({"message": "Message deleted successfully"})