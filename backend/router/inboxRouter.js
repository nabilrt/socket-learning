const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const multipleFileUpload = require("../middleware/multiple-file-upload");
const {
  createConversation,
  sendMessage,
  getConversations,
  getMessagesByConversationId,
} = require("../controller/inboxController");

const inboxRouter = express.Router();

inboxRouter.post("/conversation", checkLogin, createConversation);
inboxRouter.post("/message", checkLogin, multipleFileUpload, sendMessage);
inboxRouter.get("/conversations", checkLogin, getConversations);
inboxRouter.get(
  "/messages/:conversation_id",
  checkLogin,
  getMessagesByConversationId
);

module.exports = inboxRouter;
