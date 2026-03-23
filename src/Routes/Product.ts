import { Router } from "express";
import { setCartValue, addToFavorite,getFavoriteProducts,getProductDetails, removeFromFavorites, searchProduct, getCartItems, orderProducts, getOrderDetails, getProductDetailsById} from "../Controller/ECom";

const route = Router();

route.post("/getDetails", getProductDetails);
route.post("/addToFavorites", addToFavorite);
route.get("/getFavorites", getFavoriteProducts);
route.get("/removeFromFavorites", removeFromFavorites);
route.post("/searchProduct",searchProduct);
route.post("/setCartValue",setCartValue);
route.get("/getCartProducts",getCartItems);
route.post("/orderProducts",orderProducts);
route.post("/getOrderDetails",getOrderDetails);
route.get("/getProductDetailsById",getProductDetailsById);

export default route;
