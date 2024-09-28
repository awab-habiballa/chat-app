import Conversation from "../models/conversation.model.js";
import Messsage from "../models/message.model.js";

export const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await Messsage.create({
      senderId,
      receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }
    //await conversation.save();
    //await newMessage.save();

    await Promise.all([conversation.save(), newMessage.save()]); //to run at the same time

    res.status(201).json(newMessage);
  } catch (error) {
    next(error);
  }
};
