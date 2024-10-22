const express = require("express");
const checkLogin = require("../middleware/checkLogin");
const singleUpload = require("../middleware/file-upload");
const {
  createUser,
  loginUser,
  getUsers,
  forgotPassword,
  getMe,
} = require("../controller/userController");

const userRouter = express.Router();

userRouter.post("/add-user", singleUpload, createUser);
userRouter.post("/login", loginUser);
userRouter.get("/users", getUsers);
userRouter.post("/forgotPassword", forgotPassword);
userRouter.get("/me", checkLogin, getMe);

module.exports = userRouter;
