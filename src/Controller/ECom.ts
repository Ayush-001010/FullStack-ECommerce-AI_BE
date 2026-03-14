import { Request, Response } from "express";
import model from "../../Model/model";
import getImages from "../Services/AWSServices";

export const getBannerDetails = async (req: Request, res: Response) => {
  try {
    const banners = await model.BannerDetails.findAll({
      where: {
        IsActive: true,
      },
      order:[["OrderNumber","DESC"]]
    });
    for (const banner of banners) {
      console.log(banner);
      const { ImageKey } = banner.dataValues;
      const response = await getImages(ImageKey);
      if (response && response.success) {
        banner.dataValues.ImageURL = response.data;
      } else {
        banner.dataValues.ImageURL = null;
      }
    }
    return res.send({ success: true, data: banners });
  } catch (error) {
    console.error("Error fetching banner details:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};
