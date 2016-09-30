import {Http, Headers} from 'angular2/http';
import {Injectable} from 'angular2/core'

@Injectable()
export class HttpService {
    private access_token:string;
    
    constructor(private http: Http) {
        this.access_token = null
    }
    
    public setAccessToken(access_token:string) {
        this.access_token = access_token
    }
    
    public getAccessToken():string {
        return this.access_token
    }
    
    private appendAccessToken(headers:Headers) {
        if (this.access_token == null) {
            return
        }
        headers.append('Access-Token', this.access_token);
        return
    }

    get(uri) {
        let headers = new Headers();
        var url:string = 'http://localhost:5000' + uri;
        headers.append('Content-Type','application/json');
        this.appendAccessToken(headers);
        
        return this.http.get(url, {headers: headers});
    }

    post(uri, body) {
        let headers = new Headers();
        var url:string = 'http://localhost:5000' + uri;
        headers.append('Content-Type','application/json');
        this.appendAccessToken(headers);
        
        return this.http.post(url, JSON.stringify(body), {headers:headers})
    }
    
    put(uri, body) {
        let headers = new Headers();
        var url:string = 'http://localhost:5000' + uri;
        headers.append('Content-Type','application/json');
        this.appendAccessToken(headers);
        
        return this.http.put(url, JSON.stringify(body), {headers:headers})
    }
}