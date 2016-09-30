import {Page} from 'ionic-angular';
import {NotificationService} from '../../services/notification'
import {Notification} from '../../models/notification'


@Page({
  templateUrl: 'build/pages/notifications/notifications.html',
})
/**
 * Is a list of notifications. Worry about later
 */
export class NotificationsPage {
    public notifications:Array<Notification>
    
    constructor(
        private notificationService: NotificationService
    ) {
        this.notifications = new Array<Notification>()
        this.notificationService.notifications.subscribe(notifications => {
            this.notifications = notifications
        })
    }
    
    public clickNotification(type:string, match_id:number, 
        meet_request_id:number, transaction_id:number) {
        if(type == "MATCH_ONE_ACCEPTED") {
            
        } else if (type == "MATCH_CANCELED") {

        } else if (type == "MEET_REQUEST_WAITING") {
            
        } else if (type == "TRANSACTION_OPENED") {
            
        } else if (type == "TRANSACTION_COMPLETED") {
            
        } else if (type == "TRANSACTION_FAILED") {
            
        }
    }
}
