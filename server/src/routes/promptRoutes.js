import protect from "../middleware/auth.js";
import adminAuth from "../middleware/admin.js";
import { upload } from "../middleware/multer.js";
import {
  createPrompt,
  updatePrompt,
  getPrompts,
  allApprovedPrompts,
  getAllPromptsAdmin,
  deletePrompts,
  updatePromptStatus,
  getPromptPreview,
} from "../controllers/promptController.js";
import express from "express";

const routes = express.Router();

routes.get("/", allApprovedPrompts);

routes.get("/admin/all", protect, adminAuth, getAllPromptsAdmin);

routes.post("/create", protect, upload.single("thumbnail"), createPrompt);

routes.get("/myprompts", protect, getPrompts);

routes.delete("/:id", protect, deletePrompts);

routes.patch("/:id/status", protect, adminAuth, updatePromptStatus);

routes.patch("/:id", protect, updatePrompt);

routes.get("/:id/preview", getPromptPreview);

export default routes;
