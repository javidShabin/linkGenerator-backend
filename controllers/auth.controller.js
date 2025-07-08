import {
  resetPasswordValidation,
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
import { regex } from "../shared/regex.js";

// ***************************** Signup and login functions ********************************
// ******************************************************************************************

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

    const user = {
      // User details
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

// *********** Login user ****************
// Login user compare password
export const loginUser = async (req, res, next) => {
  try {
    // Validate the user email and password
    userLoginValidation(req.body);
    // Destructure email and password from request body
    const { email, password } = req.body;
    // Check the user is singuped using the email
    const isUser = await userSchema.findOne({ email });
    // User not signuped throw error
    if (!isUser) {
      return next(
        new AppError(
          "No account found with this email. Please sign up first.",
          400
        )
      );
    }

    // Check if user is blocked
    if (isUser.isActive === false) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Contact support.",
        redirect:
          "https://link-generator-frontend-rust.vercel.app/account-blocked",
      });
    }
    // Compare the password
    const passwordIsMatch = await comparePassword(password, isUser.password);
    if (!passwordIsMatch) {
      return next(new AppError("Invalid email or password", 401));
    }
    // Save the last login time
    isUser.lastLogin = new Date();
    await isUser.save();

    // Generate the user token by JWT using id , email and role
    const token = generateToken({
      id: isUser.id,
      email: isUser.email,
      role: isUser.role,
    });
    res.cookie("userToken", token, {
      // Store the token in cookie
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    const user = {
      // User details
      id: isUser._id,
      userName: isUser.userName,
      email: isUser.email,
      role: isUser.role,
    };

    // Send a response
    success(res, user, "User created successfully");
  } catch (error) {
    next(error);
  }
};

// Logout user remove the token
export const logOutUser = async (req, res, next) => {
  try {
    // Clear the userToken cookie
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    // Use your success response utility
    success(res, null, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};

// ************************************ Password functionalities***********************************
// *********************************************************************************************

// *************** OTP for password********************
// Generate OTP for password changing
export const generateForgotPasswordOtp = async (req, res, next) => {
  try {
    // Destructure the email from request body
    const { email } = req.body;
    // Check email is present or not
    if (!email) {
      return next(new AppError("Email is require", 400));
    }
    // Validate the email using regex
    if (!regex.email.test(email)) {
      return next(new AppError("Invalid email format", 400));
    }
    // Find user by email
    const user = await userSchema.findOne({ email });
    // throw error if not any user with the email
    if (!user) {
      return next(new AppError("User not found with this email", 404));
    }
    // Generate 6 degit OTP
    const OTP = generateOTP();
    // Send the OTP to user email
    await sendEmail({
      to: email,
      subject: "OTP for Password Reset",
      text: `Your OTP for resetting password is ${OTP}. It will expire in 10 minutes.`,
    });
    // Store the OTP and expire time in tempuser
    await TempUser.findOneAndUpdate(
      { email },
      {
        email,
        OTP,
        otpExpiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      },
      { upsert: true, new: true }
    );
    // Send the response
    success(res, { email }, "OTP sent to your email for password reset.");
  } catch (error) {
    next(error);
  }
};

// ********************Verifiying the OTP *************************
// Verify the OTP and change update new password
export const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    
    resetPasswordValidation(req.body);
    
  } catch (err) {
    
    next(err);
  }
};
