import {Injectable} from 'angular2/core'
import {SellRequest} from '../models/sell_request'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';

@Injectable()
export class SellRequestService {
    private cached_sell_requests:Array<SellRequest>;
    
    public sell_requests:Observable<Array<SellRequest>>;
    private sell_requests_observer:Observer<Array<SellRequest>>;
    
    private internal_sell_requests:Observable<Array<SellRequest>>;
    private internal_sell_requests_observer:Observer<Array<SellRequest>>;
    
    public sell_request:Observable<SellRequest>;
    private sell_request_observer:Observer<SellRequest>;
    
    constructor(private http:HttpService) {
        this.cached_sell_requests = new Array<SellRequest>();
        
        this.sell_requests = new Observable(observer =>
            this.sell_requests_observer = observer);
            
        this.internal_sell_requests = new Observable(observer =>
            this.internal_sell_requests_observer = observer);
            
        this.sell_request = new Observable(observer =>
            this.sell_request_observer = observer);
            
        this.internal_sell_requests.subscribe(sell_requests => {
            this.cached_sell_requests = sell_requests;
            this.sell_requests_observer.next(sell_requests)
        })
    }

    fetchSellRequests(shouldHitServer:boolean) {
        if (shouldHitServer) {
            this.http.get('/sell_request')
            .map(res => res.json())
            .subscribe(json => {
                var temp_sell_reqs:Array<SellRequest> = new Array<SellRequest>()
                for (var i = 0; i < json.length; i++) {
                    temp_sell_reqs.push(SellRequest.fromJSON(json[i]))
                }
                this.internal_sell_requests_observer.next(temp_sell_reqs)
            }, err => console.log(err))
        } else {
            this.sell_requests_observer.next(this.cached_sell_requests)
        }
    }
    
    fetchSellRequest(sell_request_id) {
        this.http.get('/sell_request/' + sell_request_id)
        .map(res => res.json())
        .subscribe(json => {
            this.sell_request_observer.next(SellRequest.fromJSON(json))
        })
    }
    
    submitSellRequest(event_id:number, price_min:number,
        loc_long:number, loc_lat:number, loc_range:number) {
        
        this.http.post('/sell_request', {
            event_id: event_id,
            price_min: price_min,
            loc_long: loc_long, 
            loc_lat: loc_lat,
            loc_range: loc_range
        })
        .map(res => res.json())
        .subscribe(json => {
            this.sell_request_observer.next(SellRequest.fromJSON(json))
        }, err => console.log(err))
    }
}