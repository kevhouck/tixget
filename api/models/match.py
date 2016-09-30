from app import db
from sell_request import SellRequest
from buy_request import BuyRequest
from meet_request import MeetRequest
from user import User
from event import Event

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    up_dt = db.Column(db.DateTime)
    event_id = db.Column(db.Integer, db.ForeignKey(Event.id))
    event = db.relationship(Event)
    sell_request_id = db.Column(db.Integer, db.ForeignKey(SellRequest.id))
    sell_request = db.relationship(SellRequest, uselist=False)
    buy_request_id = db.Column(db.Integer, db.ForeignKey(BuyRequest.id))
    buy_request = db.relationship(BuyRequest, uselist=False)
    seller_id = db.Column(db.Integer, db.ForeignKey(User.id))
    seller = db.relationship(User, uselist=False, foreign_keys=[seller_id])
    buyer_id = db.Column(db.Integer, db.ForeignKey(User.id))
    buyer = db.relationship(User, uselist=False, foreign_keys=[buyer_id])
    seller_state = db.Column(db.String(80))
    buyer_state = db.Column(db.String(80))
    meet_requests = db.relationship(MeetRequest, uselist=True)
    state = db.Column(db.String(80))
