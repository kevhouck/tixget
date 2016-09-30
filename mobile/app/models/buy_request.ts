import {Event} from './event'
import {UserPublic} from './user_public'


export class BuyRequest {
    
    public id:number;
    public event:Event;
    public submitted_by_user:UserPublic;
    public price_exact:number;
    public loc_long:number;
    public loc_lat:number;
    public loc_range:number;
    public state:string;
    
    constructor() {}
    
    public static fromJSON(jsonObj): BuyRequest {
        var buy_request = new BuyRequest();
        buy_request.id = jsonObj.id;
        buy_request.event = Event.fromJSON(jsonObj.event);
        buy_request.submitted_by_user = UserPublic.fromJSON(jsonObj.submitted_by_user);
        buy_request.price_exact = jsonObj.price_exact;
        buy_request.loc_long = jsonObj.loc_long;
        buy_request.loc_lat = jsonObj.loc_lat;
        buy_request.state = jsonObj.state;
        return buy_request;
    }
}