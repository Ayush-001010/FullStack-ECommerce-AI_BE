import { Request, Response } from "express";
import model from "../../Model/model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { oauth2Client } from "../Services/GoogleServices";
import axios from "axios";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

type JwtPayload = {
  id?: number;
  email?: string;
  isAdmin?: boolean;
  isGoogleUser?: boolean;
};

const isLocalhost = (host?: string) => {
  if (!host) return false;
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
};

const getAuthCookieOptions = (req: Request) => {
  // For http://localhost dev, cookies must NOT be Secure.
  // For production over HTTPS, set Secure.
  const host = req.get("host") || "";
  const secure = process.env.NODE_ENV === "production" && !isLocalhost(host);

  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};

export const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).send({ errMsg: "Please fill all the fields" });
    }
    await model.UserDetails.create({
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Password: password,
    });
    res.status(200).send({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).send({ errMsg: "Something went wrong" });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      return res.send({success : false , errMsg : "Please provide email and password"})
    }

    const user = await model.UserDetails.findOne({ where: { Email: email } });
    if (!user) {
      return res.send({success : false , errMsg : "Invalid email or password"})
    }

    const userJson = user.toJSON() as any;
    const hashedPassword = userJson.Password as string | undefined;

    const isMatch = hashedPassword ? await bcrypt.compare(password, hashedPassword) : false;
    if (!isMatch) {
      return res.send({success : false , errMsg : "Invalid email or password"})
    }

    const token = jwt.sign(
      { id: userJson.id, email: userJson.Email, isAdmin: userJson.isAdmin },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, getAuthCookieOptions(req));

    return res.send({ success : true ,  data : {
      email: userJson.Email,
      name: `${userJson.FirstName} ${userJson.LastName}`,
    } });
  } catch (error) {
    return res.status(500).send({ errMsg: "Something went wrong" });
  }
};

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    const gres = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(gres.tokens);
    const userInfo = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${gres.tokens.access_token}`);
    
    console.log(userInfo.data);
    const { email } = userInfo.data;

    const data = await model.UserDetails.findOne({ where: { Email: email } });

    if (!data) {
      await model.UserDetails.create({
        FirstName: userInfo.data.given_name || "GoogleUser",
        LastName: userInfo.data.family_name || "GoogleUser",
        Email: email,
        Password: "",
      });
    }

    // JWT token generation for Google authenticated user
    const token = jwt.sign(
      { email: email, isGoogleUser: true },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, getAuthCookieOptions(req));

    return res.send({ success: true, msg: "Google authentication successful", data: {
        email: email,
        name : userInfo.data.name,
    } });

  } catch (error) {
    return res.status(500).send({ errMsg: "Something went wrong" });
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token = (req as any).cookies?.token as string | undefined;
    console.log("Token from cookies:", token);
    if (!token) {
      return res.send({ success: false });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
      return res.send({ success: false });
    }

    const email = decoded?.email;
    if (!email) {
      return res.send({ success: false });
    }

    const user = await model.UserDetails.findOne({ where: { Email: email } });
    if (!user) {
      return res.send({ success: false });
    }

    return res.send({ success: true , data : {
      email: user.Email,
      name: `${user.FirstName} ${user.LastName}`,
    } });
  } catch {
    return res.status(500).send({ success: false });
  }
};