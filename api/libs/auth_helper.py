from flask_restful import wraps, reqparse, abort
import jwt
from models.user import User


def authenticate(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        parser = reqparse.RequestParser()
        parser.add_argument('Access-Token', dest='access_token', location='headers', required=True, help='jwt required')
        req_args = parser.parse_args()

        payload = jwt.decode(req_args['access_token'], 'secret', algorithms=['HS256'])

        user = User.query.get(int(payload[unicode('user_id')]))

        if user is None:
            abort(400)

        kwargs['user'] = user

        return func(*args, **kwargs)

    return wrapper
