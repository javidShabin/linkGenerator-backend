import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  createCheckoutSession,
  getAllPaymentDetails,
  getStripeSessionDetails,
} from "../controllers/payment.controller.js";

export const router = express.Router();

// Create checkout (make a payment)
router.post(
  "/create-checkout-session",
  authenticate,
  authorize("user", "pro"),
  createCheckoutSession
);

// Get the session status by session id
router.get(
  "/session/:sessionId",
  authenticate,
  authorize("user", "pro"),
  getStripeSessionDetails
);

// Get all payments
router.get(
  "/get-payments",
  authenticate,
  authorize("admin"),
  getAllPaymentDetails
);
