// Debug script to check thumbnail data in database
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Prompt from "./src/models/promptModel.js";

const checkThumbnails = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const prompts = await Prompt.find().limit(5);

    console.log("\n=== THUMBNAIL DATA ===");
    console.log(`Total prompts: ${await Prompt.countDocuments()}`);
    console.log("\nFirst 5 prompts thumbnail data:");

    prompts.forEach((prompt, index) => {
      console.log(`\n${index + 1}. ${prompt.title}`);
      console.log(`   Thumbnail public_id: ${prompt.thumbnail?.public_id}`);
      console.log(`   Thumbnail URL: ${prompt.thumbnail?.url}`);
      console.log(`   URL type: ${typeof prompt.thumbnail?.url}`);
      console.log(`   URL starts with https: ${prompt.thumbnail?.url?.startsWith('https')}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

checkThumbnails();
