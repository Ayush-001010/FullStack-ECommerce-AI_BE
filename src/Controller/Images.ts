import { Request, Response } from "express";
import getImages from "../Services/AWSServices";

export const getImage = async (req: Request, res: Response) => {
    try {
      const key = req.query.key as string;
      console.log("Received key:", key);
      const response = await getImages(key);
      return res.send(response);
    } catch (error) {
      console.log("Error in getUserImage:", error);
      return res.send({ success: false, data: error });
    }
  };