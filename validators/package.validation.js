import { AppError } from "../utils/AppError.js";

export const createPackageValidation = (data) => {
  const { name, price, duration, features, currency } = data;

  if (!name || !price || !duration || !features || !currency) {
    throw new AppError("All fields are required", 404);
  }
};
