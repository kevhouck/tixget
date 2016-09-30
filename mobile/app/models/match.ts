import {MeetRequest} from './meet_request'
import {SellRequest} from './sell_request'
import {BuyRequest} from './buy_request'
import {UserPublic} from './user_public'
import {Event} from './event'


export class Match {
    
    public id:number;
    public sell_request:SellRequest;
    public buy_request:BuyRequest;
    public event:Event;
    public seller:UserPublic;
    public buyer:UserPublic;
    public buyer_state:string;
    public seller_state:string;
    public meet_requests:Array<MeetRequest>;
    public state:string;
    
    constructor() {}
    
    public static fromJSON(jsonObj): Match {
        var match:Match = new Match();
        match.id = jsonObj.id;
        match.sell_request = SellRequest.fromJSON(jsonObj.sell_request);
        match.buy_request = BuyRequest.fromJSON(jsonObj.buy_request);
        match.seller = UserPublic.fromJSON(jsonObj.seller);
        match.buyer = UserPublic.fromJSON(jsonObj.buyer);
        match.event = Event.fromJSON(jsonObj.event);
        match.buyer_state = jsonObj.buyer_state;
        match.seller_state = jsonObj.seller_state;
        match.state = jsonObj.state;
        match.meet_requests = new Array<MeetRequest>();
        var mr_list = jsonObj.meet_requests;
        if (mr_list != null) {
            for (var i = 0; i < mr_list.length; i++) {
                match.meet_requests.push(MeetRequest.fromJSON(mr_list[i]));
            }
        }
        return match;
    }
}