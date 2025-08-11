import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    price: { type: Number, required: true }, // store in rupees
    duration: { type: String, enum: ["lifetime", "per year", "per month"], required: true },
    features: { type: [String], default: [] },
    currency: { type: String, default: "INR" },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

packageSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Package", packageSchema);
