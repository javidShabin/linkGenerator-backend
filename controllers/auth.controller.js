import {
  userLoginValidation,
  userSignupValidation,
} from "../validators/auth.validation.js";
import TempUser from "../models/tempUser.model.js";
import userSchema from "../models/user.model.js";
import { AppError } from "../utils/AppError.js";
import { generateToken } from "../utils/generateToken.js";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";
import { generateOTP } from "../utils/otpGenerator.js";
import { sendEmail } from "../services/sendEmail.js";

// *********** Signup and login functions ****************

// Generate OTP for user signup
export const OTPgenerating = async (req, res, next) => {
  try {
    // Validate the user data first
    userSignupValidation(req.body);
    // Destructer user details from request body
    const { userName, email, password, phone, role } = req.body;
    // Find the user by email
    const isUserExist = await userSchema.findOne({ email });
    if (isUserExist) {
      return next(new AppError("User alreadyexist", 404));
    }

    // Generate 6 degit OTP
    const OTP = generateOTP();
    // Send email using utility
    await sendEmail({
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${OTP}. Please verify to complete your registration.`,
    });
  } catch (error) {
    next(error);
  }
};

// Verify the OTP and create new user
export const verifyOTP = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Login user compare password
export const loginUser = async (req, res, next) => {
  try {
  } catch (error) {}
};

// Logout user remove the token
export const logOutUser = async (req, res, next) => {
  try {
  } catch (error) {}
};
