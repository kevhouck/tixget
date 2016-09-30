from flask_restful import Resource, reqparse, abort, fields,marshal_with
from app import db
from libs.auth_helper import authenticate
from models.message import Message
from models.transaction import Transaction
from routes.user import user_public_resource_fields
from datetime import *
from flask_cors import cross_origin

message_resource_fields = {
    'id': fields.Integer,
    'cre_dt': fields.DateTime,
    'to_user': fields.Nested(user_public_resource_fields),
    'from_user': fields.Nested(user_public_resource_fields),
    'content': fields.String,
}

message_parser = reqparse.RequestParser()
message_parser.add_argument('content')


class MessagesHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(message_resource_fields)
    def post(self, transaction_id, user):
        args = message_parser.parse_args()

        transaction = Transaction.query.get(transaction_id)

        if transaction is None:
            abort(400)

        if transaction.buyer_user_id is not user.id and transaction.seller_user_id is not user.id:
            abort(400)

        new_message = Message()
        new_message.from_user_id = user.id

        if transaction.buyer_user_id is not user.id:
            new_message.to_user_id = transaction.buyer_user_id
        else:
            new_message.to_user_id = transaction.seller_user_id

        new_message.content = args['content']
        new_message.cre_dt = datetime.utcnow()

        db.session.add(new_message)
        db.session.commit()

        return new_message

    @marshal_with(message_resource_fields)
    def get(self, transaction_id, user):

        transaction = Transaction.query.get(transaction_id)

        if transaction is None:
            abort(400)

        if transaction.buyer_user_id is not user.id and transaction.seller_user_id is not user.id:
            abort(400)

        messages = Message.query.filter_by(transaction_id=transaction_id)

        return messages
