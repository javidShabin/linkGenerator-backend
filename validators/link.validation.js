import { AppError } from "../utils/AppError.js";
import { regex } from "../shared/regex.js";

// ************************************************************
// ***************** Link validation function ********************

// Link generating validation
export const linkGeneratingValidation = (data) => {
  // Destructure the details from the data
  const { phone, message } = data;
  // Check the details is present or not
  if (!phone || !message) {
    throw new AppError("Phone number and message is required", 400);
  }

  // Phone number validation
  if (!regex.phone.test(phone)) {
    throw new AppError("Invalid phone number", 400);
  }
};
