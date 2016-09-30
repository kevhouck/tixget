export class Notification {
    public id:number;
    public type:string;
    public match_id:number;
    public meet_request_id:number;
    public transaction_id:number;

    constructor() {}
    
    public static fromJSON(jsonObj):Notification {
        var notification = new Notification()
        notification.id = jsonObj.id
        notification.type = jsonObj.type
        notification.match_id = jsonObj.match_id
        notification.meet_request_id = jsonObj.meet_request_id
        notification.transaction_id = jsonObj.transaction_id
        return notification
    }
}