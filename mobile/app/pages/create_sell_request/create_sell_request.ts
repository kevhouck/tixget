import {Page, NavController, NavParams} from 'ionic-angular';
import {SellRequestService} from '../../services/sell_request';
import {Event} from '../../models/event'
import {ViewProposedMatchPage} from '../view_proposed_match/view_proposed_match'
import {MatchService} from "../../services/match";
import {NoMatchPage} from "../no_match/no_match";

@Page({
  templateUrl: 'build/pages/create_sell_request/create_sell_request.html',
})
/**
 * Page where user can create a sell request
 */
export class CreateSellRequestPage {
    public event:Event;
    public price_min:number;
    public loc_range:number;
    public loc_long:number;
    public loc_lat:number;


    constructor(
        private sellRequestService: SellRequestService,
        private matchService: MatchService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.event = navParams.get('event');
        this.loc_lat = 42.42;
        this.loc_long = 42.42;
        this.price_min = 30;
        this.loc_range = 3.3;
    }

    public submitSellRequest() {
        this.sellRequestService.sell_request.subscribe(sell_req => {
            if (sell_req.state == "IN_PROPOSED_MATCH") {
                this.matchService.match.subscribe(match => {
                    this.nav.push(ViewProposedMatchPage, {
                        match: match
                    })
                });
                this.matchService.fetchMatchBySellRequest(sell_req.id);
            } else {
                this.nav.push(NoMatchPage);
            }
        });

        this.sellRequestService.submitSellRequest(this.event.id, this.price_min, this.loc_long, this.loc_lat, this.loc_range);
    }

}
