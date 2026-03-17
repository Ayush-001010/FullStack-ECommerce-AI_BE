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
    const { pageNo } = req.body;
    const products = await model.ProductDetails.findAll({
      where: {
        IsActive: true,
      },
      limit: 6,
      offset: (pageNo - 1) * 6,
    });
    for (const product of products) {
      const { ImageKey } = product.dataValues;
      for(const key of ImageKey.split("|")){
        const response = await getImages(key);
        if (response && response.success) {
          if (!product.dataValues.ImageURLs) {
            product.dataValues.ImageURLs = [];
          }
          product.dataValues.ImageURLs.push(response.data);
        }
      }
    }
    return res.send({ success: true, data: products });
  }
  catch (error) {
    console.error("Error fetching product details:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const getFavoriteProducts = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.email;
    const UserDetails = await model.UserDetails.findOne({ where: { Email: userEmail } });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    const userId = UserDetails.dataValues.id;
    const favorites = await model.Favorites.findAll({ where: { userId: userId } });
    const productIds = favorites.map(fav => fav.dataValues.productId);
    return res.send({ success: true, data: productIds });
  } catch(error){
    console.log("Error fetching favorite products:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const addToFavorite = async (req : Request , res : Response) => {
  try {
    const { userEmail, productId } = req.body;
    const UserDetails = await model.UserDetails.findOne({ where: { Email: userEmail } });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    const userId = UserDetails.dataValues.id;
    const existingFavorite = await model.Favorites.findOne({ where: { UserId: userId, ProductId: productId } });
    if (existingFavorite) {
      return res.send({ success: false, errMsg: "Product already in favorites" });
    }
    await model.Favorites.create({ userId: userId, productId: productId });
    return res.send({ success: true, message: "Product added to favorites" });
  } catch(error){
    console.log("Error adding to favorites:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { userEmail, productId } = req.query;
    const UserDetails = await model.UserDetails.findOne({ where: { Email: userEmail } });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    const userId = UserDetails.dataValues.id;
    await model.Favorites.destroy({ where: { userId: userId, productId: productId } });
    return res.send({ success: true, message: "Product removed from favorites" });
  } catch(error){
    console.log("Error removing from favorites:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};