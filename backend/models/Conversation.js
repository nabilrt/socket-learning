const mongoose = require("mongoose");
const messageSchema = require("./Message");
const conversationSchema = mongoose.Schema(
  {
    creator: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },

    participant: {
      id: mongoose.Types.ObjectId,
      name: String,
      avatar: String,
    },
    lastMessage: {},

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
