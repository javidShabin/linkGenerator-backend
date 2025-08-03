import express from "express"
import {router as userRouter} from "../routes/user.routes.js"
export const router = express.Router()

router.use("/user", userRouter)