import express from "express"
import {router as authRoutes} from "../routes/auth.routes.js"
import { router as userRoutes } from "../routes/user.routes.js"

export const router = express.Router()

// Authentication routes
router.use("/auth", authRoutes)

// Profile routes 
router.use("/user", userRoutes)
