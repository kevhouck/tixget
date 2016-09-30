import {Injectable} from 'angular2/core'
import {Transaction} from '../models/transaction'
import {Message} from '../models/message'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';

@Injectable()
export class TransactionService {
    private cached_transactions:Array<Transaction>
    
    public transactions:Observable<Array<Transaction>>;
    private transactions_observer:Observer<Array<Transaction>>;
    
    private internal_transactions:Observable<Array<Transaction>>;
    private internal_transactions_observer:Observer<Array<Transaction>>;
    
    public transaction:Observable<Transaction>;
    private transaction_observer:Observer<Transaction>;
    
    public transaction_secret:Observable<string>;
    public transaction_secret_observer:Observer<string>;
    
    public messages:Observable<Array<Message>>;
    private messages_observer:Observer<Array<Message>>;
    
    constructor(private http:HttpService) {
        this.cached_transactions = new Array<Transaction>()
        
        this.transactions = new Observable(observer =>
            this.transactions_observer = observer)
            
        this.internal_transactions = new Observable(observer =>
            this.internal_transactions_observer = observer)
            
        this.transaction = new Observable(observer =>
            this.transaction_observer = observer)
            
        this.transaction_secret = new Observable(observer =>
            this.transaction_secret_observer = observer)
            
        this.messages = new Observable(observer =>
            this.messages_observer = observer)
            
        this.internal_transactions.subscribe(transactions => {
            this.cached_transactions = transactions
            this.transactions_observer.next(transactions)
        })
    }
    
    fetchTransactions(shouldHitServer) {
        if (shouldHitServer) {
            this.http.get('/transaction')
            .map(res => res.json())
            .subscribe(json => {
                var temp_transactions:Array<Transaction> = new Array<Transaction>()
                for (var i = 0; i < json.length; i++) {
                    temp_transactions.push(Transaction.fromJSON(json[i]))
                }
                this.transactions_observer.next(temp_transactions)
            }, err => console.log(err))  
        } else {
            this.transactions_observer.next(this.cached_transactions)
        }
    }
    
    fetchTransaction(transaction_id:number) {
        this.http.get('/transaction/' + transaction_id)
        .map(res => res.json())
        .subscribe(json => {
            this.transaction_observer.next(Transaction.fromJSON(json))
        }, err => console.log(err))
    }
    
    confirmTransaction(transaction_id:number, transaction_secret:string) {
        this.http.post('/transaction/' + transaction_id + '/confirm', {
            secret: transaction_secret
        })
        .map(res => res.json())
        .subscribe(json => {
            this.transaction_observer.next(Transaction.fromJSON(json))
        }, err => console.log(err))
    }

    fetchTransactionSecret(transaction_id:number) {
        this.http.get('/transaction/' + transaction_id + '/secret')
        .map(res => res.json())
        .subscribe(json => {
            this.transaction_secret_observer.next(json.secret)
        }, err => console.log(err))
    }
    
    fetchTransactionMessages(transaction_id:number) {
        this.http.get('/transaction/' + transaction_id + '/message')
        .map(res => res.json())
        .subscribe(json => {
            var temp_messages:Array<Message> = new Array<Message>()
            for (var i = 0; i < json.length; i++) {
                temp_messages.push(Message.fromJSON(json[i]))
            }
            this.messages_observer.next(temp_messages)
        }, err => console.log(err))
    }
}