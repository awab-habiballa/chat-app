import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";
import { errorHandler } from "../util/errorHandler.js";

export const getUsersForSidebar = async (req, res, next) => {
  try {
    const loggedInUserId = req.user._id;

    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    next(error);
  }
};
