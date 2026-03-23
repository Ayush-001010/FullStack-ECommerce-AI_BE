export default interface IProduct {
    id:number;
    Description : string;
    DiscountPercentage : number;
    ImageURLs ?: Array<string>;
    IsBestSeller : boolean;
    IsDiscounted : boolean;
    Name : string;
    NoOfRatings : number;
    Price : number;
    Rating : number;
    Quantity : number;
    categoryId : number;
    ImageKey : string;
}