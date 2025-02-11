import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

export const router = express.Router();

// Create checkout (make a payment)
router.post(
  "/create-checkout-session",
  authenticate,
  authorize("user", "pro"),
  createCheckoutSession
);

// Get the session status by session id

// Get all payments
