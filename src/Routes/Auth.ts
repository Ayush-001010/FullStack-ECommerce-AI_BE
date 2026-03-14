import { Router } from "express";
import { googleAuth, register, signIn, checkAuth } from "../Controller/Auth";

const route = Router();

route.post("/register", register);
route.post("/signin", signIn);
route.post("/googleAuth",googleAuth);
route.post("/check", checkAuth);

export default route;