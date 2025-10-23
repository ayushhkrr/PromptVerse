import dotenv from "dotenv";
dotenv.config();
import Prompt from "../models/promptModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export const createCheckoutSession = async (req, res) => {
  try {
    const promptId = req.params.id;
    const userId = req.user.id;

    const prompt = await Prompt.findById(promptId);

    if (!prompt || prompt.status !== "approved") {
      return res
        .status(404)
        .json({ message: "Prompt not found or is not approved" });
    }

    if (prompt.user.toString() === userId) {
      return res
        .status(403)
        .json({ message: "Sellers cannot purchase their own prompt." });
    }

    if (req.user.role === "seller") {
      return res
        .status(403)
        .json({ message: "Sellers cannot purchase prompts." });
    }

    if (prompt.price <= 0) {
      return res
        .status(400)
        .json({ message: "Price cannot be negative or zero." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: prompt.title,
              images: [prompt.thumbnail.url],
            },
            unit_amount: prompt.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,

      metadata: {
        userId,
        promptId,
      },
    });
    res.status(200).json({ url: session.url });
  } catch (e) {
    console.error(e.stack);
    res.status(500).json({ message: "Server error!" });
  }
};
