import {Page, NavController} from 'ionic-angular';
import {MatchService} from '../../services/match';
import {Match} from '../../models/match';
import {Observable} from "rxjs/Observable";
import {UserPrivate} from "../../models/user_private";
import {UserPrivateService} from "../../services/user_private";
import {ViewProposedMeetRequestPage} from "../view_proposed_meet_request/view_proposed_meet_request";
import {ViewOneAcceptedMatchPage} from "../view_one_accepted_match/view_one_accepted_match";
import {MeetRequest} from "../../models/meet_request";

@Page({
  templateUrl: 'build/pages/match_list/match_list.html',
})
/**
 * List of user's matches
 */
export class MatchListPage {
    public matches:Observable<Array<Match>>;
    public user:UserPrivate;
    
    constructor(
        private matchService: MatchService,
        private nav: NavController,
        private userService: UserPrivateService
    ) { 
        this.matches = matchService.matches;
        matchService.fetchMatches(true);
        this.user = userService.cached_user;
    }

    viewOneAcceptedMatch(match:Match) {
        this.nav.push(ViewOneAcceptedMatchPage, {
            match: match
        })
    }

    viewProposedMeetRequest(match:Match, meet_request:MeetRequest) {
        this.nav.push(ViewProposedMeetRequestPage, {
            match: match,
            meet_request: meet_request
        })
    }

    refresh(refresher) {
        this.matchService.fetchMatches(true);
        refresher.complete();
    }
}
