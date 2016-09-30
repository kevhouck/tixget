from flask_restful import Resource, fields, reqparse, marshal_with, abort
from sqlalchemy import or_, and_, desc
from meet_request import meet_request_resource_fields
from libs.auth_helper import authenticate
from models.match import Match
from models.meet_request import MeetRequest
from models.buy_request import BuyRequest
from models.sell_request import SellRequest
from datetime import *
from app import db
from libs.match_helper import match_sell_request,  match_buy_request
from libs.notification_helper import notify_user_of_canceled_match, notify_user_of_one_accepted_match
from routes.sell_request import sell_request_resource_fields
from routes.buy_request import buy_request_resource_fields
from routes.user import user_public_resource_fields
from routes.event import event_resource_fields

match_resource_fields = {
    'id': fields.Integer,
    'state': fields.String,
    'cre_dt': fields.DateTime,
    'up_dt': fields.DateTime,
    'event': fields.Nested(event_resource_fields),
    'sell_request': fields.Nested(sell_request_resource_fields),
    'buy_request': fields.Nested(buy_request_resource_fields),
    'seller': fields.Nested(user_public_resource_fields),
    'buyer': fields.Nested(user_public_resource_fields),
    'seller_state': fields.String,
    'buyer_state': fields.String,
    'meet_requests': fields.List(fields.Nested(meet_request_resource_fields))
}


class MatchesHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(match_resource_fields)
    def get(self, user):

        parser = reqparse.RequestParser()
        parser.add_argument('buy_request_id', required=False, location='args', type=int)
        parser.add_argument('sell_request_id', required=False, location='args', type=int)
        args = parser.parse_args()

        if args['buy_request_id'] is None and args['sell_request_id'] is None:
            users_matches = Match.query.filter(
                or_(Match.seller_id == user.id, Match.buyer_id == user.id)).all()
            return users_matches

        elif args['buy_request_id'] is not None:
            buy_request = BuyRequest.query.get(args['buy_request_id'])
            if buy_request is None:
                abort(400)

            most_recent_match = Match.query.filter(
                and_(Match.buy_request_id == buy_request.id, Match.state == "PROPOSED")
            ).order_by(desc(Match.cre_dt)).one()

            return most_recent_match

        else:
            sell_request = SellRequest.query.get(args['sell_request_id'])
            if sell_request is None:
                abort(400)

            most_recent_match = Match.query.filter(
                and_(Match.sell_request_id == sell_request.id, Match.state == "PROPOSED")
            ).order_by(desc(Match.cre_dt)).one()

            return most_recent_match


class MatchHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(match_resource_fields)
    def get(self, user, match_id):

        match = Match.query.get(match_id)

        if match.buyer_id != user.id and match.seller_id != user.id:
            abort(400)

        return match

    @marshal_with(match_resource_fields)
    def delete(self, user, match_id):

        match = Match.query.get(match_id)

        if match.buyer_id != user.id and match.seller_id != user.id:
            abort(400)

        if match.state is "COMPLETED" or match.state is "CANCELED" or match.state is "REJECTED":
            abort(400)

        match.state = "CANCELED"
        match.up_dt = datetime.utcnow()

        buy_request = match.buy_request
        buy_request.state = "WAITING"
        buy_request.up_dt = datetime.utcnow()

        sell_request = match.sell_request
        sell_request.state = "WAITING"
        sell_request.up_dt = datetime.utcnow()

        db.session.add(match)
        db.session.add(buy_request)
        db.session.add(sell_request)
        db.session.commit()

        if match.buyer.id is user.id:
            other_user = match.seller
        else:
            other_user = match.buyer

        notify_user_of_canceled_match(match.id, other_user)

        return match


class AcceptMatchHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(match_resource_fields)
    def post(self, user, match_id):

        match = Match.query.get(match_id)

        if match is None:
            abort(400)

        if match.buyer_id != user.id and match.seller_id != user.id:
            abort(400)

        if match.state == unicode("MEET_SETUP") or match.state == unicode("COMPLETED") or \
                match.state == unicode("CANCELED") or match.state == unicode("REJECTED"):
            abort(400)

        if match.buyer_id == user.id:
            match.buyer_state = "ACCEPTED"
        else:
            match.seller_state = "ACCEPTED"

        # if this is the second user to accept the match we need to them to submit a
        # meet request to accept
        if match.state == unicode("ONE_ACCEPTED"):
            match.state = "MEET_SETUP"
            match.up_dt = datetime.utcnow()
            match.sell_request.state = "IN_PERM_MATCH"
            match.buy_request.state = "IN_PERM_MATCH"

            meet_request_parser = reqparse.RequestParser()
            meet_request_parser.add_argument('loc_long', type=float, required=True, help="2")
            meet_request_parser.add_argument('loc_lat', type=float, required=True, help="3")
            meet_request_parser.add_argument('time', required=True, help="4")

            args = meet_request_parser.parse_args()

            new_meet_request = MeetRequest()
            new_meet_request.cre_dt = datetime.utcnow()
            new_meet_request.match_id = match_id
            new_meet_request.proposed_user = user

            if match.buyer.id is user.id:
                other_user = match.seller
            else:
                other_user = match.buyer

            new_meet_request.awaiting_user = other_user
            new_meet_request.awaiting_user_state = "WAITING"

            new_meet_request.loc_lat = args['loc_lat']
            new_meet_request.loc_long = args['loc_long']
            new_meet_request.time = args['time']

            new_meet_request.num_in_match = MeetRequest.query.filter_by(match_id=match_id).count() + 1

            match.up_dt = datetime.utcnow()

            db.session.add(match)
            db.session.add(new_meet_request)
            db.session.commit()

        elif match.state == unicode("PROPOSED"):
            match.state = "ONE_ACCEPTED"
            match.up_dt = datetime.utcnow()

            match.sell_request.state = "IN_ONE_ACCEPTED_MATCH"
            match.buy_request.state = "IN_ONE_ACCEPTED_MATCH"

            db.session.add(match)
            db.session.commit()

            if match.buyer.id is user.id:
                other_user = match.seller
            else:
                other_user = match.buyer

            notify_user_of_one_accepted_match(match.id, other_user)

        return match


class RejectMatchHandler(Resource):
    method_decorators = [authenticate]


    @marshal_with(match_resource_fields)
    def post(self, user, match_id):

        match = Match.query.get(match_id)

        if match.buyer_id != user.id and match.seller_id != user.id:
            abort(400)

        if match.state is "MEET_SETUP" or match.state is "COMPLETED" or match.state is "CANCELED":
            abort(400)

        if match.buyer_id == user.id:
            match.buyer_state = "REJECTED"
        else:
            match.seller_state = "REJECTED"

        match.state = "REJECTED"
        match.up_dt = datetime.utcnow()

        buy_request = match.buy_request
        buy_request.state = "WAITING"
        buy_request.up_dt = datetime.utcnow()

        sell_request = match.sell_request
        sell_request.state = "WAITING"
        sell_request.up_dt = datetime.utcnow()

        db.session.add(match)
        db.session.add(buy_request)
        db.session.add(sell_request)
        db.session.commit()

        if user.id is buy_request.submitted_by_user.id:
            match_buy_request(buy_request)
        else:
            match_sell_request(sell_request)

        return match
