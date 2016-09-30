from flask_restful import Resource, reqparse, fields, abort, marshal_with
from datetime import *
from libs.auth_helper import authenticate
from app import db
from models.buy_request import BuyRequest
from models.event import Event
from models.match import Match
from models.user import User
from routes.event import event_resource_fields
from routes.user import user_public_resource_fields
from libs.match_helper import match_buy_request
from sqlalchemy import and_, or_
from flask_cors import cross_origin


buy_request_resource_fields = {
    'id': fields.Integer,
    'cre_dt': fields.DateTime,
    'del_dt': fields.DateTime,
    'event': fields.Nested(event_resource_fields),
    'submitted_by_user': fields.Nested(user_public_resource_fields),
    'price_exact': fields.Integer,
    'loc_long': fields.Float,
    'loc_lat': fields.Float,
    'loc_range': fields.Float,
    'state': fields.String,
}

buy_request_parser = reqparse.RequestParser()
buy_request_parser.add_argument('event_id', type=int, required=True, help="err event")
buy_request_parser.add_argument('price_exact', type=int, required=True, help="err_price")
buy_request_parser.add_argument('loc_long', type=float, required=True, help="err loc long")
buy_request_parser.add_argument('loc_lat', type=float, required=True, help="err loc lat")
buy_request_parser.add_argument('loc_range', type=float, required=True, help="err loc range")


class BuyRequestsHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(buy_request_resource_fields)
    def post(self, user):

        args = buy_request_parser.parse_args()
        new_buy_request = BuyRequest()

        new_buy_request.cre_dt = datetime.utcnow()
        new_buy_request.loc_lat = args['loc_lat']
        new_buy_request.loc_long = args['loc_long']
        new_buy_request.loc_range = args['loc_range']
        new_buy_request.price_exact = args['price_exact']
        new_buy_request.state = "WAITING"

        existing_event = Event.query.get(args['event_id'])

        if not existing_event:
            abort(400)

        new_buy_request.event = existing_event
        new_buy_request.submitted_by_user = user

        new_buy_request = match_buy_request(new_buy_request)

        return new_buy_request

    @marshal_with(buy_request_resource_fields)
    def get(self, user):

        users_buy_requests = BuyRequest.query.filter_by(submitted_by_user_id=user.id).all()
        return users_buy_requests


class BuyRequestHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(buy_request_resource_fields)
    def get(self, user, buy_request_id):
        existing_buy_request = BuyRequest.query.get(buy_request_id)
        if not existing_buy_request or existing_buy_request.submitted_by_user_id != user.id:
            abort(400)
        return existing_buy_request

    @marshal_with(buy_request_resource_fields)
    def delete(self, user, buy_request_id):
        existing_buy_request = BuyRequest.query.get(buy_request_id)
        if not existing_buy_request or existing_buy_request.submitted_by_user_id != user.id:
            abort(400)

        if existing_buy_request.state is "IN_PERM_MATCH":
            abort(400)

        if existing_buy_request.state is "CANCELED":
            abort(400)

        # go through and delete all matches that were "ONE_ACCEPTED"
        matches = Match.query.filter(
            and_(Match.buy_request.id == existing_buy_request.id, Match.state == "ONE_ACCEPTED")
        ).all()

        for match in matches:
            match.state = "CANCELED"
            db.session.add(match)

        existing_buy_request.state = "CANCELED"
        existing_buy_request.del_dt = datetime.utcnow()

        db.session.add(existing_buy_request)
        db.session.commit()
        return existing_buy_request
