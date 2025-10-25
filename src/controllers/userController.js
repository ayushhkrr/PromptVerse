import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Log from "../models/logModel.js";

export const userRegister = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
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
    try {
      await Log.create({
        user: savedUser._id,
        action: "USER_REGISTERED",
        ipAddress: req.ip,
      });
    } catch (e) {
      console.error("Failed to log the registration", e.stack);
    }
    savedUser.password = undefined;
    res.status(201).json({
      message: "User registration successful",
      token,
      user: savedUser,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server Error!" });
  }
};

export const userLogin = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: "Enter the necessary fields" });
    }
    const user = await User.findOne({
      $or: [{ username }, { email }],
      status: "active",
    }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }
    const checkPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!checkPassword) {
      return res.status(401).json({ message: "invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    try {
      await Log.create({
        user: user._id,
        action: "USER_LOGGED_IN",
        ipAddress: req.ip,
      });
    } catch (e) {
      console.error("Failed to log the Login", e.stack);
    }
    user.password = undefined;
    res
      .status(200)
      .json({ message: "User logged in successfully", token, user });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server Error" });
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
    try {
      await Log.create({
        user: updatedUser._id,
        action: "USER_UPDATED",
        ipAddress: req.ip,
      });
    } catch (e) {
      console.error("Failed to log the registration", e.stack);
    }

    updatedUser.password = undefined;
    return res.status(200).json({
      message: "User updated succesfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server Error" });
  }
};

export const userDelete = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ Forbidden: "User not authorized" });
    }
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    try {
      await Log.create({
        user: deletedUser._id,
        action: "USER_DELETED",
        ipAddress: req.ip,
        details: { deletedBy: req.user.id },
      });
    } catch (e) {
      console.error("Failed to log user deletion", e.stack);
    }
    return res.status(200).json({ message: "User got deleted" });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
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
      return res.status(404).json({ message: "User not found!" });
    }
    user.status = status;
    await user.save();
    try {
      await Log.create({
        user: user._id,
        action: "USER_STATUS_UPDATED",
        ipAddress: req.ip,
        details: { updatedBy: req.user.id },
      });
    } catch (e) {
      console.error("Failed to log user deletion", e.stack);
    }
    res.status(200).json({ message: "User status updated successfully", user });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const becomeSeller = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role === "seller" || user.role === "admin") {
      return res
        .status(400)
        .json({ message: "You are already a seller or admin" });
    }
    user.role = "seller";
    const updatedRole = await user.save();
    try {
      await Log.create({
        user: updatedRole._id,
        action: "USER_ROLE_UPDATED",
        ipAddress: req.ip,
        details: { oldRole: "buyer", newRole: "seller" },
      });
    } catch (e) {
      console.error("Failed to log user role update", e.stack);
    }
    updatedRole.password = undefined;
    res.status(200).json({
      message: "Congratulations! You became a seller.",
      user: updatedRole,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};
