from app import db
from user import User
from match import Match
from transaction_secret import TransactionSecret
from message import Message


class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    opened_dt = db.Column(db.DateTime)
    completed_dt = db.Column(db.DateTime)
    canceled_dt = db.Column(db.DateTime)
    seller_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    seller_user = db.relationship(User, uselist=False, foreign_keys=[seller_user_id])
    buyer_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    buyer_user = db.relationship(User, uselist=False, foreign_keys=[buyer_user_id])
    match_id = db.Column(db.Integer, db.ForeignKey(Match.id))
    match = db.relationship(Match, uselist=False)
    loc_long = db.Column(db.Float)
    loc_lat = db.Column(db.Float)
    time = db.Column(db.DateTime)
    state = db.Column(db.String(80))
    secret_id = db.Column(db.Integer, db.ForeignKey(TransactionSecret.id))
    messages = db.relationship(Message)
