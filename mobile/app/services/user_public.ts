import {Injectable} from 'angular2/core'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';
import {UserPublic} from '../models/user_public'

@Injectable()
export class UserPublicService {
    public user:Observable<UserPublic>;
    private user_observer:Observer<UserPublic>;
    
    constructor(private http:HttpService) {
        this.user = new Observable(observer => 
            this.user_observer = observer)
    }
    
    rateBuyer(user_id:number, buyer_rating:number) {
        this.http.post('/user/' + user_id, {
            buyer_rating: buyer_rating
        })
        .map(res => res.json())
        .subscribe(json => {
            
        }, err => console.log(err))
    }
    
    rateSeller(user_id:number, seller_rating:number) {
        this.http.post('/user/' + user_id + '/rate', {
            seller_rating: seller_rating
        })
        .map(res => res.json())
        .subscribe(json => {
            
        }, err => console.log(err))
    }
    
}