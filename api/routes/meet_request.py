from flask_restful import Resource, fields, marshal_with, reqparse, abort
from sqlalchemy import and_
from datetime import *
from models.meet_request import MeetRequest
from models.match import Match
from app import db
from libs.auth_helper import authenticate
from models.transaction import Transaction
from routes.user import user_public_resource_fields
from libs.notification_helper import notify_user_of_opened_transaction, notify_user_of_waiting_meet_request
from flask_cors import cross_origin


meet_request_resource_fields = {
    'id': fields.Integer,
    'cre_dt': fields.DateTime,
    'num_in_match': fields.Integer,
    'match_id': fields.Integer,
    'proposed_user': fields.Nested(user_public_resource_fields),
    'awaiting_user': fields.Nested(user_public_resource_fields),
    'awaiting_user_state': fields.String,
    'loc_long': fields.Float,
    'loc_lat': fields.Float,
    'time': fields.DateTime
}

meet_request_parser = reqparse.RequestParser()
meet_request_parser.add_argument('id', type=int, required=True)
meet_request_parser.add_argument('loc_long', type=float, required=True)
meet_request_parser.add_argument('loc_lat', type=float, required=True)
meet_request_parser.add_argument('time', type=datetime, required=True)


class MeetRequestsHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(meet_request_resource_fields)
    def get(self, match_id, user):
        match = Match.query.get(match_id)
        if match is None:
            abort(400)

        if match.buyer_id is not user.id and match.seller_id is not user.id:
            abort(400)

        parser = reqparse.RequestParser()
        parser.add_argument('new', type=bool)
        args = parser.parse_args()

        if args['new'] is not None and args['new'] is True:
            new_meet_request = MeetRequest.query.filter(
                and_(MeetRequest.match_id == match_id,
                     MeetRequest.awaiting_user_state == "WAITING",
                     MeetRequest.awaiting_user_id == req_user_id
                     )).one()

            return new_meet_request

        else:
            meet_requests = MeetRequest.query.filter_by(match_id=match_id).all()

            return meet_requests


class MeetRequestHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(meet_request_resource_fields)
    def get(self, match_id, meet_request_id, user):
        match = Match.query.get(match_id)
        if match is None:
            abort(400)

        if match.buyer_id is not user.id and match.seller_id is not user.id:
            abort(400)

        meet_request = MeetRequest.query.get(meet_request_id)

        return meet_request


class AcceptMeetRequestHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(meet_request_resource_fields)
    def post(self, match_id, meet_request_id, user):

        match = Match.query.get(match_id)
        if match is None:
            abort(400)

        if match.buyer_id is not user.id and match.seller_id is not user.id:
            abort(400)

        if match.state != unicode("MEET_SETUP"):
            abort(400)

        meet_request = MeetRequest.query.get(meet_request_id)

        if meet_request is None:
            abort(400)

        if meet_request.awaiting_user_id is not user.id:
            abort(400)

        meet_request.awaiting_user_state = "ACCEPTED"
        meet_request.up_dt = datetime.utcnow()

        match.state = "COMPLETED"
        match.up_dt = datetime.utcnow()

        # create transaction
        transaction = Transaction()
        transaction.opened_dt = datetime.utcnow()
        transaction.state = "OPENED"
        transaction.seller_user = match.sell_request.submitted_by_user
        transaction.buyer_user = match.buy_request.submitted_by_user
        transaction.match = match
        transaction.loc_long = meet_request.loc_long
        transaction.loc_lat = meet_request.loc_lat
        transaction.time = meet_request.time

        db.session.add(match)
        db.session.add(transaction)
        db.session.add(meet_request)
        db.session.commit()

        if transaction.seller_user.id is user.id:
            other_user = transaction.buyer_user
        else:
            other_user = transaction.seller_user

        notify_user_of_opened_transaction(transaction.id, other_user)

        return meet_request


class RejectMeetRequestHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(meet_request_resource_fields)
    def post(self, match_id, meet_request_id, user):

        match = Match.query.get(match_id)

        if match is None:
            abort(400)

        if match.buyer_id is not user.id and match.seller_id is not user.id:
            abort(400)

        if match.state is not "MEET_SETUP":
            abort(400)

        old_meet_request = MeetRequest.query.get(meet_request_id)

        if old_meet_request is None:
            abort(400)

        if old_meet_request.awaiting_user_id is not user.id:
            abort(400)

        old_meet_request.awaiting_user_state = "REJECTED"
        old_meet_request.up_dt = datetime.utcnow()

        db.session.add(old_meet_request)
        db.session.commit()

        args = meet_request_parser.parse_args()

        new_meet_request = MeetRequest()
        new_meet_request.cre_dt = datetime.utcnow()
        new_meet_request.match_id = match_id
        new_meet_request.proposed_user_id = user.id

        if match.buyer_id is not user.id:
            new_meet_request.awaiting_user_id = match.buyer_id
        else:
            new_meet_request.awaiting_user_id = match.seller_id

        new_meet_request.loc_lat = args['loc_long']
        new_meet_request.loc_long = args['loc_lat']
        new_meet_request.time = args['time']

        new_meet_request.num_in_match = MeetRequest.query.filter_by(match_id=match_id).count() + 1

        db.session.add(new_meet_request)
        db.session.commit()

        if match.buyer.id is user.id:
            other_user = match.seller
        else:
            other_user = match.buyer

        notify_user_of_waiting_meet_request(match.id, other_user)

        return new_meet_request
