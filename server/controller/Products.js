import mongoose from "mongoose";
import { Products } from "../models/Product.model.js";

const addProducts = async (req, res) => {
  try {
    const productsData = req.body;

    if (!Array.isArray(productsData)) {
      res.status(400).json({ msg: "Invalid request. Expected an array of products" });
    }

    const createdproducts = [];

    for (const productInfo of productsData) {
      const { title, name, desc, img, price, sizes, category } = productInfo;

      const product = new Products({
        title,
        name,
        desc,
        img,
        price,
        sizes,
        category,
      });
      const createdproduct = await product.save();

      createdproducts.push(createdproduct);
    }

    return res.status(201).json({ message: "Products added successfully", createdproducts });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getproducts = async (req, res, next) => {
  try {
    let { categories, minPrice, maxPrice, sizes, search } = req.query;
    sizes = sizes?.split(",");
    categories = categories?.split(",");

    const filter = {};

    if (categories && Array.isArray(categories)) {
      filter.category = { $in: categories }; // Match products in any of the specified categories
    }

    if (minPrice || maxPrice) {
      filter["price.org"] = {};
      if (minPrice) {
        filter["price.org"]["$gte"] = parseFloat(minPrice); //$gte (Grater Than or Equal) Operator
      }
      if (maxPrice) {
        filter["price.org"]["$lte"] = parseFloat(maxPrice); //$lte (Less Than or Equal) Operator
      }
    }

    if (sizes && Array.isArray(sizes)) {
      filter.sizes = { $in: sizes }; // Match products in any of the specified sizes
    }

    if (search) {
      //$or (MongoDB Operator)
      filter.$or = [
        { title: { $regex: new RegExp(search, "i") } }, // search is the string used by user and i is a flag Case-insensitive title search
        { desc: { $regex: new RegExp(search, "i") } }, // Case-insensitive description search
      ];
    }

    const products = await Products.find(filter);
    return res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid product ID" });
    }

    const product = await Products.findById(id);
    if (!product) {
      res.status(404).json({ msg: "Product not found" });
    }

    res.status(200).json({ product });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export { addProducts, getproducts, getProductById };
