import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectdb from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import promptRoutes from "./routes/promptRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { handleStripeWebhook } from "./controllers/orderController.js";
import cors from "cors";
import passport from "passport";
import "./config/googleAuth.js";

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(passport.initialize());

app.post(
  "/api/v1/orders/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/prompts", promptRoutes);
app.use("/api/v1/orders", orderRoutes);

const startServer = async () => {
  await connectdb();
  app.listen(PORT, () => {
    console.log(`The server is running on PORT ${PORT}`);
  });
};

startServer();
