import {Page, NavController, NavParams} from 'ionic-angular';
import {MatchService} from '../../services/match'
import {Match} from '../../models/match'
import {AcceptedProposedMatchPage} from '../accepted_proposed_match/accepted_proposed_match'
import {UserPrivate} from "../../models/user_private";
import {UserPrivateService} from "../../services/user_private";
import {NoMatchPage} from '../no_match/no_match'

@Page({
  templateUrl: 'build/pages/view_proposed_match/view_proposed_match.html',
})
/**
 * Shows user a proposed match
 */
export class ViewProposedMatchPage {
    public match: Match;
    public user: UserPrivate;
    
    constructor(
        private matchService: MatchService,
        private userPrivateService: UserPrivateService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.match = navParams.get('match');
        this.user = userPrivateService.cached_user;
    }
    
    accept() {
        this.matchService.match.subscribe(match => {
            this.nav.push(AcceptedProposedMatchPage);
        });
        this.matchService.acceptProposedMatch(this.match);
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
