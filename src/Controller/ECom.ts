import { Request, Response } from "express";
import model from "../../Model/model";
import getImages from "../Services/AWSServices";

export const getBannerDetails = async (req: Request, res: Response) => {
  try {
    const banners = await model.BannerDetails.findAll({
      where: {
        IsActive: true,
      },
      order: [["OrderNumber", "DESC"]],
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

export const getCategoryDetails = async (req: Request, res: Response) => {
  try {
    const { pageNo } = req.body; 
    const categories = await model.CategoryDetails.findAll({
      where: {
        IsActive: true,
      },
      order: [["OrderNumber", "DESC"]],
      limit: 10,
      offset: (pageNo - 1) * 10,
    });
    for (const category of categories) {
      const { ImageKey } = category.dataValues;
      const response = await getImages(ImageKey);
      if (response && response.success) {
        category.dataValues.ImageURL = response.data;
      } else {
        category.dataValues.ImageURL = null;
      }
    }
    return res.send({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching category details:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const getProductDetails = async (req: Request, res: Response) => {
  try {
    await model.ProductDetails.findAll();
  }
  catch (error) {
    console.error("Error fetching product details:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
}