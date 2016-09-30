import {Event} from './event'
import {UserPublic} from './user_public'

export class SellRequest {
    
    public id:number;
    public event:Event;
    public submitted_by_user:UserPublic;
    public price_min:number;
    public loc_long:number;
    public loc_lat:number;
    public loc_range:number;
    public state:string;
        
    constructor() {}
    
        public static fromJSON(jsonObj): SellRequest {
        var sell_request = new SellRequest();
        sell_request.id = jsonObj.id;
        sell_request.event = Event.fromJSON(jsonObj.event);
        sell_request.submitted_by_user = UserPublic.fromJSON(jsonObj.submitted_by_user);
        sell_request.price_min = jsonObj.price_min;
        sell_request.loc_long = jsonObj.loc_long;
        sell_request.loc_lat = jsonObj.loc_lat;
        sell_request.state = jsonObj.state;
        return sell_request
    }
}