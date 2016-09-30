from models.sell_request import SellRequest
from models.buy_request import BuyRequest
from app import db
from models.sell_request import SellRequest
from models.match import Match
from datetime import *
from sqlalchemy import and_


def match_buy_request(buy_request):
    #todo this works, but it would be way more efficient to have the db do it
    sell_requests = SellRequest.query.filter(
        and_(SellRequest.event_id == buy_request.event.id, SellRequest.price_min <= buy_request.price_exact,
             SellRequest.submitted_by_user_id != buy_request.submitted_by_user.id)
    ).all()

    previous_matches = Match.query.filter(
        and_(Match.buy_request_id == buy_request.id)
    ).all()

    for sell_req in sell_requests:
        for previous_match in previous_matches:
            if sell_req.id is previous_match.sell_request_id:
                sell_requests.remove(sell_req)

    if len(sell_requests) is 0:
        buy_request.cre_dt = datetime.utcnow()
        db.session.add(buy_request)
        db.session.commit()
        return buy_request

    sell_request = sell_requests[0]

    buy_request.state = "IN_PROPOSED_MATCH"
    sell_request.state = "IN_PROPOSED_MATCH"

    match = Match()
    match.event = buy_request.event
    match.buy_request = buy_request
    match.sell_request = sell_request
    match.buyer = buy_request.submitted_by_user
    match.seller = sell_request.submitted_by_user
    match.buyer_state = "WAITING"
    match.seller_state = "WAITING"
    match.state = "PROPOSED"
    match.cre_dt = datetime.utcnow()

    db.session.add(buy_request)
    db.session.add(sell_request)
    db.session.add(match)
    db.session.commit()

    return buy_request


def match_sell_request(sell_request):
    # todo this works, but it would be way more efficient to have the db do it
    buy_requests = BuyRequest.query.filter(
        and_(BuyRequest.event_id == sell_request.event.id, BuyRequest.price_exact >= sell_request.price_min,
             BuyRequest.submitted_by_user_id != sell_request.submitted_by_user.id)
    ).all()

    previous_matches = Match.query.filter(
        and_(Match.sell_request_id == sell_request.id)
    ).all()

    for buy_req in buy_requests:
        for previous_match in previous_matches:
            if buy_req.id is previous_match.sell_request_id:
                buy_requests.remove(buy_req)

    if len(buy_requests) is 0:
        sell_request.cre_dt = datetime.utcnow()
        db.session.add(sell_request)
        db.session.commit()
        return sell_request

    buy_request = buy_requests[0]

    buy_request.state = "IN_PROPOSED_MATCH"
    sell_request.state = "IN_PROPOSED_MATCH"

    match = Match()
    match.event = buy_request.event
    match.buy_request = buy_request
    match.sell_request = sell_request
    match.buyer = buy_request.submitted_by_user
    match.seller = sell_request.submitted_by_user
    match.buyer_state = "WAITING"
    match.seller_state = "WAITING"
    match.state = "PROPOSED"
    match.cre_dt = datetime.utcnow()

    db.session.add(sell_request)
    db.session.add(buy_request)
    db.session.add(match)
    db.session.commit()

    return sell_request
