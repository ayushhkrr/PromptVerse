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
    category: {
      type: String, //(in which category the prompt falls ex:- ChatGpt , midjourney)
      required: true,
    },
    promptType: {
      type: String,
      enum: ["text", "image"],
      required: [true, "Prompt type is required (text or image)"],
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
  },
  { timestamps: true }
);

const Prompt = mongoose.model("Prompts", promptSchema);

export default Prompt;
