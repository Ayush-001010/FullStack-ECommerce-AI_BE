import { Request, Response } from "express";
import model from "../../Model/model";
import getImages from "../Services/AWSServices";
import es from "../index";
import { IProductCard } from "../Interface/IProductCard";

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
      for (const key of ImageKey.split("|")) {
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
  } catch (error) {
    console.error("Error fetching product details:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const getFavoriteProducts = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.email;
    const UserDetails = await model.UserDetails.findOne({
      where: { Email: userEmail },
    });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    const userId = UserDetails.dataValues.id;
    const favorites = await model.Favorites.findAll({
      where: { userId: userId },
    });
    const productIds = favorites.map((fav) => fav.dataValues.productId);
    return res.send({ success: true, data: productIds });
  } catch (error) {
    console.log("Error fetching favorite products:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const addToFavorite = async (req: Request, res: Response) => {
  try {
    const { userEmail, productId } = req.body;
    const UserDetails = await model.UserDetails.findOne({
      where: { Email: userEmail },
    });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    const userId = UserDetails.dataValues.id;
    const existingFavorite = await model.Favorites.findOne({
      where: { UserId: userId, ProductId: productId },
    });
    if (existingFavorite) {
      return res.send({
        success: false,
        errMsg: "Product already in favorites",
      });
    }
    await model.Favorites.create({ userId: userId, productId: productId });
    return res.send({ success: true, message: "Product added to favorites" });
  } catch (error) {
    console.log("Error adding to favorites:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const removeFromFavorites = async (req: Request, res: Response) => {
  try {
    const { userEmail, productId } = req.query;
    const UserDetails = await model.UserDetails.findOne({
      where: { Email: userEmail },
    });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    const userId = UserDetails.dataValues.id;
    await model.Favorites.destroy({
      where: { userId: userId, productId: productId },
    });
    return res.send({
      success: true,
      message: "Product removed from favorites",
    });
  } catch (error) {
    console.log("Error removing from favorites:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const searchProduct = async (req: Request, res: Response) => {
  const { searchText, isDisplay } = req.body;
  if (!searchText) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }
  try {
    const queryText = String(searchText); // Explicitly cast q to string
    const body = {
      query: {
        multi_match: {
          query: queryText,
          fields: ["Name^2", "Description"],
          fuzziness: "AUTO",
        },
      },
      // suggest:{
      //   simple_phrase : {
      //     text : queryText,
      //     phrase : {
      //       field : "Name",
      //       size : 1,
      //       gram_size : 2,
      //     }
      // }
      // }
    };
    const { hits: response } = await es.search({
      index: "products",
      body,
    });
    const results = response.hits.map((hit) => hit._source);
    for (const product of results) {
      const { ImageKey } = product as any;
      // for(const key of Image.split("|")){
      if (!isDisplay) {
        const key = ImageKey.split("|")[0] || "";
        const response = await getImages(key);
        if (response && response.success) {
          (product as any).ImageURL = response.data;
        }
      } else {
        const imageUrls = [];
        for (const key of ImageKey.split("|")) {
          const response = await getImages(key);
          if (response && response.success) {
            imageUrls.push(response.data);
          }
        }
        (product as any).ImageURLs = imageUrls;
      }
      // }
    }
    return res.send({ success: true, data: results });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const setCartValue = async (req: Request, res: Response) => {
  try {
    const { userEmail, products } = req.body;
    const UserDetails = await model.UserDetails.findOne({
      where: { Email: userEmail },
    });
    if (!UserDetails) {
      return res.send({ success: false, errMsg: "User not found" });
    }
    for (const product of products) {
      const { productDetails, quantity } = product as IProductCard;
      const { id } = productDetails;
      const userId = UserDetails.dataValues.id;
      const existingCartItem = await model.AddToCart.findOne({
        where: { UserId: userId, ProductId: id },
      });
      if (existingCartItem) {
        await model.AddToCart.update(
          { Quantity: quantity },
          { where: { UserId: userId, ProductId: id } }
        );
      } else {
        await model.AddToCart.create({
          UserId: userId,
          ProductId: id,
          Quantity: quantity,
        });
      }
    }
    return res.send({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.log("Error adding to cart:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  try {
    const userEmail = req.query.userEmail;
    const inFullDetails = req.query.inFullDetails;

    if (!inFullDetails) {
      const UserDetails = await model.UserDetails.findOne({
        where: { Email: userEmail },
      });
      if (!UserDetails) {
        return res.send({ success: false, errMsg: "User not found" });
      }
      const userId = UserDetails.dataValues.id;
      const cartItems = await model.AddToCart.findAll({
        where: { userId: userId },
      });
      const productIds = cartItems.map((item) => item.dataValues.productId);
      return res.send({ success: true, data: productIds });
    } else {
      const UserDetails = await model.UserDetails.findOne({
        where: { Email: userEmail },
      });
      if (!UserDetails) {
        return res.send({ success: false, errMsg: "User not found" });
      }
      const userId = UserDetails.dataValues.id;
      const cartItems = await model.AddToCart.findAll({
        where: { userId: userId },
      });
      const detailedCartItems = [];
      for (const item of cartItems) {
        const productId = item.dataValues.ProductId;
        const quantity = item.dataValues.Quantity;
        const productDetails = await model.ProductDetails.findOne({
          where: { id: productId },
        });
        if (productDetails) {
          const { ImageKey } = productDetails.dataValues;
          const response = await getImages(ImageKey.split("|")[0] || "");
          const imageUrl =
            response && response.success ? response.data : null;
          detailedCartItems.push({
            productId,
            quantity,
            Name: productDetails.dataValues.Name,
            Price: productDetails.dataValues.Price,
            ImageURL: imageUrl,
            IsDiscounted: productDetails.dataValues.IsDiscounted,
            DiscountPercentage: productDetails.dataValues.DiscountPercentage,
            Description: productDetails.dataValues.Description,
          });
        }
      }
      return res.send({ success: true, data: detailedCartItems });  
    }
  } catch (error) {
    console.log("Error fetching cart items:", error);
    return res.send({ success: false, errMsg: "Something went wrong" });
  }
};
