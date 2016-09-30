from flask_restful import Resource, reqparse, fields, marshal_with, abort
from sqlalchemy import engine, MetaData
from models.user import User
from models.event import Event
from models.match import Match
from models.sell_request import SellRequest
from models.buy_request import BuyRequest
from models.transaction import Transaction
from models.meet_request import MeetRequest
from datetime import *
from app import db
import jwt
from libs.auth_helper import authenticate
from flask_cors import cross_origin


class PopulateHandler(Resource):

    def post(self):
        #clear db
        db.drop_all()
        db.create_all()

        #now add data
        user1 = User()
        user1.buyer_rating = 5
        user1.seller_rating = 4.5
        user1.stripe_id = "865153748451"
        user1.facebook_id = "68746546548674"
        user1.cre_dt = datetime.utcnow()

        user2 = User()
        user2.buyer_rating = 4
        user2.seller_rating = 3.5
        user2.stripe_id = "87768457875441"
        user2.facebook_id = "68476545376743"
        user2.cre_dt = datetime.utcnow()

        user3 = User()
        user3.buyer_rating = 2
        user3.seller_rating = 1
        user3.stripe_id = "654654654534564"
        user3.facebook_id = "687468543456478"
        user3.cre_dt = datetime.utcnow()

        db.session.add(user1)
        db.session.add(user2)
        db.session.add(user3)
        db.session.commit()

        event1 = Event()
        event1.name = "Macklemore"
        event1.category = "Music"
        event1.subcategory = "Rap"
        event1.description = "Thrift Shop Tour"
        event1.loc_description = "Orpheum Theater"
        event1.loc_lat = 43.0763356
        event1.loc_long = -89.4004324
        event1.time = datetime.utcnow()
        event1.cre_dt = datetime.utcnow()

        event2 = Event()
        event2.name = "Minnesota @ Wisconsin"
        event2.description = "Gophers vs Badgers"
        event2.category = "Sports"
        event2.subcategory = "Football"
        event2.loc_description = "Camp Randall"
        event2.loc_lat = 43.0763356
        event2.loc_long = -89.4004324
        event2.time = datetime.utcnow()
        event2.cre_dt = datetime.utcnow()

        event3 = Event()
        event3.name = "Michigan @ Wisconsin"
        event3.category = "Sports"
        event3.subcategory = "Basketball"
        event3.description = "Wolverines vs Badgers"
        event3.loc_description = "Kohl Center"
        event3.loc_lat = 43.0763356
        event3.loc_long = -89.4004324
        event3.time = datetime.utcnow()
        event3.cre_dt = datetime.utcnow()

        db.session.add(event1)
        db.session.add(event2)
        db.session.add(event3)
        db.session.commit()

        '''
        sell_req1 = SellRequest()
        sell_req1.event = event1
        sell_req1.submitted_by_user = user2
        sell_req1.loc_lat = 43.0763356
        sell_req1.loc_long = -89.4004324
        sell_req1.loc_range = 3
        sell_req1.price_min = 20
        sell_req1.state = "WAITING"
        sell_req1.cre_dt = datetime.utcnow()

        db.session.add(sell_req1)
        db.session.commit()

        sell_req2 = SellRequest()
        sell_req2.event = event2
        sell_req2.submitted_by_user = user2
        sell_req2.loc_lat = 43.0763356
        sell_req2.loc_long = -89.4004324
        sell_req2.loc_range = 3
        sell_req2.price_min = 20
        sell_req2.state = "IN_PROPOSED_MATCH"
        sell_req2.cre_dt = datetime.utcnow()

        buy_req1 = BuyRequest()
        buy_req1.event = event2
        buy_req1.submitted_by_user = user1
        buy_req1.loc_lat = 43.0763356
        buy_req1.loc_long = -89.4004324
        buy_req1.loc_range = 3
        buy_req1.price_exact = 20
        buy_req1.state = "IN_PROPOSED_MATCH"
        buy_req1.cre_dt = datetime.utcnow()

        db.session.add(sell_req2)
        db.session.add(buy_req1)
        db.session.commit()

        match1 = Match()
        match1.state = "ONE_ACCEPTED"
        match1.event = buy_req1.event
        match1.buy_request = buy_req1
        match1.sell_request = sell_req2
        match1.seller = sell_req2.submitted_by_user
        match1.buyer = buy_req1.submitted_by_user
        match1.cre_dt = datetime.utcnow()
        match1.seller_state = "ACCEPTED"
        match1.buyer_state = "WAITING"

        db.session.add(match1)
        db.session.commit()
        '''
        '''
        buy_req1 = BuyRequest()
        buy_req1.event = event1
        buy_req1.submitted_by_user = user1
        buy_req1.loc_lat = 11.11
        buy_req1.loc_long = 22.22
        buy_req1.loc_lat = 2.5
        buy_req1.price_exact = 30
        buy_req1.state = "WAITING"
        buy_req1.cre_dt = datetime.utcnow()

        buy_req2 = BuyRequest()
        buy_req2.event = event2
        buy_req2.submitted_by_user = user1
        buy_req2.loc_lat = 33.33
        buy_req2.loc_long = 22.22
        buy_req2.loc_lat = 2
        buy_req2.price_exact = 25
        buy_req2.state = "MATCH"
        buy_req2.cre_dt = datetime.utcnow()


        buy_req3 = BuyRequest()
        buy_req3.event = event3
        buy_req3.submitted_by_user = user1
        buy_req3.loc_lat = 33.33
        buy_req3.loc_long = 22.22
        buy_req3.loc_lat = 2
        buy_req3.price_exact = 25
        buy_req3.state = "MATCH"
        buy_req3.cre_dt = datetime.utcnow()


        sell_req1 = SellRequest()
        sell_req1.event = event3
        sell_req1.submitted_by_user = user1
        sell_req1.loc_lat = 45.44
        sell_req1.loc_long = 45.44
        sell_req1.loc_range = 3
        sell_req1.price_min = 40
        sell_req1.state = "WAITING"
        sell_req1.cre_dt = datetime.utcnow()

        sell_req2 = SellRequest()
        sell_req2.event = event2
        sell_req2.submitted_by_user = user2
        sell_req2.loc_long = 22.22
        sell_req2.loc_lat = 33.33
        sell_req2.loc_range = 5
        sell_req2.price_min = 20
        sell_req2.state = "MATCH"
        sell_req2.cre_dt = datetime.utcnow()

        sell_req3 = SellRequest()
        sell_req3.event = event3
        sell_req3.submitted_by_user = user2
        sell_req3.loc_long = 22.22
        sell_req3.loc_lat = 33.33
        sell_req3.loc_range = 5
        sell_req3.price_min = 20
        sell_req3.state = "MATCH"
        sell_req3.cre_dt = datetime.utcnow()

        db.session.add(buy_req1)
        db.session.add(buy_req2)
        db.session.add(buy_req3)
        db.session.add(sell_req1)
        db.session.add(sell_req2)
        db.session.add(sell_req3)
        db.session.commit()

        match1 = Match()
        match1.buy_request = buy_req1
        match1.sell_request = sell_req2
        match1.state = "PROPOSED"
        match1.buyer_state = "WAITING"
        match1.seller_state = "WAITING"
        match1.cre_dt = datetime.utcnow()

        match2 = Match()
        match2.buy_request = buy_req1
        match2.sell_request = sell_req2
        match2.state = "PROPOSED"
        match2.buyer_state = "ACCEPTED"
        match2.seller_state = "ACCEPTED"
        match2.cre_dt = datetime.utcnow()

        db.session.add(match1)
        db.session.add(match2)
        db.session.commit()

        meet_req1 = MeetRequest()
        meet_req1.awaiting_user = user2
        meet_req1.proposed_user = user1
        meet_req1.awaiting_user_state = "ACCEPTED"
        meet_req1.match_id = match2.id
        meet_req1.loc_lat = 33.33
        meet_req1.loc_long = 33.33
        meet_req1.num_in_match = 1
        meet_req1.time = datetime.utcnow()

        db.session.add(meet_req1)
        db.session.commit()

        transaction1 = Transaction()
        transaction1.buyer_user = user2
        transaction1.seller_user = user2
        transaction1.match = match2
        transaction1.opened_dt = datetime.utcnow()
        transaction1.opened_dt = datetime.utcnow()
        transaction1.state = "COMPLETED"

        db.session.add(transaction1)
        db.session.commit()
'''
