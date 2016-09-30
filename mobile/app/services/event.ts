import {Injectable} from 'angular2/core'
import {Event} from '../models/event'
import {HttpService} from './http_service'
import {Observable} from 'rxjs/Observable'
import {Observer} from 'rxjs/Observer'
import 'rxjs/add/operator/map';


@Injectable()
export class EventService {
    private cached_browse_events:Array<Event>;
    
    private internal_browse_events:Observable<Array<Event>>;
    private internal_browse_events_observer:Observer<Array<Event>>;
    
    public browse_events:Observable<Array<Event>>;
    private browse_events_observer:Observer<Array<Event>>;
    
    public requested_event:Observable<Event>;
    private requested_event_observer:Observer<Event>;
    
    constructor(private http: HttpService) {
        this.cached_browse_events = new Array<Event>()
        
        this.browse_events = new Observable(observer =>
            this.browse_events_observer = observer)
            
        this.internal_browse_events = new Observable(observer =>
            this.internal_browse_events_observer = observer)
            
        this.requested_event = new Observable(observer =>
            this.requested_event_observer = observer)
            
        this.internal_browse_events.subscribe(events => {
            this.cached_browse_events = events
            this.browse_events_observer.next(events)
        })
    }

    public fetchBrowseEvents(shouldHitServer:boolean) {
        if(shouldHitServer) {
            this.http.get('/event')
            .map(res => res.json())
            .subscribe(json => {
                var temp_events_arr:Array<Event> = new Array<Event>()
                for (var i = 0; i < json.length; i++) {
                    temp_events_arr.push(Event.fromJSON(json[i]))
                }
                this.internal_browse_events_observer.next(temp_events_arr)
            }, err => console.log(err))          
        } else {
            this.browse_events_observer.next(this.cached_browse_events)
        }

    }

    public fetchEvent(event_id:number) {
        this.http.get('/event/' + event_id)
        .map(res => res.json())
        .subscribe(json => {
            this.requested_event_observer.next(Event.fromJSON(json))
        }, err => console.log(err))
    }
}