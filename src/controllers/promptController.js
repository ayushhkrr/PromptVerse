import Prompt from "../models/promptModel.js";
import { upload } from "../middleware/multer.js";
import { cloudinary } from "../config/cloudinary.js";
import { generatePreview } from "../Services/OpenAI.js";
import Log from "../models/logModel.js";

export const createPrompt = async (req, res) => {
  try {
    const { title, price, body, category, sampleInput, description, tags } =
      req.body;

    if (
      !title ||
      !price ||
      !body ||
      !category ||
      !sampleInput ||
      !description ||
      !tags
    ) {
      return res.status(400).json({
        message:
          "Title, price, body, sampleInput, description and category are required fields.",
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
    const tagsArray = tags ? tags.split(",").map((tag) => tag.trim()) : [];
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
      description,
      tags: tagsArray,
      user: req.user.id,
    });
    const newPrompt = await createPrompt.save();
    try {
      await Log.create({
        user: req.user.id,
        action: "PROMPT_CREATED",
        ipAddress: req.ip,
        details: { promptId: newPrompt._id },
      });
    } catch (e) {
      console.error("Failed to log created prompt", e.stack);
    }
    return res.status(201).json({
      message: "New prompt created successfully and is pending approval",
      prompt: newPrompt,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const getPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({ user: req.user.id });
    res.status(200).json(prompts);
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const allApprovedPrompts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const tag = req.query.tag;
    const skip = (page - 1) * limit;
    let filter = { status: "approved" };

    if (tag) {
      filter.tags = tag.toLowerCase();
    }

    const [prompts, totalPrompts] = await Promise.all([
      Prompt.find(filter)
        .select(
          "title price description tags sampleInput thumbnail category createdAt"
        )
        .toSorted({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prompt.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalPrompts / limit);
    res.status(200).json({
      message: "Approved prompts fetched successfully",
      data: prompts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPrompts,
        limit,
      },
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const updatePrompt = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    if (prompt.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to update prompt" });
    }
    const allowedUpdates = [
      "title",
      "body",
      "price",
      "category",
      "sampleInput",
      "description",
      "tags",
    ];
    const requestedUpdates = Object.keys(req.body);
    requestedUpdates.forEach((updateKey) => {
      if (allowedUpdates.includes(updateKey)) {
        if (updateKey === "tags" && typeof req.body.tags === "string") {
          prompt.tags = req.body.tags.split(",").map((tag) => tag.trim());
        } else {
          prompt[updateKey] = req.body[updateKey];
        }
      }
    });
    prompt.status = "pending";
    const updatedPrompt = await prompt.save();
    try {
      await Log.create({
        user: req.user.id,
        action: "PROMPT_UPDATED",
        ipAddress: req.ip,
        details: { promptId: updatedPrompt._id },
      });
    } catch (e) {
      console.error("Failed to log prompt update", e.stack);
    }
    res
      .status(200)
      .json({ message: "Prompt updated successfully", prompt: updatedPrompt });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const deletePrompts = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found" });
    }
    if (prompt.user.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete the prompt" });
    }
    const promptId = prompt.thumbnail.public_id;
    if (promptId) {
      await cloudinary.uploader.destroy(promptId);
    }
    const removePrompt = await Prompt.findByIdAndDelete(req.params.id);
    try {
      await Log.create({
        user: req.user.id,
        action: "PROMPT_DELETED",
        ipAddress: req.ip,
        details: { promptId: removePrompt._id },
      });
    } catch (e) {
      console.error("Failed to log prompt deletion", e.stack);
    }
    res.status(200).json({ message: "Prompt deleted successfully" });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const updatePromptStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const prompt = await Prompt.findById(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: "Prompt not found!" });
    }
    const allowedStatuses = ["approved", "rejected"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Enter the correct status!" });
    }
    prompt.status = status;
    const updatedPrompt = await prompt.save();
    try {
      await Log.create({
        user: req.user.id,
        action: "PROMPT_STATUS_UPDATED",
        ipAddress: req.ip,
        details: { promptId: updatedPrompt._id },
      });
    } catch (e) {
      console.error("Failed to log prompt update", e.stack);
    }
    res.status(200).json({
      message: "Prompt status got updated.",
      Prompt: updatedPrompt,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};

export const getPromptPreview = async (req, res) => {
  try {
    const prompt = await Prompt.findById(req.params.id);

    if (!prompt || prompt.status !== "approved") {
      return res
        .status(404)
        .json({ message: "Prompt not found or is not approved" });
    }

    if (!prompt.sampleInput) {
      return res.status(400).json({
        message: "This prompt does not have a sample input for preview",
      });
    }
    const aiResponse = await generatePreview(
      prompt.body,
      prompt.sampleInput,
      prompt.promptType
    );
    res.status(200).json({
      promptType: prompt.promptType,
      preview: aiResponse,
    });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};
