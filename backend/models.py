# this is the models.py file which is used to define the models for the project

from .extensions import db
from datetime import datetime

# this is the models.py file which is used to define the models for the project

from .extensions import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_image = db.Column(db.String, nullable=False)

    def __init__(self, group_id, user_name, content,user_image):
        self.group_id = group_id
        self.user_name = user_name
        self.content = content
        self.user_image = user_image

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    picture = db.Column(db.String(255), nullable=True)
    memberships = db.relationship("GroupMember", back_populates="user", cascade="all, delete-orphan")

class Group(db.Model):
    __tablename__ = "group"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)

    # Relationship to GroupMember
    members = db.relationship("GroupMember", back_populates="group", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "members": [
                {
                    "id": member.user.id,
                    "name": member.user.name,
                    "email": member.user.email,
                    "user_image":member.user.picture
                }
                for member in self.members
            ]
        }

class GroupMember(db.Model):
    __tablename__ = "group_members"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey("group.id"), nullable=False)

    # Relationships
    group = db.relationship("Group", back_populates="members")
    user = db.relationship("User", back_populates="memberships")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "group_id": self.group_id,
            "profile_picture": self.user.picture
        }
class UserActivity(db.Model):
    __tablename__ = "user_activity"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    group_id = db.Column(db.Integer, db.ForeignKey('group.id'), nullable=False)
    completed_date = db.Column(db.Date, nullable=False)
    completed_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)  # new field

    user = db.relationship('User', backref='activities', lazy=True)
    group = db.relationship('Group', backref='activities', lazy=True)




