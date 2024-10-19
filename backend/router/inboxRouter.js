const express = require("express");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const checkLogin = require("../middleware/checkLogin");

const inboxRouter = express.Router();

inboxRouter.post("/conversation", checkLogin, async (req, res) => {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userId,
        name: req.user.username,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
      },
    });

    const result = await newConversation.save();
    res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
});

inboxRouter.post("/message", checkLogin, async (req, res) => {
  try {
    // save message text/attachment in database

    const newMessage = new Message({
      text: req.body.message,
      sender: {
        id: req.user.userId,
        name: req.user.username,
      },
      receiver: {
        id: req.body.receiverId,
        name: req.body.receiverName,
      },
      conversation_id: req.body.conversationId,
    });

    const result = await newMessage.save();
    console.log(global);

    // emit socket event
    global.io.emit("new_message", {
      message: {
        conversation_id: req.body.conversationId,
        sender: {
          id: req.user.userId,
          name: req.user.username,
        },
        message: req.body.message,
        date_time: result.date_time,
      },
    });

    res.status(200).json({
      message: "Successful!",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
});

// send message
inboxRouter.get("/conversations", checkLogin, async (req, res) => {
  const conversations = await Conversation.find();
  res.status(200).json({
    conversations,
    message: "Conversation returned successfully!",
  });
});

inboxRouter.get("/messages/:conversation_id", checkLogin, async (req, res) => {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    });

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userId,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknows error occured!",
        },
      },
    });
  }
});

module.exports = inboxRouter;
