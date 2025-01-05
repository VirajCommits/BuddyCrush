# urls.py

from views import (
    discover_groups,
    send_message_to_group,
    get_messages,
    join_group,
    create_group,
    google_login,
    google_callback,
    logout,
    profile
)

def setup_routes(app):
    routes = [
        {"path": "/api/google/login", "view_func": google_login, "methods": ["GET"]},
        {"path": "/api/google/callback", "view_func": google_callback, "methods": ["GET"]},
        {"path": "/api/logout", "view_func": logout, "methods": ["POST"]},
        {"path": "/api/profile", "view_func": profile, "methods": ["GET"]},
        {"path": "/api/groups/discover", "view_func": discover_groups, "methods": ["GET"]},
        {"path": "/api/groups/<int:group_id>/join", "view_func": join_group, "methods": ["POST"]},
        {"path": "/api/groups/create", "view_func": create_group, "methods": ["POST"]},
        {"path": "/api/groups/<int:group_id>/messages", "view_func": get_messages, "methods": ["GET"]},
        {"path": "/api/groups/<int:group_id>/send-message", "view_func": send_message_to_group, "methods": ["POST"]},
    ]

    for route in routes:
        app.add_url_rule(
            route["path"],
            view_func=route["view_func"],
            methods=route["methods"],
        )
