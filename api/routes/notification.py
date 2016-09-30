'''from flask_restful import Resource, marshal_with, fields
from models.notification import Notification
from libs.notification_helper import notify_user_of_waiting_meet_request
from libs.auth_helper import authenticate
from sqlalchemy import or_, and_
from app import db

notification_resource_fields = {
    'match_id': fields.Integer,
    'meet_request_id:': fields.Integer,
    'transaction_id': fields.Integer,
    'type': fields.String
}


class NotificationHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(notification_resource_fields)
    def get(self, url_user_id, user):
        notify_user_of_waiting_meet_request(1, 1, user)

        notifications = Notification.query.filter(
            and_(Notification.for_user_id == user.id, Notification.sent == False)
        ).all()
        for notification in notifications:
            notification.sent = True
            db.session.add(notification)

        db.session.commit()

        return notifications
'''
