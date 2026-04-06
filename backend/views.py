# views.py

from flask import redirect, request, jsonify, session
from flask_socketio import send, join_room, leave_room, emit
from .socketio_instance import socketio  # Import the SocketIO instance
from .models import Message
from .extensions import db
from oauthlib.oauth2 import WebApplicationClient
import requests
import os
import re
from typing import Optional
from urllib.parse import urlparse, urlunparse
from .models import Group,GroupMember, User, UserActivity
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime, date

next_group_id = 1


# Google OAuth Config
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_AUTH_URI = os.getenv("GOOGLE_AUTH_URI")
GOOGLE_TOKEN_URI = os.getenv("GOOGLE_TOKEN_URI")
def _normalize_oauth_redirect_uri(uri: Optional[str]) -> Optional[str]:
    """Strip whitespace and collapse accidental double slashes (e.g. …vercel.app//api/…)."""
    if not uri:
        return uri
    u = uri.strip()
    parts = urlparse(u)
    path = re.sub(r"/{2,}", "/", parts.path or "/")
    if not path.startswith("/"):
        path = "/" + path
    return urlunparse((parts.scheme, parts.netloc, path, parts.params, parts.query, parts.fragment))


GOOGLE_REDIRECT_URI = _normalize_oauth_redirect_uri(os.getenv("GOOGLE_REDIRECT_URI"))

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
    if not GOOGLE_CLIENT_ID or not GOOGLE_AUTH_URI or not GOOGLE_REDIRECT_URI:
        return jsonify({"error": "Google OAuth not configured. Missing environment variables."}), 500

    google_provider_cfg = get_google_provider_cfg()
    authorization_endpoint = google_provider_cfg["authorization_endpoint"]

    request_uri = client.prepare_request_uri(
        authorization_endpoint,
        redirect_uri=GOOGLE_REDIRECT_URI,
        scope=["openid", "email", "profile"],
    )
    return redirect(request_uri)

# views.py

def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code"}), 400

    google_provider_cfg = get_google_provider_cfg()
    token_endpoint = google_provider_cfg["token_endpoint"]

    # Must match the redirect_uri sent to Google exactly (scheme/host/path). Rebuild from env
    # instead of request.url so Vercel/internal http vs https never causes redirect_uri_mismatch.
    qs = request.query_string.decode("utf-8")
    authorization_response = (
        f"{GOOGLE_REDIRECT_URI}?{qs}" if qs else GOOGLE_REDIRECT_URI
    )

    # Exchange the code immediately for tokens
    token_url, headers, body = client.prepare_token_request(
        token_endpoint,
        authorization_response=authorization_response,
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
    
    if token_response.status_code != 200:
        return jsonify({"error": "Token exchange failed, try logging in again."}), 400

    client.parse_request_body_response(token_response.text)

    userinfo_endpoint = google_provider_cfg["userinfo_endpoint"]
    uri, headers, body = client.add_token(userinfo_endpoint)
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
    try:
        available_groups = Group.query.all()
        groups_data = [group.to_dict() for group in available_groups]
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
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    user_picture = user["picture"]
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

    payload = {
        "id": new_message.id,
        "user": user["name"],
        "message": content,
        "user_image": user_picture,
        "created_at": new_message.created_at.isoformat(),
    }

    # Broadcast to all clients in the group room
    socketio.emit("group_message", payload, room=group_id)

    return jsonify({"message": "Message sent successfully!", "chat_message": payload})

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

def delete_group(group_id):
    user = session.get("user")
    if not user:
        return jsonify({"error": "Not logged in"}), 401

    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404

    user_obj = User.query.filter_by(email=user["email"]).first()
    if not user_obj:
        return jsonify({"error": "User not found"}), 404

    first_member = GroupMember.query.filter_by(group_id=group_id).order_by(GroupMember.id.asc()).first()
    if not first_member or first_member.user_id != user_obj.id:
        return jsonify({"error": "Only the group creator can delete this group"}), 403

    Message.query.filter_by(group_id=group_id).delete()
    UserActivity.query.filter_by(group_id=group_id).delete()
    GroupMember.query.filter_by(group_id=group_id).delete()
    db.session.delete(group)
    db.session.commit()

    return jsonify({"message": f"Group '{group.name}' deleted successfully"})


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


def seed_demo_data():
    """Secret endpoint: populate DB with realistic demo users, groups, messages, and activity."""
    import random
    from datetime import timedelta

    SEED_USERS = [
        {"name": "Luna Starfield",    "email": "luna@palcrush.demo",     "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Luna&backgroundColor=b6e3f4"},
        {"name": "Kai Nakamura",      "email": "kai@palcrush.demo",      "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai&backgroundColor=c0aede"},
        {"name": "Priya Sharma",      "email": "priya@palcrush.demo",    "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Priya&backgroundColor=ffd5dc"},
        {"name": "Marcus Johnson",    "email": "marcus@palcrush.demo",   "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Marcus&backgroundColor=d1f4d1"},
        {"name": "Sofia Rodriguez",   "email": "sofia@palcrush.demo",    "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Sofia&backgroundColor=fff4cc"},
        {"name": "Arjun Patel",       "email": "arjun@palcrush.demo",    "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Arjun&backgroundColor=ffc9a9"},
        {"name": "Chloe Winters",     "email": "chloe@palcrush.demo",    "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Chloe&backgroundColor=bde0fe"},
        {"name": "Ryu Tanaka",        "email": "ryu@palcrush.demo",      "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Ryu&backgroundColor=e2cfea"},
        {"name": "Zara Ahmed",        "email": "zara@palcrush.demo",     "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Zara&backgroundColor=ffcfd2"},
        {"name": "Ethan Brooks",      "email": "ethan@palcrush.demo",    "picture": "https://api.dicebear.com/9.x/adventurer/svg?seed=Ethan&backgroundColor=caffbf"},
    ]

    SEED_GROUPS = [
        {
            "name": "Morning Workout Crew",
            "description": "Wake up at 6 AM and crush a 30-min workout every day. No excuses, just results.",
            "creator_idx": 0,
            "member_idxs": [0, 1, 3, 5, 9],
        },
        {
            "name": "Read 30 Pages Daily",
            "description": "Build the reading habit together. 30 pages minimum, any genre, every single day.",
            "creator_idx": 2,
            "member_idxs": [2, 4, 6, 7, 0],
        },
        {
            "name": "No Junk Food Challenge",
            "description": "30-day clean eating challenge. Support each other to skip the chips and soda.",
            "creator_idx": 4,
            "member_idxs": [4, 1, 8, 3, 6],
        },
        {
            "name": "Code Every Day",
            "description": "Ship at least one commit a day. LeetCode, side project, open source — anything counts.",
            "creator_idx": 5,
            "member_idxs": [5, 0, 2, 7, 9, 8],
        },
    ]

    CHAT_TEMPLATES = [
        ["Let's gooo! Day 1 starts now 🔥", "I'm in! Already feeling motivated", "Same here, let's crush this 💪", "Who's tracking streaks?", "I am! Already on day 3 haha"],
        ["Just finished today's session, feels amazing", "Nice!! I almost skipped but this group kept me going", "That's what we're here for 🙌", "Accountability is everything fr"],
        ["Alright who slacked off today? 😂", "Not me! Done and dusted ✅", "I literally almost forgot but did it last minute", "That still counts!", "Progress > perfection"],
        ["Quick tip: set a daily alarm, game changer", "Facts, I do mine right after my morning coffee", "Morning routine gang 🌅", "Evening crew checking in too 🌙"],
    ]

    created_users = []
    created_groups = []
    stats = {"users": 0, "groups": 0, "members": 0, "messages": 0, "activities": 0}

    for u in SEED_USERS:
        existing = User.query.filter_by(email=u["email"]).first()
        if existing:
            created_users.append(existing)
        else:
            user = User(email=u["email"], name=u["name"], picture=u["picture"])
            db.session.add(user)
            db.session.flush()
            created_users.append(user)
            stats["users"] += 1

    for g in SEED_GROUPS:
        existing = Group.query.filter_by(name=g["name"]).first()
        if existing:
            created_groups.append(existing)
            continue

        group = Group(name=g["name"], description=g["description"])
        db.session.add(group)
        db.session.flush()
        created_groups.append(group)
        stats["groups"] += 1

        for idx in g["member_idxs"]:
            user = created_users[idx]
            if not GroupMember.query.filter_by(user_id=user.id, group_id=group.id).first():
                db.session.add(GroupMember(user_id=user.id, group_id=group.id))
                stats["members"] += 1

    db.session.commit()

    now = datetime.utcnow()

    for gi, group in enumerate(created_groups):
        members = GroupMember.query.filter_by(group_id=group.id).all()
        if not members:
            continue

        existing_msgs = Message.query.filter_by(group_id=group.id).count()
        if existing_msgs == 0:
            convo = CHAT_TEMPLATES[gi % len(CHAT_TEMPLATES)]
            for ci, line in enumerate(convo):
                member = members[ci % len(members)]
                user = User.query.get(member.user_id)
                msg = Message(
                    group_id=group.id,
                    user_name=user.name,
                    content=line,
                    user_image=user.picture or "https://api.dicebear.com/9.x/adventurer/svg?seed=default",
                )
                msg.created_at = now - timedelta(hours=len(convo) - ci, minutes=random.randint(0, 30))
                db.session.add(msg)
                stats["messages"] += 1

        for member in members:
            for days_ago in random.sample(range(0, 7), k=random.randint(2, 5)):
                d = (now - timedelta(days=days_ago)).date()
                if not UserActivity.query.filter_by(user_id=member.user_id, group_id=group.id, completed_date=d).first():
                    act = UserActivity(user_id=member.user_id, group_id=group.id, completed_date=d)
                    act.completed_at = now - timedelta(days=days_ago, hours=random.randint(6, 22))
                    db.session.add(act)
                    stats["activities"] += 1

    db.session.commit()

    return jsonify({
        "message": "Demo data seeded successfully!",
        "created": stats,
    })