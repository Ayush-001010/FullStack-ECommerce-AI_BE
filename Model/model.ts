import BannerDetails from "./Table/BannerDetails";
import UserDetails from "./Table/UserDetails";

interface IModel {
    UserDetails : typeof UserDetails;
    BannerDetails : typeof BannerDetails;
}

const model : IModel = {
    UserDetails,
    BannerDetails
}

export default model;