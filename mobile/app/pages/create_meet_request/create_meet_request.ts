declare var google:any;

import {Page, NavController, NavParams} from 'ionic-angular';
import {MatchService} from '../../services/match'
import {Match} from '../../models/match'
import {MeetRequest} from '../../models/meet_request'
import {Geolocation} from 'ionic-native';
import {SentMeetRequestPage} from "../sent_meet_request/sent_meet_request";


@Page({
  templateUrl: 'build/pages/create_meet_request/create_meet_request.html',
})
/**
 * Page where user can create a meet request
 */
export class CreateMeetRequestPage {
    private match:Match;
    private old_meet_request:MeetRequest;
    public loc_long:number;
    public loc_lat:number;
    public time:string;
    public map:any;
    public marker:any;

    constructor(
        private matchService: MatchService,
        private nav: NavController,
        private navParams: NavParams
    ) {
        this.match = navParams.get('match');
        this.old_meet_request = navParams.get('old_meet_request');

        if (this.old_meet_request != null) {
            this.loc_long = this.old_meet_request.loc_long;
            this.loc_lat = this.old_meet_request.loc_lat;
            this.time = this.old_meet_request.time.toISOString().slice(0,16);
        } else {
            this.loc_lat = 43.0763356;
            this.loc_long = -89.4004324;
            this.time = new Date().toISOString().slice(0,16);

            Geolocation.getCurrentPosition().then((resp) => {
                this.loc_lat = resp.coords.latitude;
                this.loc_long = resp.coords.longitude;
            });
        }

        this.map = null;
    }

    ngAfterViewInit() {
        this.loadMap();
    }

    loadMap() {
        // google will work still even though it cant find it
        let latLng = new google.maps.LatLng(this.loc_lat, this.loc_long);

        let mapOptions = {
            center: latLng,
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });
        
        google.maps.event.addListener(this.map, 'click', (event) => {
            this.placeMarker(event.latLng);
        });
        
    }

    placeMarker(location:any) {
        this.marker.setPosition(location)
    }
    
    submit() {
        // if this is the first time were submitting a meet_request
        // then we're accepting a match
        var time_in_utc  = new Date(this.time);
        var now = new Date();
        var millis = time_in_utc.getTime() + (now.getTimezoneOffset() * 60000);
        var time_with_offset = new Date(millis);

        if (this.old_meet_request == null) {
            this.matchService.match.subscribe(match => {
                this.nav.push(SentMeetRequestPage)
            });


            this.matchService.acceptOneAcceptedMatch(this.match, this.marker.getPosition().lng(), this.marker.getPosition().lat(), time_with_offset);
        
        // otherwise we're rejecting an old meet request
        } else {
            this.matchService.rejectMeetRequest(this.match, this.old_meet_request.id, this.loc_long, this.loc_lat, time_with_offset)
        }
    }
}
