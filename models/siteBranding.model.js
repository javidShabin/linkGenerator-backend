import mongoose from "mongoose";

const siteBrandingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "site",
    },
    buttonColor: {
      type: String,
      default: null,
    },
    logoUrl: {
      type: String,
      default: null,
    },
    logoText: {
      type: String,
      default: null,
    },
    logoColor: {
      type: String,
      default: null,
    },
    textColor: {
      type: String,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

siteBrandingSchema.index({ key: 1 }, { unique: true });

export default mongoose.model("SiteBranding", siteBrandingSchema);


