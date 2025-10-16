import dotenv from "dotenv";
dotenv.config();
import User from "../models/userModel.js";
import Prompt from "../models/promptModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import protect from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";

export const userRegister = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    if (!fullName || !username || !email || !password) {
      return res.status(400).json("All fiels are required");
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const newUser = new User({
      fullName: fullName,
      username: username,
      email: email,
      password: password,
    });
    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    savedUser.password = undefined;
    res.status(201).json({
      message: "User registration successfull",
      token,
      user: savedUser,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server Error!");
  }
};
export const userLogin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if ((!username && !email) || !password) {
      return res.status(400).json("Enter the necessary fields");
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
      status: "Active",
    }).select("+password");
    if (!user) {
      return res.status(400).json("Invalid Credentials");
    }
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(401).json("invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    user.password = undefined;
    res
      .status(200)
      .json({ message: "User logged in successfully", token, user });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server Error");
  }
};

export const userUpdate = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ Forbidden: "You are not authorized" });
    }

    const allowedUpdates = ["fullName", "username", "password"];
    const requestedUpdates = Object.keys(req.body);

    requestedUpdates.forEach((updateKey) => {
      if (allowedUpdates.includes(updateKey)) {
        user[updateKey] = req.body[updateKey];
      }
    });

    const updatedUser = await user.save();
    user.password = undefined;
    return res.status(200).json({
      message: "User updated succesfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server Error");
  }
};

export const userDelete = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      res.status(404).json("User not found");
    }
    if (req.user.id !== req.params.id) {
      res.status(403).json({ Forbidden: "User not authorized" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "User got deleted" });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export const statusUpdate = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = ["active", "banned", "deleted"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found!");
    }
    user.status = status;
    await user.save();
    res
      .status(200)
      .json({ message: "User status updated successsfully", user });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};
