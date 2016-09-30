export class UserPublic {
    
    public id:number;
    public buyer_rating:number;
    public seller_rating:number;
    
    constructor() {
        
    }
    
    public static fromJSON(jsonObj): UserPublic {
        var user:UserPublic = new UserPublic();
        user.id = jsonObj.id;
        user.buyer_rating = jsonObj.buyer_rating;
        user.seller_rating = jsonObj.seller_rating;
        return user;
    }
}