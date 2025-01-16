import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model.js";
import { Order } from "../models/Order.model.js";

export const UserRegister = async (req, res) => {
  const { name, email, img, password } = req.body;
  try {
    //check if user already existed
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.status(400).json({ msg: "User already existed" });
    }
    //bcrypt Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      img,
      password: hashPassword,
    });

    await user.save();

    //create jwt token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({ msg: "User register successfully", token, user });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};
export const UserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user not existed
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.status(404).json({ msg: "User not found" });
    }
    //compare password from user and the database for login
    const isPasswordCorrect = bcrypt.compare(password, userExist.password);
    if (!isPasswordCorrect) {
      res.status(403).json({ msg: "Incorrect password" });
    }

    const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.status(200).json({ token, user: userExist });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const existingCartItemIndex = user.cart.findIndex((item) => item?.product?.equals(productId));
    if (existingCartItemIndex !== -1) {
      // Product is already in the cart, update the quantity
      user.cart[existingCartItemIndex].quantity += quantity;
    } else {
      // Product is not in the cart, add it
      user.cart.push({ product: productId, quantity });
    }
    await user.save();

    res.status(200).json({ msg: "Product added to cart successfully", user });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }
    const productIndex = user.cart.findIndex((item) => item.product.equals(productId));
    if (productIndex !== -1) {
      if (quantity && quantity > 0) {
        user.cart[productIndex].quantity -= quantity;
        if (user.cart[productIndex].quantity <= 0) {
          user.cart.splice(productIndex, 1);
        }
      } else {
        user.cart.splice(productIndex, 1);
      }

      await user.save();
      res.status(200).json({ msg: "Product quantity updated in cart", user });
    } else {
      res.status(404).json({ msg: "Product not found in the user's cart" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getAllcartItems = async (req, res, next) => {
  try {
    const userJWT = req.user;
    const user = await User.findById(userJWT.id).populate({
      path: "cart.product",
      model: "Products",
    });
    const cartIems = user.cart;
    res.status(200).json(cartIems);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const placeOrder = async (req, res, next) => {
  try {
    const { products, address, totalAmount } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);
    const order = new Order({
      products,
      user: user._id,
      total_amount: totalAmount,
      address,
    });
    await order.save();

    user.cart.save();

    user.cart = [];
    await user.save();

    res.status(200).json({ msg: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getAllOrders = async (req, res, next) => {
  try {
    const user = req.user;
    const orders = await Order.find({ user: user.id });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const addToFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    if (!user.favourites.includes(productId)) {
      user.favourites.push(productId);
      await user.save();
    }

    res.status(200).json({ msg: "Product added to favorites successfully", user });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const removeFromFavorites = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const userJWT = req.user;
    const user = await User.findById(userJWT.id);

    user.favourites = user.favourites.filter((fav) => !fav.equals(productId));
    await user.save();

    res.status(200).json({ msg: "Product removed from favorites successfully", user });
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getUserFavourites = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("favourites").exec();

    if (!user) {
      res.status(404).json({ msg: "User not found" });
    }

    return res.status(200).json(user.favourites);
  } catch (error) {
    res.status(500).json(error);
  }
};
