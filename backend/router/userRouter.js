const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const checkLogin = require("../middleware/checkLogin");
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post("/add-user", async (req, res) => {
  console.log(req);
  let newUser;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  newUser = new User({
    ...req.body,
    password: hashedPassword,
  });

  // save user or send error
  try {
    const result = await newUser.save();
    res.status(200).json({
      message: "User was added successfully!",
    });
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
