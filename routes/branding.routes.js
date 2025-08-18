import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { getSiteBranding, setSiteBranding } from "../controllers/branding.controller.js";

export const router = express.Router();

// Admin: set/update site-wide branding
router.patch(
  "/site",
  authenticate,
  authorize("admin"),
  upload.single("logo"),
  setSiteBranding
);

// Public: get site-wide branding
router.get("/site", getSiteBranding);


