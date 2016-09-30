from flask_restful import Resource, reqparse, fields, abort, marshal_with
from datetime import *
from libs.auth_helper import authenticate
from app import db
from models.sell_request import SellRequest
from models.event import Event
from models.user import User
from routes.event import event_resource_fields
from routes.user import user_public_resource_fields
from libs.match_helper import match_sell_request
from models.match import Match
from sqlalchemy import and_, or_

sell_request_resource_fields = {
    'id': fields.Integer,
    'cre_dt': fields.DateTime,
    'del_dt': fields.DateTime,
    'event': fields.Nested(event_resource_fields),
    'submitted_by_user': fields.Nested(user_public_resource_fields),
    'price_min': fields.Integer,
    'loc_long': fields.Float,
    'loc_lat': fields.Float,
    'loc_range': fields.Float,
    'state': fields.String,
}

sell_request_parser = reqparse.RequestParser()
sell_request_parser.add_argument('event_id', type=int, required=True)
sell_request_parser.add_argument('price_min', type=int, required=True)
sell_request_parser.add_argument('loc_long', type=float, required=True)
sell_request_parser.add_argument('loc_lat', type=float, required=True)
sell_request_parser.add_argument('loc_range', type=float, required=True)


class SellRequestsHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(sell_request_resource_fields)
    def post(self, user):

        args = sell_request_parser.parse_args()
        new_sell_request = SellRequest()

        new_sell_request.cre_dt = datetime.utcnow()
        new_sell_request.loc_lat = args['loc_lat']
        new_sell_request.loc_long = args['loc_long']
        new_sell_request.loc_range = args['loc_range']
        new_sell_request.price_min = args['price_min']
        new_sell_request.state = "WAITING"

        existing_event = Event.query.get(args['event_id'])

        if not existing_event:
            abort(400)

        new_sell_request.event = existing_event
        new_sell_request.submitted_by_user = user

        # todo do better matching here
        new_sell_request = match_sell_request(new_sell_request)

        return new_sell_request

    @marshal_with(sell_request_resource_fields)
    def get(self, user):

        users_sell_requests = SellRequest.query.filter_by(submitted_by_user_id=user.id).all()
        return users_sell_requests


class SellRequestHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(sell_request_resource_fields)
    def get(self, user, sell_request_id):
        existing_sell_request = SellRequest.query.get(sell_request_id)
        if not existing_sell_request or existing_sell_request.submitted_by_user_id != user.id:
            abort(400)
        return existing_sell_request

    @marshal_with(sell_request_resource_fields)
    def delete(self, user, sell_request_id):
        existing_sell_request = SellRequest.query.get(sell_request_id)
        if not existing_sell_request or existing_sell_request.submitted_by_user_id != user.id:
            abort(400)

        if existing_sell_request.state is "IN_PERM_MATCH":
            abort(400)

        if existing_sell_request.state is "CANCELED":
            abort(400)

        # go through and delete all matches that were "ONE_ACCEPTED"
        matches = Match.query.filter(
            and_(Match.sell_request.id == existing_sell_request.id, Match.state == "ONE_ACCEPTED")
        ).all()

        for match in matches:
            match.state = "CANCELED"
            db.session.add(match)

        existing_sell_request.state = "CANCELED"
        existing_sell_request.del_dt = datetime.utcnow()

        db.session.add(existing_sell_request)
        db.session.commit()
        return existing_sell_request
