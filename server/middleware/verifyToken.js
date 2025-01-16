import jwt from "jsonwebtoken";

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token

    if (!token) {
      return res.status(401).json({ msg: "You are not authenticated. Token missing." });
    }

    // Verify token and decode
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = decoded;

    return next();
  } catch (error) {
    return res.status(500).json({ msg: "Something went wrong", error: error.message });
  }
};
