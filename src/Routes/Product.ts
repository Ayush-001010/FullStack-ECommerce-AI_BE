import { Router } from "express";
import { addToFavorite,getFavoriteProducts,getProductDetails, removeFromFavorites, searchProduct} from "../Controller/ECom";

const route = Router();

route.post("/getDetails", getProductDetails);
route.post("/addToFavorites", addToFavorite);
route.get("/getFavorites", getFavoriteProducts);
route.get("/removeFromFavorites", removeFromFavorites);
route.post("/searchProduct",searchProduct);

export default route;
