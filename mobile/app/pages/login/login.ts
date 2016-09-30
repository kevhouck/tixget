import {Page, NavController} from 'ionic-angular';
import {AuthService} from '../../services/auth'
import {NotificationService} from '../../services/notification'
import {TabsPage} from '../tabs/tabs'


@Page({
  templateUrl: 'build/pages/login/login.html',
})
/**
 * Is first loaded page with facebook login and logo
 */
export class LoginPage {
    public fb_email:string;
    public fb_password:string;
    
    constructor(
        private auth:AuthService, 
        private nav: NavController,
        private notificationService: NotificationService
    ) {
        this.fb_email = "";
        this.fb_password = "";
        auth.login_flag.subscribe(is_logged_in => {
            if (is_logged_in) {
                console.log('successfully logged in');
                this.afterLoginSetup();
                this.nav.push(TabsPage)
            }
        });
    }
    
    public clickLogin() {
        console.log('logging in');
        this.auth.login(this.fb_email, this.fb_password)
    }
    
    private afterLoginSetup() {
        this.notificationService.startNotificationPolling();
        // subscribe will go in notifications, but must be subscribed to to avoid error
        this.notificationService.notifications.subscribe(notifications => {
            console.log(notifications)
        })
    }
}
