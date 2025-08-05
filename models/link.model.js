import mongoose from "mongoose";

const linkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    message: {
      type: String,
    },
    whatsappLink: {
      type: String,
      required: true,
    },
    shortLink: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
    brandedPageUrl: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Link", linkSchema);

