import dotenv from "dotenv";
dotenv.config();
import Prompt from "../models/promptModel.js";
import Stripe from "stripe";
import Order from "../models/orderModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const createOrder = async (session) => {
  try {
    const userId = session.metadata.userId;
    const promptId = session.metadata.promptId;
    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      console.log(
        `Webhook error: Prompt not found with ID ${promptId} during order creation.`
      );
      return;
    }
    await Order.create({
      user: userId,
      prompt: promptId,
      price: prompt.price,
    });

    prompt.purchaseCount = (prompt.purchaseCount || 0) + 1;
    await prompt.save();
    console.log(
      `Webhook: Order created successfully for user ${userId}, prompt ${promptId}`
    );
  } catch (e) {
    console.error("Error fulfilling the order", e);
  }
};

export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const rawBody = req.body;
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (e) {
    console.error(`Webhook signature verification failed: ${e.stack}`);
    return res.status(400).send(`Webhook error: ${e.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    if (session.payment_status === "paid") {
      console.log(
        `Webhook: Payment successful for session ${session.id}. Fulfilling order...`
      );
      await createOrder(session);
    } else {
      console.log(
        `Webhook received: Checkout session ${session.id} completed but payment status is ${session.payment_status}.`
      );
    }
  } else {
    console.error(`Webhook received: Unhandled event type ${event.type}`);
  }

  res.status(200).json({ received: true });
};

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
