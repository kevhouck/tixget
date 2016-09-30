import {Page, NavController} from 'ionic-angular';
import {UserPrivate} from '../../models/user_private'
import {UserPrivateService} from '../../services/user_private'
import {Observable} from 'rxjs/Observable'

@Page({
  templateUrl: 'build/pages/edit_user_private/edit_user_private.html',
})
/**
 * Has populated text inputs with users editable info
 */
export class EditUserPrivatePage {
    private user:UserPrivate;
    
    constructor(
        private nav: NavController,
        private userPrivateService: UserPrivateService
    ) {
        userPrivateService.user.subscribe(user => {
            this.user = user
        })
        userPrivateService.getLoggedInPrivateUser()
    }
    
    save(user:UserPrivate) {
        this.userPrivateService.updatePrivateUser(user)
    }
}
