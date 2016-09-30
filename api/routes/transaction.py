from flask_restful import Resource, fields, marshal_with, abort, reqparse
from sqlalchemy import or_
from app import db
from models.transaction import Transaction
from libs.auth_helper import authenticate
from routes.user import user_public_resource_fields
from routes.match import match_resource_fields
from models.transaction_secret import TransactionSecret
from datetime import *
from routes.message import message_resource_fields
from libs.notification_helper import notify_user_of_completed_transaction
from flask_cors import cross_origin


transaction_resource_fields = {
    'id': fields.Integer,
    'proposed_dt': fields.DateTime,
    'agreed_dt': fields.DateTime,
    'completed_dt': fields.DateTime,
    'canceled_dt': fields.DateTime,
    'seller_user': fields.Nested(user_public_resource_fields),
    'buyer_user': fields.Nested(user_public_resource_fields),
    'match': fields.Nested(match_resource_fields),
    'state': fields.String,
    'messages': fields.Nested(message_resource_fields),
    'loc_long': fields.Float,
    'loc_lat': fields.Float,
    'time': fields.DateTime,
}


class TransactionsHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(transaction_resource_fields)
    def get(self, user):
        transactions = Transaction.query.filter(
                or_(Transaction.seller_user_id == user.id, Transaction.buyer_user_id == user.id)).all()

        return transactions


class TransactionHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(transaction_resource_fields)
    def get(self, transaction_id, user):
        transaction = Transaction.query.get(transaction_id)
        if transaction is None:
            abort(400)

        if transaction.buyer_user_id is not user.id and transaction.seller_user_id is not user.id:
            abort(400)

        return transaction


class ConfirmTransactionHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(transaction_resource_fields)
    def post(self, transaction_id, user):
        parser = reqparse.RequestParser()
        parser.add_argument('secret', required=True)
        args = parser.parse_args()

        transaction = Transaction.query.get(transaction_id)
        if transaction is None:
            abort(400)

        if transaction.buyer_user_id is not user.id and transaction.seller_user_id is not user.id:
            abort(400)

        if transaction.seller_user_id is not user.id:
            abort(400)

        transaction_secret = TransactionSecret.query.get(transaction.secret_id)

        if args['secret'] != transaction_secret.secret:
            abort(400)

        transaction.state = "COMPLETED"
        transaction.completed_dt = datetime.utcnow()

        db.session.add(transaction)
        db.session.commit()

        # todo transfer funds
        # asyncly notify buyer
        if transaction.buyer_user.id is user.id:
            other_user = transaction.seller_user
        else:
            other_user = transaction.buyer_user

        notify_user_of_completed_transaction(transaction.id, other_user)

        return transaction


class TransactionSecretHandler(Resource):
    method_decorators = [authenticate]

    def get(self, transaction_id, user):
        transaction = Transaction.query.get(transaction_id)
        if transaction is None:
            abort(400)

        if transaction.buyer_user_id is not user.id and transaction.seller_user_id is not user.id:
            abort(400)

        if transaction.buyer_user_id is not user.id:
            abort(400)

        # generate secret here
        transaction_secret = TransactionSecret()

        secret = "blue cat plain three"
        transaction_secret.secret = secret

        db.session.add(transaction_secret)
        db.session.commit()

        transaction.secret_id = transaction_secret.id
        db.session.add(transaction)
        db.session.commit()

        return {"secret": transaction_secret.secret}
