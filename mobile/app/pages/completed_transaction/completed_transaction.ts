import {Page, NavController} from 'ionic-angular';
import {Transaction} from "../../models/transaction";
import {TransactionService} from "../../services/transaction";


@Page({
  templateUrl: 'build/pages/completed_transaction/completed_transaction.html',
})
/**
 * Shown to user after they complete a transaction
 */
export class CompletedTransactionPage {
    
    constructor(
        private nav: NavController,
        private transactionService: TransactionService
    ) {
        
    }
    
    okay() {
        this.transactionService.fetchTransactions(true);
        this.nav.popToRoot();
    }
}
