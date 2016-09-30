from flask_socketio import emit


# Used to notify a user that they need to accept or reject a match
# The other user in the match has accepted already
def notify_user_of_one_accepted_match(match_id, user):
    '''
    emit('notification', {
        'type': "MATCH_ONE_ACCEPTED",
        'match_id': match_id
    }, room=unicode(user.id))
    '''
    return


# Used to notify a user that the other user has another user has canceled the match
def notify_user_of_canceled_match(match_id, user):
    '''
    emit('notification', {
        'type': "MATCH_CANCELED",
        'match_id': match_id
    }, room=unicode(user.id))
    '''
    return


# Used to notify a user that they have a meet_request waiting for them to accept
def notify_user_of_waiting_meet_request(match_id, meet_request_id, user):
    '''
    emit('notification', {
        'type': "MEET_REQUEST_WAITING",
        'match_id': match_id,
        'meet_request_id': meet_request_id
    }, room=unicode(user.id))
        '''
    return


# Used to notify a user that the other user accepted their meet_request
def notify_user_of_opened_transaction(transaction_id, user):
    '''
    emit('notification', {
        'type': "TRANSACTION_OPENED",
        'transaction_id': transaction_id
    }, room=unicode(user.id))
    '''
    return


# Used to notify a buyer user that a transaction has been completed
def notify_user_of_completed_transaction(transaction_id, user):
    '''
    emit('notification', {
        'type': "TRANSACTION_COMPLETED",
        'transaction_id': transaction_id
    }, room=unicode(user.id))
    '''
    return


# Used to notify both users that a transaction has failed
# They missed the deadline
def notify_user_of_failed_transaction(transaction_id, user):
    '''
    emit('notification', {
        'type': "TRANSACTION_FAILED",
        'transaction_id': transaction_id
    }, room=unicode(user.id))
    '''
    return
