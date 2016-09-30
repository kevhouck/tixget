import {Injectable} from 'angular2/core'
import {BuyRequest} from '../models/buy_request'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';

@Injectable()
export class BuyRequestService {
    private cached_buy_requests:Array<BuyRequest>
    
    public buy_requests:Observable<Array<BuyRequest>>;
    private buy_requests_observer:Observer<Array<BuyRequest>>;
    
    private internal_buy_requests:Observable<Array<BuyRequest>>;
    private internal_buy_requests_observer:Observer<Array<BuyRequest>>;
    
    public buy_request:Observable<BuyRequest>;
    private buy_request_observer:Observer<BuyRequest>;
    
    constructor(private http:HttpService) {
        this.cached_buy_requests = new Array<BuyRequest>()
        
        this.buy_requests = new Observable(observer =>
            this.buy_requests_observer = observer);
            
        this.internal_buy_requests = new Observable(observer =>
            this.internal_buy_requests_observer = observer);
            
        this.buy_request = new Observable(observer =>
            this.buy_request_observer = observer);
            
        this.internal_buy_requests.subscribe(buy_requests => {
            this.cached_buy_requests = buy_requests;
            this.buy_requests_observer.next(buy_requests)
        })
    }
    
    fetchBuyRequests(shouldHitServer:boolean) {
        if (shouldHitServer) {
            this.http.get('/buy_request')
            .map(res => res.json())
            .subscribe(json => {
                var temp_buy_reqs:Array<BuyRequest> = new Array<BuyRequest>();
                for (var i = 0; i < json.length; i++) {
                    temp_buy_reqs.push(BuyRequest.fromJSON(json[i]))
                }
                this.buy_requests_observer.next(temp_buy_reqs)
            }, err => console.log(err))          
        } else {
            this.buy_requests_observer.next(this.cached_buy_requests)
        }
    }
    
    fetchBuyRequest(buy_request_id) {
        this.http.get('/buy_request/' + buy_request_id)
        .map(res => res.json())
        .subscribe(json => {
            this.buy_request_observer.next(BuyRequest.fromJSON(json))
        })
    }
    
    submitBuyRequest(event_id:number, price_exact:number,
        loc_long:number, loc_lat:number, loc_range:number) {

        this.http.post('/buy_request', {
            event_id: event_id,
            price_exact: price_exact, 
            loc_long: loc_long, 
            loc_lat: loc_lat,
            loc_range: loc_range
        })
        .map(res => res.json())
        .subscribe(json => {
            this.buy_request_observer.next(BuyRequest.fromJSON(json))
        }, err => console.log(err))
    }
}