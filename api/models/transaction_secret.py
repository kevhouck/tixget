from app import db


class TransactionSecret(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    up_dt = db.Column(db.DateTime)
    secret = db.Column(db.String(120))
