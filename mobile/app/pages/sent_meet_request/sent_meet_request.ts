import {Page, NavController, NavParams} from 'ionic-angular';
import {MatchService} from "../../services/match";


@Page({
    templateUrl: 'build/pages/sent_meet_request/sent_meet_request.html',
})
/**
 * Shown after user sends a meet request
 */
export class SentMeetRequestPage {
    constructor(
        private nav: NavController,
        private matchService: MatchService
    ) {}
    
    okay() {
        this.matchService.fetchMatches(true);
        this.nav.popToRoot();
    }
}