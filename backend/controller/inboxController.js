const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");

const createConversation = async (req, res) => {
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

    await newConversation.save();
    return res.status(200).json({
      message: "Conversation was added successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    let attachments = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinaryConfig.uploader.upload(file.path, { resource_type: "auto" })
      );
      const results = await Promise.all(uploadPromises);
      attachments = results.map((result) => result.secure_url);
      req.files.map((file) => fs.unlinkSync(file.path));
    }

    const newMessage = new Message({
      text: req.body.message,
      attachments: attachments,
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
    await Conversation.findByIdAndUpdate(req.body.conversationId, {
      lastMessage: result,
    });

    global.io.emit("new_message", {
      message: {
        conversation_id: req.body.conversationId,
        sender: {
          id: req.user.userId,
          name: req.user.username,
          avatar: req.user.avatarUrl,
        },
        message: req.body.message,
        attachments: attachments,
        date_time: result.date_time,
      },
    });

    return res.status(200).json({
      message: "Successful!",
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [
        { "creator.id": req.user.userId },
        { "participant.id": req.user.userId },
      ],
    });
    return res.status(200).json({
      conversations,
      message: "Conversation returned successfully!",
    });
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: err.message,
        },
      },
    });
  }
};

const getMessagesByConversationId = async (req, res) => {
  try {
    const messages = await Message.find({
      conversation_id: req.params.conversation_id,
    });

    const { participant } = await Conversation.findById(
      req.params.conversation_id
    );

    return res.status(200).json({
      data: {
        messages: messages,
        participant,
      },
      user: req.user.userId,
      conversation_id: req.params.conversation_id,
    });
  } catch (err) {
    return res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occurred!",
        },
      },
    });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getConversations,
  getMessagesByConversationId,
};
