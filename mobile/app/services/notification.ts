import {Notification} from '../models/notification'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import {Injectable} from 'angular2/core'
import {HttpService} from './http_service'
import {UserPrivateService} from './user_private'
import {UserPrivate} from '../models/user_private'
import * as io from 'socket.io-client'

@Injectable()
export class NotificationService {  
    private cached_notifications:Array<Notification>
      
    private internal_notification:Observable<Notification>;
    private internal_notification_observer:Observer<Notification>;
    
    public notifications:Observable<Array<Notification>>;
    private notifications_observer:Observer<Array<Notification>>;
    
    private socket:any;
    
    constructor(
        private httpService: HttpService,
        private userPrivateService: UserPrivateService
    ) {
        this.cached_notifications = new Array<Notification>()
        
        this.notifications = new Observable(observer => {
            this.notifications_observer = observer
        })
            
        this.internal_notification = new Observable(observer => {
            this.internal_notification_observer = observer
        })
        
        this.internal_notification.subscribe(new_notification => {
            this.cached_notifications = this.cached_notifications.concat(new_notification)
            this.notifications_observer.next(this.cached_notifications)
        })      
    }
    
    public startNotificationPolling() {
        /**
        console.log('setting up socket.io') 
        this.socket = io('http://localhost:5000');
        this.socket.emit('connect user', {
            room_name: 1
        })
        this.socket.on('user connected', () => console.log('connected to room') )
        this.socket.on('notification', (json) => {
            console.log('notification received!!!')
            this.internal_notification_observer.next(Notification.fromJSON(json))
        })*/
    }
}