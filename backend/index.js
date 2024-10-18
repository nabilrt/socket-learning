const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const PORT = 9000;

io.on("connection", (socket) => {
  console.log(`Connection established with server: ${socket.id}`);
  socket.on("join_room", (data) => {
    socket.join(data.roomNumber);
    socket.to(data.roomNumber).emit("user_joined", data);
  });
  socket.on("send_message", (data) => {
    socket.to(data.roomNumber).emit("receive_message", data);
  });
});

server.listen(PORT, function () {
  console.log(`Server started at PORT ${PORT}`);
});
