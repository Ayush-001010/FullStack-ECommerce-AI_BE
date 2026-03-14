import { Router } from "express";
import { getImage } from "../Controller/Images";


const route = Router();

route.get("/getImage", getImage);

export default route;