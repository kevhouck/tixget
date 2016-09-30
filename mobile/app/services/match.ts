import {Injectable} from 'angular2/core'
import {Match} from '../models/match'
import {MeetRequest} from '../models/meet_request'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';

@Injectable()
export class MatchService {
    private cached_matches:Array<Match>
    
    private internal_matches:Observable<Array<Match>>;
    private internal_matches_observer:Observer<Array<Match>>;
    
    public matches:Observable<Array<Match>>;
    private matches_observer:Observer<Array<Match>>;
    
    public match:Observable<Match>;
    private match_observer:Observer<Match>;
    
    public meet_requests:Observable<Array<MeetRequest>>;
    private meet_requests_observer:Observer<Array<MeetRequest>>;
    
    public meet_request:Observable<MeetRequest>;
    private meet_request_observer:Observer<MeetRequest>;
    
    constructor(private http:HttpService) {
        this.cached_matches = new Array<Match>()
        
        this.matches = new Observable(observer =>
            this.matches_observer = observer)
            
        this.internal_matches = new Observable(observer =>
            this.internal_matches_observer = observer)
            
        this.match = new Observable(observer =>
            this.match_observer = observer)
            
        this.meet_requests = new Observable(observer =>
            this.meet_requests_observer = observer)
            
        this.meet_request = new Observable(observer =>
            this.meet_request_observer = observer)
            
        this.internal_matches.subscribe(matches  => {
            this.cached_matches = matches
            this.matches_observer.next(matches)
        })
    }
    
    fetchMatches(shouldHitServer:boolean) {
        if(shouldHitServer) {
            this.http.get('/match')
            .map(res => res.json())
            .subscribe(json => {
                var temp_matches:Array<Match> = new Array<Match>()
                for (var i = 0; i < json.length; i++) {
                    temp_matches.push(Match.fromJSON(json[i]))
                }
                console.log(temp_matches)
                this.internal_matches_observer.next(temp_matches)
            }, err => console.log(err))
        } else {
            this.matches_observer.next(this.cached_matches)
        }
    }
    
    fetchMatch(match_id:number) {
        this.http.get('/match/' + match_id)
        .map(res => res.json())
        .subscribe(json => {
            this.match_observer.next(Match.fromJSON(json))
        }, err => console.log(err))
    }
    
    fetchMatchByBuyRequest(buy_request_id:number) {
        this.http.get('/match?buy_request_id=' + buy_request_id)
        .map(res => res.json())
        .subscribe(json => {
            this.match_observer.next(Match.fromJSON(json))
        }, err => console.log(err))
    }
    
    fetchMatchBySellRequest(sell_request_id:number) {
        this.http.get('/match?sell_request_id=' + sell_request_id)
        .map(res => res.json())
        .subscribe(json => {
            this.match_observer.next(Match.fromJSON(json))
        }, err => console.log(err))
    }
    
    acceptProposedMatch(match:Match) {
        this.http.post('/match/' + match.id + '/accept', {})
        .map(res => res.json())
        .subscribe(json => {
            this.match_observer.next(Match.fromJSON(json))
        }, err => console.log(err))
    }
    
    acceptOneAcceptedMatch(match:Match, loc_long:number, loc_lat:number, time:Date) {
        this.http.post('/match/' + match.id + '/accept', {
            loc_long: loc_long,
            loc_lat: loc_lat,
            time: time.toUTCString(),
        })
        .map(res => res.json())
        .subscribe(json => {
            this.match_observer.next(Match.fromJSON(json))
        }, err => console.log(err))
    }

    rejectMatch(match:Match) {
         this.http.post('/match/' + match.id + '/reject', {})
        .map(res => res.json())
        .subscribe(json => {
            this.match_observer.next(Match.fromJSON(json))
        }, err => console.log(err))
    }
    
    /**
    fetchMeetRequests(match_id:number) {
        this.http.get('/match/' + match_id + '/meet_request')
        .map(res => res.json())
        .subscribe(json => {
            var temp_meet_reqs:Array<MeetRequest> = new Array<MeetRequest>()
            for (var i = 0; i < json.length; i++) {
                temp_meet_reqs.push(MeetRequest.fromJSON(json[i]))
            }
            this.meet_requests_observer.next(temp_meet_reqs)
        }, err => console.log(err))
    } */
    
    fetchMeetRequest(match_id:number, meet_request_id:number) {
        this.http.get('/match/' + match_id + '/meet_request/'+ meet_request_id)
        .map(res => res.json())
        .subscribe(json => {
            this.meet_request_observer.next(MeetRequest.fromJSON(json))
        }, err => console.log(err))
    }
    
    acceptMeetRequest(match_id:number, meet_request_id:number) {
        this.http.post('/match/' + match_id + '/meet_request/'+ meet_request_id + '/accept', {})
        .map(res => res.json())
        .subscribe(json => {
            this.meet_request_observer.next(MeetRequest.fromJSON(json))
        }, err => console.log(err))
    }

    rejectMeetRequest(match:Match, old_meet_req_id:number, loc_long:number, loc_lat:number, time:Date) {
        this.http.post('/match/' + match.id + '/meet_request/'+ old_meet_req_id + '/reject', {
            loc_long: loc_long,
            loc_lat: loc_lat,
            time: time.toUTCString(),
        })
        .map(res => res.json())
        .subscribe(json => {
            this.meet_request_observer.next(MeetRequest.fromJSON(json))
        }, err => console.log(err))
    }
}