import {Message} from './message'
import {Match} from './match'
import {UserPublic} from './user_public'


export class Transaction {
    
    public id:number;
    public seller_user:UserPublic;
    public buyer_user:UserPublic;
    public match:Match;
    public loc_long:number;
    public loc_lat:number;
    public time:Date;
    public state:string;
    public transaction_secret_id:string;
    public messages:Array<Message>;
    
    constructor() {}

    public static fromJSON(jsonObj): Transaction {
        var transaction:Transaction = new Transaction();
        transaction.id = jsonObj.id;
        transaction.seller_user = UserPublic.fromJSON(jsonObj.seller_user);
        transaction.buyer_user = UserPublic.fromJSON(jsonObj.buyer_user);
        transaction.match = Match.fromJSON(jsonObj.match);
        transaction.state = jsonObj.state;
        transaction.loc_long = jsonObj.loc_long;
        transaction.loc_lat = jsonObj.loc_lat;
        transaction.time = new Date(jsonObj.time);

        var m_list = jsonObj.messages;
        if (m_list != null) {
            for (var i = 0; i < m_list; i++) {
                transaction.messages.push(Message.fromJSON(m_list[i]));
            }
        }
        return transaction
    }
}