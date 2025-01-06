# this is the models.py file which is used to define the models for the project

from extensions import db
from datetime import datetime

class Message(db.Model):
    __tablename__ = "messages"

    id = db.Column(db.Integer, primary_key=True)
    group_id = db.Column(db.Integer, nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, group_id, user_name, content):
        self.group_id = group_id
        self.user_name = user_name
        self.content = content
