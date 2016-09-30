import {UserPublic} from './user_public'

export class MeetRequest {
    
    public id:number;
    public match_id:number;
    public num_in_match:number;
    public proposed_user:UserPublic;
    public awaiting_user:UserPublic;
    public awaiting_user_state:string;
    public loc_long:number;
    public loc_lat:number;
    public time:Date;
        
    constructor() {}
    
    public static fromJSON(jsonObj): MeetRequest {
        var meet_request:MeetRequest = new MeetRequest();
        meet_request.id = jsonObj.id;
        meet_request.match_id = jsonObj.match_id;
        meet_request.num_in_match = jsonObj.num_in_match;
        meet_request.awaiting_user = UserPublic.fromJSON(jsonObj.awaiting_user);
        meet_request.awaiting_user_state = jsonObj.awaiting_user_state;
        meet_request.proposed_user = UserPublic.fromJSON(jsonObj.proposed_user);
        meet_request.loc_long = jsonObj.loc_long;
        meet_request.loc_lat = jsonObj.loc_lat;
        meet_request.time = new Date(jsonObj.time);
        return meet_request;
    }
}