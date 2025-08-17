import QRCodeSchema from "../models/qr.model.js";
import userSchema from "../models/user.model.js"
import QRCode from "qrcode";
import Jimp from "jimp";
import { uploadToCloudinary } from "../services/cloudinaryUpload.js";
import linkSchema from "../models/link.model.js";
import { AppError } from "../utils/AppError.js";
import { success } from "../shared/response.js";
import { MESSAGES } from "../shared/constants.js";

// *********************************************************************
// ********************* QR code generating and updating controllers*****************

// Generate QR code
export const generateQrcode = async (req, res, next) => {
  try {
    // Get the user from authenticatino
    const userId = req.user.id;
    // Get slug from request params
    const { slug } = req.params;
    // Find the associated link
    const link = await linkSchema.findOne({ slug });
    if (!link) {
      return next(new AppError("Link not found", 404));
    }
    const whatsappLink = link.whatsappLink;
    if (!whatsappLink) {
      return next(new AppError("WhatsApp link not found in Link model", 400));
    }

    // Check if QR code already exists
    let qrCode = await QRCodeSchema.findOne({
      userId,
      linkId: link._id,
      generatedFor: "whatsappLink",
    });
    // Check the user is pro or not
    const isProUser = await userSchema.findById(userId)
    if (isProUser.isPro == false) {
      return next(new AppError("Your not premium user, please update your profile", 400))
    }
    // Not found qr image with the details generate qr image
    if (!qrCode) {
      const qrCodeImage = await QRCode.toDataURL(whatsappLink);
      // Save the details incluting qr image
      qrCode = await QRCodeSchema.create({
        userId,
        linkId: link._id,
        whatsappLink,
        qrCodeImage,
        generatedFor: "whatsappLink",
        generatedCount: 1, // initialize with 1
      });
    } else {
      // Increment generatedCount
      qrCode.generatedCount += 1;
      await qrCode.save();
    }

    // Send respose to client
    success(res, qrCode, MESSAGES.QR_SUCCESS);
  } catch (error) {
    next(error);
  }
};

// Update the QR code
export const updateQrcode = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { foregroundColor = "#000000", backgroundColor = "#ffffff" } = req.body;

    // Find the QR by id
    const qr = await QRCodeSchema.findById(id);
    if (!qr) return next(new AppError("QR code not found", 404));

    // Verify ownership
    if (req.user.id !== qr.userId.toString()) {
      return next(new AppError("Unauthorized", 401));
    }

    // Keep existing logo unless a new one is uploaded
    let logoUrl = qr.logoUrl;
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

    // Generate new QR code with colors
    const qrBuffer = await QRCode.toBuffer(qr.whatsappLink, {
      color: {
        dark: foregroundColor,
        light: backgroundColor,
      },
      margin: 2,
      width: 500,
    });

    let finalImage = await Jimp.read(qrBuffer);

    // Add logo if available
    if (logoUrl) {
      const logo = await Jimp.read(logoUrl);
      logo.resize(finalImage.bitmap.width * 0.2, finalImage.bitmap.height * 0.2);
      finalImage.composite(
        logo,
        (finalImage.bitmap.width - logo.bitmap.width) / 2,
        (finalImage.bitmap.height - logo.bitmap.height) / 2
      );
    }

    // Convert to Base64 and update DB
    const finalBase64 = await finalImage.getBase64Async(Jimp.MIME_PNG);
    qr.qrCodeImage = finalBase64;
    qr.foregroundColor = foregroundColor;
    qr.backgroundColor = backgroundColor;
    qr.logoUrl = logoUrl;
    await qr.save();

    res.status(200).json({
      success: true,
      message: "QR code updated successfully",
      data: qr,
    });
  } catch (error) {
    next(error);
  }
};


// *********************************************************
// ************* Download QR code *********

// Download QR code (svg, png, jpg, jpeg)
export const downloadQrcode = async (req, res, next) => {
  try {
    // Get qr id from the params
    const { id } = req.params;
    const { format = "png" } = req.query; // accept svg, png, jpg, jpeg

    // Find QR code by id
    const qr = await QRCodeSchema.findById(id);
    if (!qr) return next(new AppError("QR code not found", 404));

    const validFormats = ["svg", "png", "jpg", "jpeg"];
    if (!validFormats.includes(format.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Invalid format. Supported formats: ${validFormats.join(", ")}`,
      });
    }

    // Prepare file name
    const fileName = `qr-code-${id}.${format}`;

    if (format === "svg") {
      // Regenerate SVG QR code on the fly
      const svgString = await QRCode.toString(qr.whatsappLink, { type: "svg" });
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
      return res.send(svgString);
    } else {
      // For PNG, JPG, JPEG serve or convert base64 PNG stored

      // Extract base64 string from data URL
      const base64Data = qr.qrCodeImage.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, "base64");

      // Load with Jimp for possible conversion
      const image = await Jimp.read(imgBuffer);

      if (format === "png") {
        const buffer = await image.getBufferAsync(Jimp.MIME_PNG);
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        return res.send(buffer);
      } else {
        // JPG/JPEG conversion
        const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
        res.setHeader("Content-Type", "image/jpeg");
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
        return res.send(buffer);
      }
    }
  } catch (error) {
    next(error);
  }
};

// Get the QR code count
export const getQrCounts = async (req, res, next) => {
  try {
  } catch (error) {}
};
