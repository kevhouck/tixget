from app import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    up_dt = db.Column(db.DateTime)
    facebook_id = db.Column(db.String(80), unique=True)
    stripe_id = db.Column(db.String(80))
    buyer_rating = db.Column(db.Float)
    seller_rating = db.Column(db.Float)

    def __init__(self):
        self.facebook_id = None
        self.stripe_id = None
        self.buyer_rating = None
        self.seller_rating = None
