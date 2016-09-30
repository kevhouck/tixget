from app import db
from user import User


class MeetRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    num_in_match = db.Column(db.Integer)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'))
    proposed_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    proposed_user = db.relationship(User, uselist=False, foreign_keys=[proposed_user_id])
    awaiting_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    awaiting_user = db.relationship(User, uselist=False, foreign_keys=[awaiting_user_id])
    awaiting_user_state = db.Column(db.String(80))
    loc_long = db.Column(db.Float)
    loc_lat = db.Column(db.Float)
    time = db.Column(db.DateTime)
