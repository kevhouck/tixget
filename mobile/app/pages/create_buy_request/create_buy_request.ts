import {Page, NavController, NavParams} from 'ionic-angular';
import {BuyRequestService} from '../../services/buy_request';
import {Event} from '../../models/event'
import {ViewProposedMatchPage} from '../view_proposed_match/view_proposed_match'
import {MatchService} from "../../services/match";
import {NoMatchPage} from "../no_match/no_match";

@Page({
  templateUrl: 'build/pages/create_buy_request/create_buy_request.html',
})
/**
 * Page where user can create a buy request
 */
export class CreateBuyRequestPage {
    public event:Event;
    public price_exact:number;
    public loc_range:number;
    public loc_long:number;
    public loc_lat:number;
    
    constructor(
        private buyRequestService: BuyRequestService,
        private matchService: MatchService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.event = navParams.get('event');
        this.loc_lat = 42.42;
        this.loc_long = 42.42;
        this.price_exact = 35;
        this.loc_range = 5.5;
    }
    
    public submitBuyRequest() {
            this.buyRequestService.buy_request.subscribe(buy_req => {
                if (buy_req.state == "IN_PROPOSED_MATCH") {
                    this.matchService.match.subscribe(match => {
                        this.nav.push(ViewProposedMatchPage, {
                            match: match
                        })
                    });
                    this.matchService.fetchMatchByBuyRequest(buy_req.id);
                } else {
                    this.nav.push(NoMatchPage);
                }
            });
            
            this.buyRequestService.submitBuyRequest(this.event.id, this.price_exact, this.loc_long, this.loc_lat, this.loc_range);
        }
    
}
