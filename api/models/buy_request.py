from app import db
from event import Event
from user import User


class BuyRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    del_dt = db.Column(db.DateTime)
    event_id = db.Column(db.Integer, db.ForeignKey(Event.id))
    event = db.relationship(Event, uselist=False)
    submitted_by_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    submitted_by_user = db.relationship(User, uselist=False)
    price_exact = db.Column(db.Integer)
    loc_long = db.Column(db.Float)
    loc_lat = db.Column(db.Float)
    loc_range = db.Column(db.Float)
    state = db.Column(db.String(80))

    def __init__(self):
        self.event = None
        self.price_exact = None
        self.loc_long = None
        self.loc_lat = None
        self.loc_range = None
        self.state = None
