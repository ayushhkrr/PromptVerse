import protect from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";
import express from "express";
import { getStats } from "../controllers/adminController.js";
import {
  userRegister,
  userLogin,
  userUpdate,
  userDelete,
  statusUpdate,
  becomeSeller,
  userProfile
} from "../controllers/userController.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const routes = express.Router();

routes.post("/register", userRegister);

routes.post("/login", userLogin);

routes.patch("/become-seller", protect, becomeSeller);

routes.get('/profile', protect, userProfile)

routes.patch("/:id", protect, userUpdate);

routes.delete("/:id", protect, userDelete);

routes.patch("/:id/status", protect, adminAuth, statusUpdate);

routes.get("/stats", protect, adminAuth, getStats);

routes.get(
  "/google/auth",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

routes.get(
  "/google/auth/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login-failed`,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user.id,
        role: req.user.role,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.redirect(`${process.env.CLIENT_URL}/login-success?token=${token}`);
  }
);

export default routes;
