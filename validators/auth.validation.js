
// ********************** Authentication validations ***************************

import { AppError } from "../utils/AppError";
import { regex } from "../shared/regex.js";

// User signup validation
export const userSignupValidation = (data) => {
  // Destructer user details from the data
  const { userName, email, password, confirmPassword, phone } = data;
  // Check the required fileds are present or not
  if (!userName || !email || !password || !confirmPassword || !phone) {
    throw new AppError("All fields are required", 400);
  }

  // Compare the password and confirmPassword
  if (password !== confirmPassword) {
    throw new AppError("Password and confirm password do not match", 400);
  }

  // Email validation by the regex
  if (!regex.email.test(email)) {
    throw new AppError("Invalid email format", 400);
  }
  // Phone number validation
  if (!regex.phone.test(phone)) {
    throw new AppError("Invalid phone number", 400);
  }
  // Validate the password strength
  if (!regex.password.test(password)) {
    throw new AppError("Password must be 6–16 characters, include uppercase, lowercase, number, and special character", 400);
  }
};

// User loign validation
export const userLoginValidation = (data) => {
  // Destructer user email and password from data
  const { email, password } = data;
  if (!email || !password) {
    throw new AppError("Email and password is required", 400);
  }
};