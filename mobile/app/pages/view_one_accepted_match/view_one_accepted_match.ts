import {Page, NavController, NavParams} from 'ionic-angular';
import {MatchService} from '../../services/match'
import {Match} from '../../models/match'
import {UserPrivate} from "../../models/user_private";
import {UserPrivateService} from "../../services/user_private";
import {NoMatchPage} from '../no_match/no_match'
import {CreateMeetRequestPage} from "../create_meet_request/create_meet_request";
import {ViewProposedMatchPage} from "../view_proposed_match/view_proposed_match";


@Page({
    templateUrl: 'build/pages/view_one_accepted_match/view_one_accepted_match.html',
})
/**
 * Shows user a proposed match
 */
export class ViewOneAcceptedMatchPage {
    public match:Match;
    public user:UserPrivate;

    constructor(
        private matchService:MatchService,
        private userPrivateService:UserPrivateService,
        private nav:NavController,
        private navParams:NavParams
    ) {
        this.match = navParams.get('match');
        this.user = userPrivateService.cached_user;
    }

    accept() {
        this.nav.push(CreateMeetRequestPage, {
            match: this.match,
        })
    }

    reject() {
        this.matchService.match.subscribe(original_match => {
            if (original_match.buy_request.state == "IN_PROPOSED_MATCH") {
                this.matchService.match.subscribe(new_match => {
                    this.nav.push(ViewProposedMatchPage, {
                        match: new_match
                    })
                });
                this.matchService.fetchMatchByBuyRequest(original_match.buy_request.id)
            } else {
                this.nav.push(NoMatchPage)
            }
        });
        this.matchService.rejectMatch(this.match)
    }
}