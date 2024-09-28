import jwt from "jsonwebtoken";
import { errorHandler } from "../util/errorHandler.js";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) return next(errorHandler(401, "Unauthorized!"));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) return next(errorHandler(401, "Unauthorized!")); // invalid token

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return next(errorHandler(401, "Unauthorized!")); // User not found in db

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};
