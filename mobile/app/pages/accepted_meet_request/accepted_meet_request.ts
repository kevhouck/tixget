import {Page, NavController} from 'ionic-angular';
import {TransactionService} from "../../services/transaction";
import {MatchService} from "../../services/match";


@Page({
  templateUrl: 'build/pages/accepted_meet_request/accepted_meet_request.html',
})
/**
 * Shown after a user accetps a meet request
 */
export class AcceptedMeetRequestPage {

    constructor(
        private nav: NavController,
        private transactionService: TransactionService,
        private matchService: MatchService
    ) {

    }

    okay() {
        this.matchService.fetchMatches(true);
        this.transactionService.fetchTransactions(true);
        this.nav.popToRoot();
    }
}
