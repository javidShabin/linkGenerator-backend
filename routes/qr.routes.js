import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import {
  downloadQrcode,
  generateQrcode,
  getQrCounts,
  updateQrcode,
} from "../controllers/qr.controller.js";
export const router = express.Router();

// *******************************************************************
// ************* QR code routes ******************************************

// Generate QR code
router.post(
  "/generate-qr",
  authenticate,
  authorize("user", "pro"),
  generateQrcode
);

// Update the QR code
router.patch(
  "/update-qr",
  authenticate,
  authorize("user", "pro"),
  updateQrcode
);

// Downlod the QR code
router.get(
  "/download-qr/:id",
  authenticate,
  authorize("user", "pro"),
  downloadQrcode
);

// Get the qr generating count
router.get(
  "/getqr-counts",
  authenticate,
  authorize("user", "pro"),
  getQrCounts
);
