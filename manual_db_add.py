#!/usr/bin/env python3
"""Manually add records to Buddy/Pal Crush database.

Usage examples:
  python manual_db_add.py add-user --email "a@b.com" --name "Alex"
  python manual_db_add.py add-group --name "Study Sprint" --description "Daily grind" --creator-email "a@b.com"
  python manual_db_add.py add-member --group-id 1 --user-email "b@c.com"
  python manual_db_add.py add-message --group-id 1 --user-email "a@b.com" --content "Let's go!"
  python manual_db_add.py add-activity --group-id 1 --user-email "a@b.com" --date 2026-04-06
"""

from __future__ import annotations

import argparse
from datetime import datetime

from backend.app import create_app
from backend.extensions import db
from backend.models import Group, GroupMember, Message, User, UserActivity


def _get_user_by_email(email: str) -> User:
    user = User.query.filter_by(email=email).first()
    if not user:
        raise ValueError(f"User not found: {email}")
    return user


def cmd_add_user(args: argparse.Namespace) -> None:
    existing = User.query.filter_by(email=args.email).first()
    if existing:
        print(f"User already exists: id={existing.id}, email={existing.email}")
        return

    user = User(email=args.email, name=args.name, picture=args.picture)
    db.session.add(user)
    db.session.commit()
    print(f"Created user: id={user.id}, email={user.email}, name={user.name}")


def cmd_add_group(args: argparse.Namespace) -> None:
    creator = _get_user_by_email(args.creator_email)
    group = Group(name=args.name, description=args.description)
    db.session.add(group)
    db.session.flush()

    membership = GroupMember(user_id=creator.id, group_id=group.id)
    db.session.add(membership)
    db.session.commit()
    print(f"Created group: id={group.id}, name={group.name}, creator={creator.email}")


def cmd_add_member(args: argparse.Namespace) -> None:
    user = _get_user_by_email(args.user_email)
    group = Group.query.get(args.group_id)
    if not group:
        raise ValueError(f"Group not found: {args.group_id}")

    exists = GroupMember.query.filter_by(user_id=user.id, group_id=group.id).first()
    if exists:
        print(f"Membership already exists: user={user.email}, group_id={group.id}")
        return

    db.session.add(GroupMember(user_id=user.id, group_id=group.id))
    db.session.commit()
    print(f"Added member: user={user.email} -> group_id={group.id}")


def cmd_add_message(args: argparse.Namespace) -> None:
    user = _get_user_by_email(args.user_email)
    group = Group.query.get(args.group_id)
    if not group:
        raise ValueError(f"Group not found: {args.group_id}")

    msg = Message(
        group_id=group.id,
        user_name=user.name,
        content=args.content,
        user_image=user.picture or "https://via.placeholder.com/40",
    )
    db.session.add(msg)
    db.session.commit()
    print(f"Added message: id={msg.id}, group_id={group.id}, user={user.email}")


def cmd_add_activity(args: argparse.Namespace) -> None:
    user = _get_user_by_email(args.user_email)
    group = Group.query.get(args.group_id)
    if not group:
        raise ValueError(f"Group not found: {args.group_id}")

    completed_date = datetime.strptime(args.date, "%Y-%m-%d").date()
    exists = UserActivity.query.filter_by(
        user_id=user.id, group_id=group.id, completed_date=completed_date
    ).first()
    if exists:
        print(
            f"Activity already exists: user={user.email}, group_id={group.id}, date={args.date}"
        )
        return

    act = UserActivity(user_id=user.id, group_id=group.id, completed_date=completed_date)
    db.session.add(act)
    db.session.commit()
    print(f"Added activity: id={act.id}, user={user.email}, group_id={group.id}, date={args.date}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Manual DB insert helper")
    sub = parser.add_subparsers(dest="command", required=True)

    p_user = sub.add_parser("add-user", help="Create user")
    p_user.add_argument("--email", required=True)
    p_user.add_argument("--name", required=True)
    p_user.add_argument("--picture", default=None)
    p_user.set_defaults(func=cmd_add_user)

    p_group = sub.add_parser("add-group", help="Create group and assign creator")
    p_group.add_argument("--name", required=True)
    p_group.add_argument("--description", required=True)
    p_group.add_argument("--creator-email", required=True)
    p_group.set_defaults(func=cmd_add_group)

    p_member = sub.add_parser("add-member", help="Add user to group")
    p_member.add_argument("--group-id", required=True, type=int)
    p_member.add_argument("--user-email", required=True)
    p_member.set_defaults(func=cmd_add_member)

    p_msg = sub.add_parser("add-message", help="Add chat message")
    p_msg.add_argument("--group-id", required=True, type=int)
    p_msg.add_argument("--user-email", required=True)
    p_msg.add_argument("--content", required=True)
    p_msg.set_defaults(func=cmd_add_message)

    p_act = sub.add_parser("add-activity", help="Add habit completion record")
    p_act.add_argument("--group-id", required=True, type=int)
    p_act.add_argument("--user-email", required=True)
    p_act.add_argument("--date", required=True, help="YYYY-MM-DD")
    p_act.set_defaults(func=cmd_add_activity)

    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    app = create_app()
    with app.app_context():
        args.func(args)


if __name__ == "__main__":
    main()
