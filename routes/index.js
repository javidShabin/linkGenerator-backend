import express from "express"
import {router as userRouter} from "../routes/auth.routes.js"
export const router = express.Router()

router.use("/auth", userRouter)