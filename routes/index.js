import express from "express";
import { router as authRoutes } from "../routes/auth.routes.js";
import { router as userRoutes } from "../routes/user.routes.js";
import { router as adminRoutes } from "../routes/admin.routes.js";
import { router as linkRoutes } from "../routes/link.routes.js";
import { router as qrRoutes } from "../routes/qr.routes.js";
import { router as paymentRoutes } from "../routes/payment.routes.js";
import { router as packageRoutes } from "../routes/package.routes.js";
import {router as googleAuthRoute} from "./gAuth.routes.js"
import { router as brandingRoutes } from "../routes/branding.routes.js";


export const router = express.Router();

// Authentication routes
router.use("/auth", authRoutes);

// Profile routes
router.use("/user", userRoutes);

// Admin controlled routes
router.use("/admin", adminRoutes);

// Link controlled routes
router.use("/link", linkRoutes);

// QR code controlled routes
router.use("/qr", qrRoutes);

// Payment controlled routes
router.use("/payment", paymentRoutes)

// Package controller routes
router.use("/package", packageRoutes)

// Google auth route
router.use("/api/auth", googleAuthRoute);

// Branding routes
router.use("/branding", brandingRoutes);