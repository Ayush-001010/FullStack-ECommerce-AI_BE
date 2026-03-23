import AddToCart from "./Table/AddToCart";
import BannerDetails from "./Table/BannerDetails";
import CategoryDetails from "./Table/CategoryDetails";
import Favorites from "./Table/Favorites";
import ProductDetails from "./Table/ProductDetails";
import UserDetails from "./Table/UserDetails";

interface IModel {
    UserDetails : typeof UserDetails;
    BannerDetails : typeof BannerDetails;
    CategoryDetails : typeof CategoryDetails;
    ProductDetails : typeof ProductDetails;
    Favorites : typeof Favorites;
    AddToCart : typeof AddToCart;
}

const model : IModel = {
    UserDetails,
    BannerDetails,
    CategoryDetails,
    ProductDetails,
    Favorites,
    AddToCart
}

CategoryDetails.hasMany(ProductDetails, {
    foreignKey : "categoryId",
    as : "products"
})

ProductDetails.belongsTo(CategoryDetails, {
    foreignKey : "categoryId",
    as : "category"
})

UserDetails.hasMany(Favorites, {
    foreignKey : "userId",
    as : "favorites"
})

Favorites.belongsTo(UserDetails, {
    foreignKey : "userId",
    as : "user"
})

ProductDetails.hasMany(Favorites, {
    foreignKey : "productId",
    as : "favorites"
})

Favorites.belongsTo(ProductDetails, {
    foreignKey : "productId",
    as : "product"
})

export default model;