import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  try {
    if (token && token.startsWith("Bearer ")) {
      const auth = token.split(" ")[1];
      const userVerification = jwt.verify(auth, process.env.SECRET_KEY);
      req.user = userVerification;
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
