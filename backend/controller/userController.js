const bcrypt = require("bcrypt");
const User = require("../models/User");
const cloudinaryConfig = require("../config/cloudinary");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const transporter = require("../config/mailer");
require("dotenv").config();

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const file = req.file;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Fill up all the fields",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let avatar = process.env.DEFAULT_AVATAR_URL;
    if (file) {
      const image = await cloudinaryConfig.uploader.upload(file.path, {
        folder: "chat-app",
      });
      avatar = image.secure_url;
      fs.unlinkSync(file.path);
    }

    const user = new User({
      name,
      email,
      password: hashedPassword,
      avatar,
    });

    await user.save();
    return res.status(201).json({
      message: "User Created",
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

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const token = jwt.sign(
      {
        username: user.name,
        userId: user._id,
        userEmail: user.email,
        avatarUrl: user.avatar,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Auth Successful",
      token,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getUsers = async (req, res) => {
  const { search } = req.query; // Retrieve search query from request parameters
  const userId = req.user.userId; // Assuming `req.user._id` contains the authenticated user's ID

  try {
    let query = {
      _id: { $ne: userId }, // Exclude the current user by ID
    };

    if (search) {
      // Add search criteria to the query
      query = {
        $and: [
          { _id: { $ne: userId } }, // Exclude current user
          {
            $or: [
              { name: { $regex: search, $options: "i" } }, // Match name
              { email: { $regex: search, $options: "i" } }, // Match email
            ],
          },
        ],
      };
    }

    const users = await User.find(query); // Search users based on the query
    return res.status(200).json({
      users,
      message: "Users returned successfully!",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(500).json({ message: "User not found" });
    }

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
    let newPassword = "";
    for (let i = 0; i < 8; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    await transporter.sendMail({
      from: "info@chatify.com",
      to: email,
      subject: "Your password has been reset successfully",
      html: `<br/> Your password has been reset successfully. <br/> Your Updated Password is : <strong> ${newPassword} </strong> <br/> Please keep it safe. <br/> <br/> Best Regards <br/> <strong>Chatify</strong>`,
    });

    return res.status(200).json({ message: "Password Reset Successful" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId });
    return res.status(200).json({
      message: "User Details",
      user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const image = await cloudinaryConfig.uploader.upload(file.path, {
      folder: "chat-app",
    });
    fs.unlinkSync(file.path);
    await User.findByIdAndUpdate(req.user.userId, {
      avatar: image.secure_url,
    });
    const updatedUser = await User.findById(req.user.userId);
    return res.status(200).json({
      message: "User Details Updated",
      user: updatedUser,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  loginUser,
  getUsers,
  forgotPassword,
  getMe,
  uploadAvatar,
};
