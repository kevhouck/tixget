import {Page, NavController} from 'ionic-angular';
import {TransactionService} from '../../services/transaction';
import {Transaction} from '../../models/transaction';
import {Observable} from "rxjs/Observable";
import {UserPrivate} from "../../models/user_private";
import {UserPrivateService} from "../../services/user_private";
import {ConfirmTransactionBuyerPage} from "../confirm_transaction_buyer/confirm_transaction_buyer";
import {ConfirmTransactionSellerPage} from "../confirm_transaction_seller/confirm_transaction_seller";
import {ViewTransactionMeetingDetailsPage} from "../view_transaction_meeting_details/view_transaction_meeting_details";

@Page({
  templateUrl: 'build/pages/transaction_list/transaction_list.html'
})
/** 
 * List of user's transactions 
 */
export class TransactionListPage {
    transactions:Observable<Array<Transaction>>;
    user:UserPrivate;
    
    constructor(
        private transactionService: TransactionService,
        private nav: NavController,
        private userService: UserPrivateService
    ) {
        this.transactions = transactionService.transactions;
        transactionService.fetchTransactions(true);
        this.user = userService.cached_user;
    }

    refresh(refresher) {
        this.transactionService.fetchTransactions(true);
        refresher.complete();
    }

    confirm(transaction:Transaction) {
        if(transaction.buyer_user.id == this.user.id) {
            // show buyer page
            this.nav.push(ConfirmTransactionBuyerPage, {
                transaction: transaction
            })

        } else {
            //show seller page
            this.nav.push(ConfirmTransactionSellerPage, {
                transaction: transaction
            })
        }
    }

    viewMeetingDetails(transaction) {
        this.nav.push(ViewTransactionMeetingDetailsPage, {
            transaction: transaction
        })
    }
}
