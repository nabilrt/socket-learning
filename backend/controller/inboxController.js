const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");
const User = require("../models/User");

const createConversation = async (req, res) => {
  const { id, participant, avatar } = req.body;
  const userId = req.user.userId; // Assuming `req.user.userId` is the logged-in user's ID
  const username = req.user.username;
  const userAvatar = req.user.avatarUrl || null;

  try {
    // Check if a conversation already exists between the two users
    let conversation = await Conversation.findOne({
      $or: [
        {
          "creator.id": userId,
          "participant.id": id,
        },
        {
          "creator.id": id,
          "participant.id": userId,
        },
      ],
    });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({
        creator: {
          id: userId,
          name: username,
          avatar: userAvatar,
        },
        participant: {
          id,
          name: participant,
          avatar: avatar || null,
        },
        lastMessage: {},
      });
      await conversation.save();
    }

    // Return the conversation (either found or newly created)
    return res.status(201).json({
      conversation,
      message: "Conversation created successfully!",
    });
  } catch (error) {
    return res.status(500).json({ message: "Error creating conversation" });
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

    const senderInfo = await User.findById(req.user.userId);
    const recieverInfo = await User.findById(req.body.receiverId);

    const newMessage = new Message({
      text: req.body.message,
      attachments: attachments,
      sender: {
        id: req.user.userId,
        name: req.user.username,
        avatar: recieverInfo.avatar || null,
      },
      receiver: {
        id: req.body.receiverId,
        name: req.body.receiverName,
        avatar: senderInfo.avatar || null,
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
          avatar: senderInfo.avatar,
        },
        receiver: {
          id: req.body.receiverId,
          name: req.body.receiverName,
          avatar: recieverInfo.avatar || null,
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
