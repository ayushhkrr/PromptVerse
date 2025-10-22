import protect from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";
import { upload } from "../middleware/multer.js";
import {
  createPrompt,
  updatePrompt,
  getPrompts,
  allApprovedPrompts,
  deletePrompts,
  updatePromptStatus,
  getPromptPreview,
} from "../controllers/promptController.js";
import express from "express";

const routes = express.Router();

routes.get("/", allApprovedPrompts);

routes.post("/create/", protect, upload.single("thumbnail"), createPrompt);

routes.patch("/:id/status", protect, adminAuth, updatePromptStatus);

routes.patch("/:id", protect, updatePrompt);

routes.get("/myprompts", protect, getPrompts);

routes.delete("/:id", protect, deletePrompts);

routes.get("/:id/preview", getPromptPreview);

export default routes;
