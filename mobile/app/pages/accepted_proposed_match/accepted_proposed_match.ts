import {Page, NavController} from 'ionic-angular';
import {SellRequestService} from "../../services/sell_request";
import {BuyRequestService} from "../../services/buy_request";
import {MatchService} from "../../services/match";


@Page({
  templateUrl: 'build/pages/accepted_proposed_match/accepted_proposed_match.html',
})
/**
 * Shown after a user accepts a match
 */
export class AcceptedProposedMatchPage {
    
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
