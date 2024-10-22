const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const checkLogin = require("../middleware/checkLogin");
const jwt = require("jsonwebtoken");
const singleUpload = require("../middleware/file-upload");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");

const userRouter = express.Router();

userRouter.post("/add-user", singleUpload, async (req, res) => {
  // save user or send error
  try {
    const { name, email, password } = req.body;
    const file = req.file;
    if (file) {
      if (!name && !email && !password) {
        return res.status(400).json({
          message: "Fill up all the fields",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const image = await cloudinaryConfig.uploader.upload(
        file.path,
        {
          folder: "chat-app",
        },
        (err, result) => {
          if (err) {
            return res.status(500).json({
              message: "Internal Server Error",
            });
          }
        }
      );
      const avatar = image.secure_url;

      const user = new User({
        name,
        email,
        password: hashedPassword,
        avatar,
      });
      await user.save();
      fs.unlinkSync(file.path);

      return res.status(201).json({
        message: "User Created",
      });
    } else {
      if (!name && !email && !password) {
        return res.status(400).json({
          message: "Fill up all the fields",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        name,
        email,
        password: hashedPassword,
        avatar: process.env.DEFAULT_AVATAR_URL,
      });
      await user.save();

      return res.status(201).json({
        message: "User Created",
      });
    }
  } catch (err) {
    res.status(500).json({
      errors: {
        common: {
          msg: "Unknown error occured!",
        },
      },
    });
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "Wrong Password",
      });
    }
    const token = jwt.sign(
      {
        username: user.name,
        userId: user._id,
        avatarUrl: user.avatar,
      },
      "secret",
      {
        expiresIn: "1h",
      }
    );
    res.status(200).json({
      message: "Auth Successful",
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      users,
      message: "Users returned successfully!",
    });
  } catch (err) {
    //next(err);
  }
});
userRouter.get("/me", checkLogin, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    res.status(200).json({
      message: "User Details",
      user: user,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
module.exports = userRouter;
