import express from "express";
import { addProducts, getProductById, getproducts } from "../controller/Products.js";

const router = express.Router();

router.post("/add", addProducts);
router.get("/", getproducts);
router.get("/:id", getProductById);

export default router;
