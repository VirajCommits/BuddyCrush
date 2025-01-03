# backend/views.py
from flask import jsonify, request

# Default path
def default_path():
    print("Default path endpoint hit")
    return jsonify({"message": "Welcome to the API!"})

# Signup logic
def signup():
    print("Signup endpoint hit")
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Example logic (replace with real user creation logic)
    if username and password:
        return jsonify({"message": "User signed up successfully!", "user": username})
    else:
        return jsonify({"error": "Invalid input"}), 400
# Login logic
def login():
    print("Login endpoint hit")
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")

    # Example login logic (replace with real authentication)
    if username == "testuser" and password == "password":
        return jsonify({"message": "Login successful!"})
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Swagger UI or documentation placeholder
def swagger_ui():
    return jsonify({"message": "Swagger documentation would be displayed here."})
