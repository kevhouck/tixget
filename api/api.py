from app import app, db, api #, socketio
from routes.user import UserHandler, RateUserHandler
from routes.event import EventsHandler, EventHandler
from routes.sell_request import SellRequestHandler, SellRequestsHandler
from routes.buy_request import BuyRequestsHandler, BuyRequestHandler
from routes.match import MatchesHandler, MatchHandler, AcceptMatchHandler, RejectMatchHandler
from routes.meet_request import MeetRequestsHandler, MeetRequestHandler, AcceptMeetRequestHandler, RejectMeetRequestHandler
from routes.transaction import TransactionsHandler, TransactionHandler, ConfirmTransactionHandler, TransactionSecretHandler
from routes.message import MessagesHandler
from routes.auth import LoginHandler, LogoutHandler
from routes.populate_db import PopulateHandler
#from flask_socketio import join_room, emit

api.add_resource(LoginHandler, '/login')
api.add_resource(LogoutHandler, '/logout')

api.add_resource(UserHandler, '/user/<int:url_user_id>')
api.add_resource(RateUserHandler, '/user/<int:url_user_id>/rate')
#api.add_resource(NotificationHandler, '/user/<int:url_user_id>/notification')

api.add_resource(EventsHandler, '/event')
api.add_resource(EventHandler, '/event/<int:event_id>')

api.add_resource(SellRequestsHandler, '/sell_request')
api.add_resource(SellRequestHandler, '/sell_request/<int:sell_request_id>')

api.add_resource(BuyRequestsHandler, '/buy_request')
api.add_resource(BuyRequestHandler, '/buy_request/<int:buy_request_id>')

api.add_resource(MatchesHandler, '/match')
api.add_resource(MatchHandler, '/match/<int:match_id>')
api.add_resource(AcceptMatchHandler, '/match/<int:match_id>/accept')
api.add_resource(RejectMatchHandler, '/match/<int:match_id>/reject')

api.add_resource(MeetRequestsHandler, '/match/<int:match_id>/meet_request')
api.add_resource(MeetRequestHandler, '/match/<int:match_id>/meet_request/<int:meet_request_id>')
api.add_resource(AcceptMeetRequestHandler, '/match/<int:match_id>/meet_request/<int:meet_request_id>/accept')
api.add_resource(RejectMeetRequestHandler, '/match/<int:match_id>/meet_request/<int:meet_request_id>/reject')

api.add_resource(TransactionsHandler, '/transaction')
api.add_resource(TransactionHandler, '/transaction/<int:transaction_id>')
api.add_resource(ConfirmTransactionHandler, '/transaction/<int:transaction_id>/confirm')
api.add_resource(TransactionSecretHandler, '/transaction/<int:transaction_id>/secret')

api.add_resource(MessagesHandler, '/transaction/<int:transaction_id>/message/')

api.add_resource(PopulateHandler, '/populate')

'''
@socketio.on('ping')
def asdf():
    print 'ping'


@socketio.on('connect user')
def add_user_to_notif(some_data):
    join_room(unicode(some_data['room_name']))
    print 'user ' + unicode(some_data['room_name']) + ' connected!'
    emit('user connected', room=unicode(some_data['room_name']))
'''
