import {HttpService} from './http_service'
import {Injectable} from 'angular2/core'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import {UserPrivateService} from './user_private'
import {UserPrivate} from '../models/user_private'
import 'rxjs/add/operator/map';


@Injectable()
export class AuthService {
    public login_flag: Observable<Boolean>;
    private login_observer: Observer<Boolean>;
    
    
    constructor(private http: HttpService, private userPrivateService: UserPrivateService) {
        this.login_flag = new Observable(observer => 
            this.login_observer = observer)
    }
    
    
    public login(fb_email:string, fb_password) {
        // get facebook token
        var temp_fb_token = "ASDFAdfsaf";
        if (fb_email != null) {
            temp_fb_token = fb_email;
        }
        var body = {"temp_access_token": temp_fb_token};

        // first is not working so this is second best
        var already_sent = false;
        this.userPrivateService.user.subscribe(user => {
            console.log(user);
            if(!already_sent) {
                this.login_observer.next(true);
                already_sent = true;
            }
        });
        console.log('hitting server for user');
        this.http.post('/login', body)
        .map(res => res.json())
        .subscribe(json => {
            this.http.setAccessToken(json['access_token']);
            this.userPrivateService.fetchPrivateUser(parseInt(json['user_id']))
        }, err => console.log(err))
    }
    
    public logout() {
        
    }
}