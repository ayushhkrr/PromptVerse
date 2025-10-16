import protect from "./auth.js";

const adminAuth = async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Requires admin access" });
  }
};

export default adminAuth;
