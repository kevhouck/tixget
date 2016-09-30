export class Event {
    
    public id:number;
    public name:string;
    public loc_description:string;
    public loc_long:number;
    public loc_lat:number;
    public description:string;
    public time:Date;
    public category:string;
    public subcategory:string;
    
    constructor() {}
    
    public static fromJSON(jsonObj): Event {
        var event = new Event();
        event.id = jsonObj.id;
        event.name = jsonObj.name;
        event.loc_description = jsonObj.loc_description;
        event.loc_long = jsonObj.loc_long;
        event.loc_lat = jsonObj.loc_lat;
        event.description = jsonObj.description;
        event.time = new Date(jsonObj.time);
        event.category = jsonObj.category;
        event.subcategory = jsonObj.subcategory;
        return event
    }
}