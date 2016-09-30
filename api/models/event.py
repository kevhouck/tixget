from app import db


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    cre_dt = db.Column(db.DateTime)
    up_dt = db.Column(db.DateTime)
    name = db.Column(db.String(120))
    description = db.Column(db.String(120))
    loc_description = db.Column(db.String(120))
    loc_long = db.Column(db.Float)
    loc_lat = db.Column(db.Float)
    time = db.Column(db.DateTime)
    category = db.Column(db.String(80))
    subcategory = db.Column(db.String(80))

    def __init__(self):
        self.name = None
        self.description = None
        self.loc_description = None
        self.loc_long = None
        self.loc_lat = None
        self.time = None
        self.category = None
        self.subcategory = None

