import {Injectable} from 'angular2/core'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';
import {UserPrivate} from '../models/user_private'

@Injectable()
export class UserPrivateService {
    public cached_user:UserPrivate;
    public user:Observable<UserPrivate>;
    private user_observer:Observer<UserPrivate>;
    
    constructor(private http:HttpService) {
        this.user = new Observable(observer => 
            this.user_observer = observer)
    }
    
    fetchPrivateUser(user_id:number) {
        this.http.get('/user/' + user_id)
        .map(res => res.json())
        .subscribe(json => {
            console.log('received user');
            var user = UserPrivate.fromJSON(json);
            this.cached_user = user;
            this.user_observer.next(user)
        }, err => console.log(err))
    }
    
    getLoggedInPrivateUser() {
        this.user_observer.next(this.cached_user)
    }
    
    updatePrivateUser(user:UserPrivate) {
        this.http.put('/user/' + user.id + '/rate', JSON.stringify(user))
        .map(res => res.json())
        .subscribe(json => {
            this.user_observer.next(UserPrivate.fromJSON(json))
        }, err => console.log(err))        
    }
    
}