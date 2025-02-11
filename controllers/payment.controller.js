import dotenv from "dotenv";
dotenv.config();
import userSchema from "../models/user.model.js";
import stripe from "../configs/stripe.config.js";
import paymentSchema from "../models/payment.model.js";
import { AppError } from "../utils/AppError.js";

// Make payment controller
export const createCheckoutSession = async (req, res, next) => {
  try {
    // Get selected pan and email
    const { plan } = req.body;
    const email = req.user.email;

    // Find the user by email
    const user = await userSchema.findOne({ email });
    if (!user) throw new AppError("User not found", 404);

    // Check the user is already premium user or not
    if (user.isPro) {
      throw new AppError("You are already a Pro user", 400);
    }

    // Determine plan price (in paisa)
    let amount = 0;
    if (plan === "pro-plan") amount = 19900; // ₹199/year
    else if (plan === "one-time") amount = 49900; // ₹499/lifetime
    else throw new AppError("Invalid plan selected", 400);

    // Create new session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"], // optional
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `WhatsApp Tool - ${plan === "pro-plan" ? "Pro Plan" : "One-Time Plan"}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id.toString(),
        plan,
      },
      // Redirecting URLs 
      success_url: `${process.env.CLIENT_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/user/payment-cancel`,
    });

    // Srore the payment details
    await paymentSchema.create({
      userId: user._id,
      sessionId: session.id,
      amount: amount / 100, // store in rupees
      currency: "INR",
      status: "pending",
      plan,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
  }
};
