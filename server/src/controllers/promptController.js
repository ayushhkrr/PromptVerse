import Prompt from "../models/promptModel.js";
import { upload } from "../middleware/multer.js";
import { cloudinary } from "../config/cloudinary.js";
import { generatePreview } from "../Services/OpenAI.js";
import Log from "../models/logModel.js";

export const createPrompt = async (req, res) => {
  try {
    const {
      title,
      price,
      body,
      sampleInput,
      description,
      tags,
      promptType,
    } = req.body;

    if (
      !title ||
      !price ||
      !body ||
      !sampleInput ||
      !description ||
      !tags ||
      !promptType
    ) {
      return res.status(400).json({
        message:
          "Title, price, body, sampleInput, description, tags, and promptType are required fields.",
      });
    }

    if (!body.includes("{INPUT}")) {
      return res.status(400).json({
        message: "Prompt body must contain the {INPUT} placeholder for preview",
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
      promptType,
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
    res.status(200).json({ prompts });
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
          "title price description tags sampleInput thumbnail createdAt"
        )
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prompt.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(totalPrompts / limit);
    res.status(200).json({
      message: "Approved prompts fetched successfully",
      prompts: prompts,
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

export const getAllPromptsAdmin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const [prompts, totalPrompts] = await Promise.all([
      Prompt.find()
        .populate('user', 'fullName email username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Prompt.countDocuments(),
    ]);

    const totalPages = Math.ceil(totalPrompts / limit);
    res.status(200).json({
      message: "All prompts fetched successfully",
      prompts: prompts,
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

    if (prompt.user.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ message: "User not authorized to update prompt" });
    }
    const allowedUpdates = [
      "title",
      "body",
      "price",
      "sampleInput",
      "description",
      "tags",
      "promptType",
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
    if (!prompt.body || !prompt.body.includes("{INPUT}")) {
      return res.status(400).json({
        message:
          "Prompt body must contain the {INPUT} placeholder for previews.",
      });
    }
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
    if (prompt.user.toString() !== req.user.id.toString()) {
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

    if (!prompt) {
      console.error(`Prompt not found: ${req.params.id}`);
      return res.status(404).json({ message: "Prompt not found" });
    }

    if (prompt.status !== "approved") {
      console.error(`Prompt not approved: ${req.params.id}, status: ${prompt.status}`);
      return res.status(403).json({ message: "Prompt is not approved yet" });
    }

    if (!prompt.sampleInput) {
      return res.status(400).json({
        message: "This prompt does not have a sample input for preview",
      });
    }

    console.log(`Generating preview for prompt: ${prompt.title}`);
    const aiResponse = await generatePreview(
      prompt.body,
      prompt.sampleInput,
      prompt.promptType
    );

    res.status(200).json({
      prompt: prompt,
      preview: aiResponse,
    });
  } catch (e) {
    console.error('Error in getPromptPreview:', e.stack);
    return res.status(500).json({ message: "Server error!", error: e.message });
  }
};
