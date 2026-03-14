import { Router } from "express";
import { getBannerDetails } from "../Controller/ECom";


const route = Router();

route.post("/getBanners", getBannerDetails);

export default route;