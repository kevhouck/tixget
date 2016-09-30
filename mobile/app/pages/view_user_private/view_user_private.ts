import {Page, NavController} from 'ionic-angular';
import {UserPrivate} from '../../models/user_private'
import {UserPrivateService} from '../../services/user_private'
import {Observable} from 'rxjs/Observable'
import {EditUserPrivatePage} from '../edit_user_private/edit_user_private'

@Page({
  templateUrl: 'build/pages/view_user_private/view_user_private.html',
})
/**
 * User can view their information
 */
export class ViewUserPrivatePage {
    private user:UserPrivate;
    
    constructor(
        private nav: NavController,
        private userPrivateService: UserPrivateService
    ) {
        this.user = userPrivateService.cached_user;
    }
    
    edit() {
        this.nav.push(EditUserPrivatePage)
    }
}
