import {UserPublic} from './user_public'

export class Message {
    
    public id:number;
    public to_user:UserPublic;
    public from_user:UserPublic;
    public content:string;
        
    constructor() {}
   
    public static fromJSON(jsonObj): Message {
        var message:Message = new Message();
        message.id = jsonObj.id;
        message.to_user = UserPublic.fromJSON(jsonObj.to_user);
        message.from_user = UserPublic.fromJSON(jsonObj.from_user);
        message.content = jsonObj.content;
        return message
    }
}