import bcrypt from "bcryptjs";

import User from "../models/user.model.js";
import { errorHandler } from "../util/errorHandler.js";
import generateTokenAndSetCookie from "../util/generateToken.js";

export const signup = async (req, res, next) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;
    if (password !== confirmPassword)
      return next(errorHandler(400, "Passwords do not match"));

    const user = await User.findOne({ username });

    if (user) return next(errorHandler(400, "Username already exists"));

    //hashpassword
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const girlProfilePic = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`;
    const boyProfilePic = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      next(errorHandler(400, "Invalid user data"));
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) return next(errorHandler(405, "User not found"));

    const isCorrectPassword = bcrypt.compareSync(
      password,
      user?.password || ""
    );

    if (!isCorrectPassword)
      return next(errorHandler(401, "Invalid credentials!"));

    generateTokenAndSetCookie(user._id, res);

    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  console.log("logout user");
};
