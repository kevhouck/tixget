declare var google:any;

import {Transaction} from "../../models/transaction";
import {Page, NavController, NavParams} from 'ionic-angular';


@Page({
    templateUrl: 'build/pages/view_transaction_meeting_details/view_transaction_meeting_details.html',
})
export class ViewTransactionMeetingDetailsPage {
    public transaction:Transaction;
    public map:any;
    public marker:any;
    public time:Date;
    public loc_long:number;
    public loc_lat:number;


    constructor(
        private nav:NavController,
        private navParams:NavParams
    ) {
        
        this.transaction = this.navParams.get('transaction');
        this.time = this.transaction.time;
        this.loc_long = this.transaction.loc_long;
        this.loc_lat = this.transaction.loc_lat;

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

        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

        this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: this.map.getCenter()
        });
    }

}