import { Router } from "express";
import { googleAuth, register, signIn } from "../Controller/Auth";

const route = Router();

route.post("/register", register);
route.post("/signin", signIn);
route.post("/googleAuth",googleAuth);

export default route;