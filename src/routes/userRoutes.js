import protect from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";
import express from "express";
import {
  userRegister,
  userLogin,
  userUpdate,
  userDelete,
  statusUpdate,
  becomeSeller,
} from "../controllers/userController.js";

const routes = express.Router();

routes.post("/register", userRegister);

routes.post("/login", userLogin);

routes.patch(":id", protect, userUpdate);

routes.patch("become-seller", protect, becomeSeller);

routes.delete("/:id", protect, userDelete);

routes.patch("/:id/status", protect, adminAuth, statusUpdate);

export default routes;
