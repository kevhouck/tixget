import {Page, NavController} from 'ionic-angular';
import {MatchService} from "../../services/match";
import {SellRequestService} from "../../services/sell_request";
import {BuyRequestService} from "../../services/buy_request";


@Page({
  templateUrl: 'build/pages/no_match/no_match.html',
})
/**
 * Shown to user after they submit a buy sell request and receive no matches
 */
export class NoMatchPage {

    constructor(
        private nav: NavController,
        private buyReqService: BuyRequestService,
        private sellReqService: SellRequestService,
        private matchService: MatchService
    ) {

    }

    okay() {
        this.buyReqService.fetchBuyRequests(true);
        this.sellReqService.fetchSellRequests(true);
        this.matchService.fetchMatches(true);
        this.nav.popToRoot()
    }
}