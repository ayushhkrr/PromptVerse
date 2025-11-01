import mongoose from "mongoose";

const orderDetail = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    prompt: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Prompt",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderDetail);

export default Order;
