declare var google:any;

import {Page, NavController, NavParams} from 'ionic-angular';
import {MatchService} from '../../services/match'
import {MeetRequest} from '../../models/meet_request'
import {CreateMeetRequestPage} from '../create_meet_request/create_meet_request'
import {AcceptedMeetRequestPage} from '../accepted_meet_request/accepted_meet_request'
import {Match} from "../../models/match";


@Page({
  templateUrl: 'build/pages/view_proposed_meet_request/view_proposed_meet_request.html',
})
export class ViewProposedMeetRequestPage {
    public meet_request:MeetRequest;
    public match:Match;
    public map:any;
    public marker:any;
    public time:Date;
    public loc_long:number;
    public loc_lat:number;


    constructor(
        private matchService: MatchService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.meet_request = this.navParams.get('meet_request');
        this.match = this.navParams.get('match');
        this.time = this.meet_request.time;
        this.loc_long = this.meet_request.loc_long;
        this.loc_lat = this.meet_request.loc_lat;

        this.map = null;
        this.marker = null;
    }

    ngAfterViewInit() {
        this.loadMap()
    }

    loadMap() {
        // google will work still even though it cant find it
        let latLng = new google.maps.LatLng(this.loc_lat, this.loc_long);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById("map2"), mapOptions);

        this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });
    }
    
    accept() {
        this.matchService.meet_request.subscribe(meet_req => {
            this.nav.push(AcceptedMeetRequestPage)
        });

        this.matchService.acceptMeetRequest(this.match.id, this.meet_request.id);
    }
    
    reject() {
        // must create a meet request to cancel received meet request
        this.nav.push(CreateMeetRequestPage, {
            match: this.match,
            old_meet_request: this.meet_request
        } )
    }
}
