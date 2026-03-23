import { Router } from "express";
import { setCartValue, addToFavorite,getFavoriteProducts,getProductDetails, removeFromFavorites, searchProduct, getCartItems} from "../Controller/ECom";

const route = Router();

route.post("/getDetails", getProductDetails);
route.post("/addToFavorites", addToFavorite);
route.get("/getFavorites", getFavoriteProducts);
route.get("/removeFromFavorites", removeFromFavorites);
route.post("/searchProduct",searchProduct);
route.post("/setCartValue",setCartValue);
route.get("/getCartProducts",getCartItems);

export default route;
