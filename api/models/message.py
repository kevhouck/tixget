from app import db
from user import User


class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    transaction_id = db.Column(db.Integer, db.ForeignKey('transaction.id'))
    to_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    to_user = db.relationship(User, uselist=False, foreign_keys=[to_user_id])
    from_user_id = db.Column(db.Integer, db.ForeignKey(User.id))
    from_user = db.relationship(User, uselist=False, foreign_keys=[from_user_id])
    content = db.Column(db.String(1000))
