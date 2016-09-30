import {App, Platform} from 'ionic-angular';
import {LoginPage} from './pages/login/login';
import {EventService} from './services/event';
import {AuthService} from './services/auth'
import {HTTP_PROVIDERS} from 'angular2/http'
import {HttpService} from './services/http_service'
import {BuyRequestService} from './services/buy_request'
import {SellRequestService} from './services/sell_request'
import {UserPrivateService} from './services/user_private'
import {MatchService} from './services/match'
import {TransactionService} from './services/transaction'
import {UserPublicService} from './services/user_public'
import {NotificationService} from './services/notification'


// https://angular.io/docs/ts/latest/api/core/Type-interface.html
import {Type} from 'angular2/core';


@App({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  config: {
    tabbarPlacement: 'bottom',
  }, // http://ionicframework.com/docs/v2/api/config/Config/
  providers: [HttpService, HTTP_PROVIDERS, EventService, AuthService, UserPrivateService,
        BuyRequestService, SellRequestService, MatchService, TransactionService,
        UserPublicService, NotificationService]
})
export class MyApp {
  rootPage: Type = LoginPage;

  constructor(platform: Platform) {
    platform.ready().then(() => {
        platform.fullScreen()
        
      // The platform is now ready. Note: if this callback fails to fire, follow
      // the Troubleshooting guide for a number of possible solutions:
      //
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //
      // First, let's hide the keyboard accessory bar (only works natively) since
      // that's a better default:
      //
      // Keyboard.setAccessoryBarVisible(false);
      //
      // For example, we might change the StatusBar color. This one below is
      // good for dark backgrounds and light text:
      // StatusBar.setStyle(StatusBar.LIGHT_CONTENT)
    });
  }
}
