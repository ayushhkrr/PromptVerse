import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectdb from "./config/db.js";
import routes from "./routes/userRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


const startServer = async () => {
  await connectdb();
  app.listen(PORT, () => {
    console.log(`The server is running on PORT ${PORT}`);
  });
};

startServer();
