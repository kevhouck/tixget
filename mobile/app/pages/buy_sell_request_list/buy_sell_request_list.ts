import {Page, NavController} from 'ionic-angular';
import {BuyRequestService} from '../../services/buy_request';
import {SellRequestService} from '../../services/sell_request';
import {BuyRequest} from '../../models/buy_request';
import {SellRequest} from '../../models/sell_request';
import {Observable} from "rxjs/Observable";


@Page({
  templateUrl: 'build/pages/buy_sell_request_list/buy_sell_request_list.html',
})
/**
 * List of user's already submitted buy and sell requests
 */
export class BuySellRequestListPage {
    buy_requests:Observable<Array<BuyRequest>>;
    sell_requests:Observable<Array<SellRequest>>;
    
    constructor(
        private buyRequestService: BuyRequestService,
        private sellRequestService: SellRequestService,
        private nav: NavController
    ) {
        this.buy_requests = this.buyRequestService.buy_requests;
        this.sell_requests = this.sellRequestService.sell_requests;

        this.buyRequestService.fetchBuyRequests(true);
        this.sellRequestService.fetchSellRequests(true);
    }

    refresh(refresher) {
        this.buyRequestService.fetchBuyRequests(true);
        this.sellRequestService.fetchSellRequests(true);
        refresher.complete();
    }
}
