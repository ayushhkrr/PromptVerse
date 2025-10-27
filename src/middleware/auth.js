import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token && token.startsWith("Bearer ")) {
      const auth = token.split(" ")[1];
      const userVerification = jwt.verify(auth, process.env.SECRET_KEY);
      const user = await User.findById(userVerification.id);
      if (!user || user.status !== "active") {
        return res.status(401).json({ message: "User not found or inactive" });
      }
      req.user = { id: user._id, role: user.role, status: user.status };

      next();
    } else {
      res.status(401).json("Unauthorized User!");
    }
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export default protect;
