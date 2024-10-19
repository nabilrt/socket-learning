const express = require("express");
const cors = require("cors");
const http = require("http");
const mongoose = require("mongoose");
const userRouter = require("./router/userRouter");
const conversationRouter = require("./router/inboxRouter");
require("dotenv").config();

const app = express();
app.use(express.json()); // to handle JSON bodies

app.use(cors());

const server = http.createServer(app);

const io = require("socket.io")(server, {
  cors: {
    origin: "*", // you can replace '*' with the allowed domains, e.g., 'http://localhost:3000'
    methods: ["GET", "POST"],
  },
});
global.io = io;

const PORT = 9000;
const MONGO_DB_URL = process.env.MONGODB_DB_URL;

mongoose
  .connect(MONGO_DB_URL, {})
  .then(function () {
    console.log("MongoDB connected");
  })
  .catch(function (error) {
    console.log("MongoDB connection failed", error);
  });

app.use("/user", userRouter);
app.use("/inbox", conversationRouter);

server.listen(PORT, function () {
  console.log(`Server started at PORT ${PORT}`);
});
