from views import google_login, google_callback, logout, profile

def setup_routes(app):
    # Define your routes here
    routes = [
        {"path": "/api/google/login", "view_func": google_login, "methods": ["GET"]},
        {"path": "/api/google/callback", "view_func": google_callback, "methods": ["GET"]},
        {"path": "/api/logout", "view_func": logout, "methods": ["GET"]},
        {"path": "/api/profile", "view_func": profile, "methods": ["GET"]},
    ]

    # Register the routes in the Flask app
    for route in routes:
        app.add_url_rule(
            route["path"], 
            view_func=route["view_func"], 
            methods=route["methods"]
        )
