# backend/urls.py

from flask import Flask
import views

def setup_routes(app: Flask):
    """
    Function to define and register all routes for the app.
    """

    urlpatterns = [
        # Define your endpoints here
        {"path": "/", "view_func": views.default_path, "name": "defaultPath", "methods": ["GET"]},
        {"path": "/signup", "view_func": views.signup, "name": "signup", "methods": ["POST"]},
        {"path": "/login", "view_func": views.login, "name": "login", "methods": ["POST"]},
    ]

    # Register routes
    for route in urlpatterns:
        app.add_url_rule(
            route["path"], 
            endpoint=route["name"], 
            view_func=route["view_func"], 
            methods=route["methods"]
        )
