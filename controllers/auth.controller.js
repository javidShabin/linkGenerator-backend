import {
  userLoginValidation,
  userSignupValidation,
} from "../validators/auth.validation.js";
import TempUser from "../models/tempUser.model.js"
import userSchema from "../models/user.model.js"
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendEmail } from "../services/sendEmail.js";

// *********** Signup and login functions ****************

// Generate OTP for user signup
export const OTPgenerating = async (req, res, next) => {
  try {
   
    res.send("Tesing request")
  } catch (error) {
    
  }
}

// Verify the OTP and create new user
export const verifyOTP = async (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
}

// Login user compare password
export const loginUser = async (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
}

// Logout user remove the token
export const logOutUser = async (req, res, next) => {
  try {
    
  } catch (error) {
    
  }
}