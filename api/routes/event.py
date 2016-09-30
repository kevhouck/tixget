from flask_restful import Resource, fields, marshal_with
from app import db
from libs.auth_helper import authenticate
from models.event import Event
from datetime import datetime
from flask_cors import cross_origin


event_resource_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'loc_description': fields.String,
    'loc_long': fields.Float,
    'loc_lat': fields.Float,
    'description': fields.String,
    'time': fields.DateTime,
    'category': fields.String,
    'subcategory': fields.String,
}

class EventsHandler(Resource):
    method_decorators = [authenticate]

    # will convert post to admin route
    '''
    def post(self):

        new_event = Event()
        new_event.description = "an event"
        new_event.category = "sports"
        new_event.loc_description = "probably a stadium"
        new_event.loc_lat = 54
        new_event.loc_long = 321.52
        new_event.name = "a at b"
        new_event.time = datetime(2016, 2, 2, 1, 1, 0, 0)
        new_event.subcategory = "asdf"
        db.session.add(new_event)
        db.session.commit()
        return "new event created"
    '''

    @marshal_with(event_resource_fields)
    def get(self, user):
        events = Event.query.all()
        return events


class EventHandler(Resource):
    method_decorators = [authenticate]

    @marshal_with(event_resource_fields)
    def get(self, event_id, user):
        event = Event.query.get(event_id)
        return event
