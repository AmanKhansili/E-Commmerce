import express from "express";
import {
  addToCart,
  addToFavorites,
  getAllcartItems,
  getAllOrders,
  getUserFavourites,
  placeOrder,
  removeFromCart,
  removeFromFavorites,
  UserLogin,
  UserRegister,
} from "../controller/User.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/signup", UserRegister);
router.post("/signin", UserLogin);

//cart
router.get("/cart", verifyToken, getAllcartItems);
router.post("/cart", verifyToken, addToCart);
router.patch("/cart", verifyToken, removeFromCart);

//order
router.get("/order", verifyToken, getAllOrders);
router.post("/order", verifyToken, placeOrder);

//favourites
router.get("/favorite", verifyToken, getUserFavourites);
router.post("/favorite", verifyToken, addToFavorites);
router.patch("/favorite", verifyToken, removeFromFavorites);

export default router;
