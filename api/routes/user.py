from flask_restful import Resource, reqparse, fields, marshal_with, abort
from models.user import User
from datetime import *
from app import db
import jwt
from libs.auth_helper import authenticate
from flask_cors import cross_origin


#SAFE for all
user_public_resource_fields = {
    'id': fields.Integer,
    'buyer_rating': fields.Float,
    'seller_rating': fields.Float,
}

#UNSAFE
user_private_resource_fields = {
    'id': fields.Integer,
    'facebook_id': fields.String,
    'buyer_rating': fields.Float,
    'seller_rating': fields.Float,
    'stripe_id': fields.String,
}


class UserHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(user_private_resource_fields)
    def get(self, url_user_id, user):

        if user.id != url_user_id:
            abort(401)

        user = User.query.get(url_user_id)
        return user

    @marshal_with(user_public_resource_fields)
    def put(self, url_user_id, user):
        parser = reqparse.RequestParser()
        parser.add_argument('stripe_id', required=True)
        args = parser.parse_args()

        if user.id != url_user_id:
            abort(401)

        user = User.query.get(url_user_id)
        user.stripe_id = args['stripe_id']
        db.session.add(user)
        db.session.commit()
        return user


class RateUserHandler(Resource):
    method_decorators = [authenticate]

    def post(self, user, url_user_id):
        parser = reqparse.RequestParser()
        parser.add_argument('buyer_rating', type=float)
        parser.add_argument('seller_rating', type=float)

        #todo implement
        return 'success'


