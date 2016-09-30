import {Page, Platform} from 'ionic-angular';
import {BrowseEventListPage} from '../browse_event_list/browse_event_list';
import {TransactionListPage} from '../transaction_list/transaction_list';
import {BuySellRequestListPage} from '../buy_sell_request_list/buy_sell_request_list';
import {ViewUserPrivatePage} from '../view_user_private/view_user_private';
import {MatchListPage} from '../match_list/match_list';


@Page({
  templateUrl: 'build/pages/tabs/tabs.html'
})
/**
 * Is the root view for the tabs
 */
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
    tab1Root: any = BrowseEventListPage;
    tab2Root: any = BuySellRequestListPage;
    tab3Root: any = MatchListPage;
    tab4Root: any = TransactionListPage;
    tab5Root: any = ViewUserPrivatePage;
    
}
