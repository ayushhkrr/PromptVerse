import protect from "../middleware/auth.js";
import express from "express";
import {
  getMyPurchasedPrompt,
  handleStripeWebhook,
  createCheckoutSession,
} from "../controllers/orderController.js";

const routes = express.Router();

routes.post("/webhook", handleStripeWebhook);

routes.get("/prompts", protect, getMyPurchasedPrompt);

routes.post("/checkout/:id", protect, createCheckoutSession);

export default routes;
