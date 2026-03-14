import BannerDetails from "./Table/BannerDetails";
import CategoryDetails from "./Table/CategoryDetails";
import ProductDetails from "./Table/ProductDetails";
import UserDetails from "./Table/UserDetails";

interface IModel {
    UserDetails : typeof UserDetails;
    BannerDetails : typeof BannerDetails;
    CategoryDetails : typeof CategoryDetails;
    ProductDetails : typeof ProductDetails;
}

const model : IModel = {
    UserDetails,
    BannerDetails,
    CategoryDetails,
    ProductDetails
}

CategoryDetails.hasMany(ProductDetails, {
    foreignKey : "categoryId",
    as : "products"
})

ProductDetails.belongsTo(CategoryDetails, {
    foreignKey : "categoryId",
    as : "category"
})

export default model;