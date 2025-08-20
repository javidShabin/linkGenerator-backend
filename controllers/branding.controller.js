import { success } from "../shared/response.js";
import { AppError } from "../utils/AppError.js";
import { uploadToCloudinary } from "../services/cloudinaryUpload.js";
import SiteBranding from "../models/siteBranding.model.js";

// Admin: set or update site-wide branding (applies to all users pages)
export const setSiteBranding = async (req, res, next) => {
  try {
    const { buttonColor, logoText, logoColor, textColor } = req.body;

    console.log(buttonColor, logoColor, logoText, textColor)

    // Optional: upload logo image
    let logoUrl = undefined;
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file.path);
      if (!uploadResult.success || !uploadResult.url) {
        return res.status(500).json({
          success: false,
          message: uploadResult.message || "Failed to upload logo",
        });
      }
      logoUrl = uploadResult.url;
    }

    const update = {};
    if (buttonColor !== undefined) update.buttonColor = buttonColor;
    if (logoText !== undefined) update.logoText = logoText;
    if (logoColor !== undefined) update.logoColor = logoColor;
    if (textColor !== undefined) update.textColor = textColor;
    if (logoUrl !== undefined) update.logoUrl = logoUrl;
    update.updatedBy = req.user?.id || null;

    const branding = await SiteBranding.findOneAndUpdate(
      { key: "site" },
      { $set: update, $setOnInsert: { key: "site" } },
      { upsert: true, new: true }
    );

    return success(res, branding, "Site branding updated");
  } catch (error) {
    next(error);
  }
};

// Public: get site-wide branding
export const getSiteBranding = async (req, res, next) => {
  try {
    const branding = await SiteBranding.findOne({ key: "site" }).sort({ updatedAt: -1 });;
    const data = {
      buttonColor: branding?.buttonColor ?? null,
      logoUrl: branding?.logoUrl ?? null,
      logoText: branding?.logoText ?? null,
      logoColor: branding?.logoColor ?? null,
      textColor: branding?.textColor ?? null,
    };
    return success(res, data, "Branding fetched");
  } catch (error) {
    next(error);
  }
};


