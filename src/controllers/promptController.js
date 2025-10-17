import Prompt from "../models/promptModel.js";
import User from "../models/userModel.js";
import { upload } from "../middleware/multer.js";
import { cloudinary } from "../config/cloudinary.js";

export const createPrompt = async (req, res) => {
  try {
    const { title, price, body, category, sampleInput } = req.body;

    if (!title || !price || !body || !category) {
      return res
        .status(400)
        .json({
          message: "Title, price, body, and category are required fields.",
        });
    }

    if (req.user.role !== "seller") {
      return res
        .status(403)
        .json({ Forbidden: "Only the seller can create prompt" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Thumbnail image is required" });
    }
    const createPrompt = new Prompt({
      title,
      price,
      thumbnail: {
        public_id: req.file.filename,
        url: req.file.path,
      },
      body,
      sampleInput,
      category,
      user: req.user.id,
    });
    const newPrompt = await createPrompt.save();
    return res.status(201).json({
      message: "New prompt created successfully and is pending approval",
      prompt: newPrompt,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export const getPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ user: req.user.id });
    res.status(200).json(prompts);
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export const allApprovedPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ status: "approved" });
    res.status(200).json(prompts);
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json("Prompt not found");
    }
    if (prompt.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ warning: "User not authorized to update prompt" });
    }
    const allowedUpdates = [
      "title",
      "body",
      "price",
      "category",
      "thumbnail",
      "sampleInput",
    ];
    const requestedUpdates = Object.keys(req.body);
    requestedUpdates.forEach((updateKey) => {
      if (allowedUpdates.includes(updateKey)) {
        prompt[updateKey] = req.body[updateKey];
      }
    });
    prompt.status = "pending";
    const updatedPrompt = await prompt.save();
    res
      .status(200)
      .json({ message: "Prompt updated successfully", prompt: updatedPrompt });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export const deletePrompts = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json("Prompt not found");
    }
    if (prompt.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ Forbidden: "User not authorized to delete the prompt" });
    }
    const promptId = prompt.thumbnail.public_id;
    if (promptId) {
      await cloudinary.uploader.destroy(publicId);
    }
    const removePrompt = await Prompt.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};

export const updatePropmtStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json("Prompt not found!");
    }
    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Enter the correct status!" });
    }
    prompt.status = status;
    const updatedPrompt = await prompt.save();
    res.status(200).json({
      message: "Prompt status got updated.",
      Prompt: updatedPrompt,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json("Server error!");
  }
};
