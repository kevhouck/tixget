import {Page, NavController, NavParams} from 'ionic-angular';
import {Transaction} from '../../models/transaction';
import {TransactionService} from '../../services/transaction';
import {CompletedTransactionPage} from '../completed_transaction/completed_transaction'

@Page({
  templateUrl: 'build/pages/confirm_transaction_seller/confirm_transaction_seller.html',
})
/**
 * Used by seller to enter the transaction secret shown on the buyers screen
 */
export class ConfirmTransactionSellerPage {
    transaction:Transaction;
    entered_secret: string;
    alert:string;
    
        constructor(
        private transactionService: TransactionService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.transaction = this.navParams.get('transaction');
        this.entered_secret = "";
    }
    
    submitSecret() {
        this.transactionService.transaction.subscribe(transaction => {
            if (transaction.state == 'COMPLETED') {
                this.nav.push(CompletedTransactionPage)
            } else {
                this.alert = "secret not correct please try again"
            }
        });
        this.transactionService.confirmTransaction(this.transaction.id, this.entered_secret) 
    }
}
