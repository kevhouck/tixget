import {Page, NavController, NavParams} from 'ionic-angular';
import {Transaction} from '../../models/transaction';
import {TransactionService} from '../../services/transaction';
import {Observable} from "rxjs/Observable";

@Page({
  templateUrl: 'build/pages/confirm_transaction_buyer/confirm_transaction_buyer.html',
})
/**
 * Displays the transaction secret
 */
export class ConfirmTransactionBuyerPage {
    transaction:Transaction;
    secret:Observable<string>;
    
        constructor(
        private transactionService: TransactionService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.transaction = this.navParams.get('transaction');
        
        this.secret = transactionService.transaction_secret;
        transactionService.fetchTransactionSecret(this.transaction.id)
    }

    done() {
        this.transactionService.fetchTransactions(true);
        this.nav.popToRoot();
    }
}
