const express = require("express");
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const checkLogin = require("../middleware/checkLogin");
const multipleFileUpload = require("../middleware/multiple-file-upload");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");

const inboxRouter = express.Router();

inboxRouter.post("/conversation", checkLogin, async (req, res) => {
  try {
    const newConversation = new Conversation({
      creator: {
        id: req.user.userId,
        name: req.user.username,
        avatar: req.user.avatarUrl || null,
      },
      participant: {
        name: req.body.participant,
        id: req.body.id,
        avatar: req.body.avatar || null,
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

inboxRouter.post(
  "/message",
  checkLogin,
  multipleFileUpload,
  async (req, res) => {
    try {
      let attachments = []; // Declare this before the 'if' block
      console.log(req.files);

      // If there are files to upload
      if (req.files && req.files.length > 0) {
        const uploadPromises = req.files.map((file) =>
          cloudinaryConfig.uploader.upload(file.path, { resource_type: "auto" })
        );
        const results = await Promise.all(uploadPromises);

        // Extract the secure URLs from the Cloudinary responses
        attachments = results.map((result) => result.secure_url);

        req.files.map((file) => fs.unlinkSync(file.path));
      }

      const newMessage = new Message({
        text: req.body.message,
        attachments: attachments, // Pass the populated or empty array here
        sender: {
          id: req.user.userId,
          name: req.user.username,
          avatar: req.user.avatarUrl || null,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: req.body.avatar || null,
        },
        conversation_id: req.body.conversationId,
      });

      const result = await newMessage.save();

      // Emit socket event
      global.io.emit("new_message", {
        message: {
          conversation_id: req.body.conversationId,
          sender: {
            id: req.user.userId,
            name: req.user.username,
            avatar: req.user.avatarUrl,
          },
          message: req.body.message,
          attachments: attachments, // Ensure the correct attachments array is emitted
          date_time: result.date_time,
        },
      });

      // Send the response only once
      return res.status(200).json({
        message: "Successful!",
        data: result,
      });
    } catch (err) {
      // Handle errors and send a response
      return res.status(500).json({
        errors: {
          common: {
            msg: err.message,
          },
        },
      });
    }
  }
);

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
