import dotenv from "dotenv";
dotenv.config();
import userSchema from "../models/user.model.js";
import stripe from "../configs/stripe.config.js";
import paymentSchema from "../models/payment.model.js";
import packageSchema from "../models/package.model.js";
import { AppError } from "../utils/AppError.js";

// Make payment controller
export const createCheckoutSession = async (req, res, next) => {
  try {
    // Get selected pan and email
    const { planId } = req.body;
    const email = req.user.email;

    // Find the selected package
    const selectedPlan = await packageSchema.findById(planId);
    // Find the user by email
    const user = await userSchema.findOne({ email });
    if (!user) throw new AppError("User not found", 404);

    // Check the user is already premium user or not
    if (user.isPro) {
      throw new AppError("You are already a Pro user", 400);
    }

    // Determine plan price (in paisa)
    let amount = selectedPlan.price * 100;

    // Create new session
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"], // optional
      line_items: [
        {
          price_data: {
            currency: selectedPlan.currency.toLowerCase(),
            product_data: {
              name: `WhatsApp Tool - ${selectedPlan.name}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user._id.toString(),
        planId: selectedPlan._id.toString(),
      },
      // Redirecting URLs
      success_url: `${process.env.CLIENT_URL}/user/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/user/payment-cancel`,
    });

    // Srore the payment details
    await paymentSchema.create({
      userId: user._id,
      sessionId: session.id,
      amount: selectedPlan.price,
      currency: selectedPlan.currency,
      status: "pending",
      plan: selectedPlan.name,
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    next(err);
    console.log(err)
  }
};

// Get the session details
export const getStripeSessionDetails = async (req, res, next) => {
  try {
    // Fetch session from Stripe using sessionId from URL
    const session = await stripe.checkout.sessions.retrieve(
      req.params.sessionId
    );

    // Validate session first
    if (!session || session.payment_status !== "paid") {
      throw new AppError("Invalid or unpaid session.", 400);
    }

    // Extract metadata
    const userId = session.metadata?.userId;
    const plan = session.metadata?.plan;

    // 1. Update payment record
    const existingPayment = await paymentSchema.findOneAndUpdate(
      { sessionId: session.id },
      { status: true }, // mark payment as successful
      { new: true }
    );

    // 2. Update user isPro status
    if (userId) {
      await userSchema.findByIdAndUpdate(userId, { isPro: true, role: "pro" });
    }

    // 3. Respond with payment details
    res.status(200).json({
      amount: session.amount_total / 100,
      currency: session.currency,
      status: session.payment_status,
      plan: plan,
      paymentUpdated: existingPayment ? true : false,
    });
  } catch (err) {
    next(err);
    console.error("Stripe session fetch failed:", err.message);
  }
};

// Get all payment details
export const getAllPaymentDetails = async (req, res, next) => {
  try {
    const getAllPayments = await paymentSchema
      .find({})
      .populate("userId", " email userName");

    if (!getAllPayments || getAllPayments.length === 0) {
      throw new AppError("Payment details not available", 404);
    }

    res.status(200).json({
      message: "Payment details fetched",
      data: getAllPayments,
    });
  } catch (error) {
    next(error);
  }
};
