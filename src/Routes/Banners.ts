import { Router } from "express";
import { getBannerDetails, getCategoryDetails } from "../Controller/ECom";


const route = Router();

route.post("/getBanners", getBannerDetails);
route.post("/getCategories", getCategoryDetails);

export default route;