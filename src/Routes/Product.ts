import { Router } from "express";
import { addToFavorite,getFavoriteProducts,getProductDetails, removeFromFavorites} from "../Controller/ECom";

const route = Router();

route.post("/getDetails", getProductDetails);
route.post("/addToFavorites", addToFavorite);
route.get("/getFavorites", getFavoriteProducts);
route.get("/removeFromFavorites", removeFromFavorites);

export default route;
