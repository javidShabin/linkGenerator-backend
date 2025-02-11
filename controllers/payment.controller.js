import dotenv from "dotenv";
dotenv.config();
import userSchema from "../models/user.model.js";
import stripe from "../configs/stripe.config.js";
import paymentSchema from "../models/payment.model.js";
import { AppError } from "../utils/AppError.js";