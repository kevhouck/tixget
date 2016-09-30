export class UserPrivate {
    // represents the user that is logged in
    // other things that all users will see involving
    // a user will user UserPublic
    public id: number;
    public facebook_id:string;
    public stripe_id:string;
    public buyer_rating:number;
    public seller_rating:number;
    
    constructor() {}
    
    public static fromJSON(jsonObj): UserPrivate {
        var user:UserPrivate = new UserPrivate();
        user.id = jsonObj.id;
        user.facebook_id = jsonObj.facebook_id;
        user.stripe_id = jsonObj.stripe_id;
        user.buyer_rating = jsonObj.buyer_rating;
        user.seller_rating = jsonObj.seller_rating;
        return user;
    }
}