import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

export const router = express.Router();


// Create checkout (make a payment)

// Get the session status by session id

// Get all payments