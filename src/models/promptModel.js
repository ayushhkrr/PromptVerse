import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId, //this is the link between the promt and the user who it belongs to
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    promptType: {
      type: String,
      enum: ["text", "image"],
      required: [true, "the type of prompt is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    thumbnail: {
      public_id: {
        type: String, //(Related to Cloudinary platform)
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    sampleInput: {
      type: String,
      required: [true, "A sample input is required to generate the preview"],
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, "A description is required"],
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    tags: {
      type: [String],
      index: true,
      set: (tags) =>
        Array.isArray(tags) ? tags.map((tag) => tag.toLowerCase().trim()) : [],
    },
  },
  { timestamps: true }
);

const Prompt = mongoose.model("Prompt", promptSchema);

export default Prompt;
