import {Page, NavController} from 'ionic-angular';
import {Event} from '../../models/event'
import {EventService} from '../../services/event';
import {AuthService} from '../../services/auth'
import {CreateBuyRequestPage} from '../create_buy_request/create_buy_request'
import {CreateSellRequestPage} from '../create_sell_request/create_sell_request'
import {Observable} from "rxjs/Observable";

@Page({
  templateUrl: 'build/pages/browse_event_list/browse_event_list.html',
})
/**
 * List of events
 */
export class BrowseEventListPage {
    events:Observable<Array<Event>>;
    
    constructor(
        private eventService: EventService, 
        private authService: AuthService, 
        private nav: NavController
        ) {
 
        this.events = this.eventService.browse_events;
        eventService.fetchBrowseEvents(true)

    }
    
    public createBuyRequestOnEvent(event:Event) {
        this.nav.push(CreateBuyRequestPage, {
            event: event
        })
    }
    
    public createSellRequestOnEvent(event:Event) {
        this.nav.push(CreateSellRequestPage, {
            event: event
        })
    }

    refresh(refresher) {
        this.eventService.fetchBrowseEvents(true);
        refresher.complete();
    }
}
