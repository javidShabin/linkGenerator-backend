import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { upload } from "../middlewares/upload.middleware.js";
import { generateLink } from "../controllers/link.controller.js";
export const router = express.Router();

router.post("/generate-link", authenticate, authorize("user", "pro"), generateLink)