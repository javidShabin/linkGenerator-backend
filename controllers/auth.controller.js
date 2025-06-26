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
import { success } from "../shared/response.js";

// *********** Signup and login functions ****************

// *********** Generate OTP ****************
// Generate OTP for user signup
export const OTPgenerating = async (req, res, next) => {
  try {
    // Validate the user data first
    userSignupValidation(req.body);
    // Destructure user details from request body
    const { userName, email, password, phone, role } = req.body;
    // Find the user by email
    const isUserExist = await userSchema.findOne({ email });
    if (isUserExist) {
      return next(new AppError("User already exist", 404));
    }

    // Generate 6 degit OTP
    const OTP = generateOTP();
    // Send email using utility
    await sendEmail({
      to: email,
      subject: "Your OTP for Registration",
      text: `Your OTP is ${OTP}. Please verify to complete your registration.`,
    });
    // Hash the user password 10 round salting using bcrypt
    const hashedPassword = await hashPassword(password);

    const OTP_VALIDITY_DURATION = 10 * 60 * 1000; // 10 minutes
    const OTP_EXPIRE_TIME = Date.now() + OTP_VALIDITY_DURATION;
    // Save or update temporary user data with OTP
    await TempUser.findOneAndUpdate(
      { email },
      {
        email,
        password: hashedPassword,
        otp: OTP, // store OTP
        otpExpiresAt: OTP_EXPIRE_TIME, // OTP expires in 10 minutes
        userName, // Store name
        phone, // Store phone
        role,
      },
      { upsert: true, new: true } // Create new or update existing
    );

    // If user created the send success response
    success(res, { email }, "OTP sent to your email successfully");
  } catch (error) {
    next(error);
  }
};

// *********** OTP verirification ****************
// Verify the OTP and create new user
export const verifyOTP = async (req, res, next) => {
  try {
    // Destructure email and OTP from request body
    const { email, otp } = req.body;
    if (!email || !otp) {
      return next(new AppError("Email and OTP are required", 400));
    }
    // Find the temporary user from database using email
    const tempUser = await TempUser.findOne({ email });

    // Check the temporary user is present or not
    if (!tempUser) {
      return next(new AppError("User not found", 404));
    }

    // Check the OTP is valid or not
    if (tempUser.otp !== otp) {
      return next(new AppError("Invalid", 400));
    }

    // Check the OTP expire or not (10 minutes)
    if (tempUser.otpExpiresAt < Date.now()) {
      return next(new AppError("OTP has expired", 400));
    }

    // Create new user
    const newUser = new userSchema({
      userName: tempUser.userName,
      phone: tempUser.phone,
      email: tempUser.email,
      password: tempUser.password,
      role: tempUser.role,
    });

    // Save the details in database
    await newUser.save();

    // Generate the token using JWT
    const token = generateToken({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    // Save the token in cookie
    res.cookie("userToken", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    await tempUser.deleteOne({ email }); // cleanup temp user

    const user = { // User details
      id: newUser._id,
      userName: newUser.userName,
      email: newUser.email,
      role: newUser.role,
    };

    // Send a response
    success(res, user, "User created successfully");
  } catch (error) {
    next(error);
  }
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
