import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import ConnectDB from "./db/db.js";
import Userrouter from "./routes/user.route.js";
import Productrouter from "./routes/products.route.js";

const app = express();
ConnectDB();
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

//error handel
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

app.get("/", (req, res) => {
  res.send("Welcome to the E-commerce API!");
});
app.use("/api/user", Userrouter);
app.use("/api/products", Productrouter);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server is running at port ${process.env.PORT}`);
});
