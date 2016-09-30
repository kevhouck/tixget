from flask_restful import Resource, reqparse, marshal_with, fields
from models.user import User
from datetime import *
from app import db
import jwt
from flask_cors import cross_origin

token_resource_fields = {
    'access_token': fields.String,
    'user_id': fields.Integer,
}


class LoginHandler(Resource):

    @marshal_with(token_resource_fields)
    def post(self):

        parser = reqparse.RequestParser()
        parser.add_argument('temp_access_token', required=True)
        args = parser.parse_args()

        try:
            user_num = int(args['temp_access_token'])
        except ValueError:
            user_num = None

        encoded_jwt = jwt.encode({'user_id': 1}, 'secret', algorithm='HS256')
        ret_val = {
                'access_token': encoded_jwt,
                'user_id': 1,
            }

        # let us login as a specific user if we really want
        if user_num is not None and 0 < user_num <= 3 and user_num > 0:
            encoded_jwt = jwt.encode({'user_id': user_num}, 'secret', algorithm='HS256')

            ret_val = {
                'access_token': encoded_jwt,
                'user_id': user_num,
            }

        return ret_val


class LogoutHandler(Resource):

    def post(self):
        return