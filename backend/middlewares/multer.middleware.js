import multer from "multer";
import imagekit from "../config/imagekit.js";
import FormData from "form-data";

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images allowed"));
    }
    cb(null, true);
  }
});



const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export const handleOptionalBackgroundRemoval = async (req, res, next) => {
  let isRemoveBg = false;

  try {
    if (req.body.data) {
      const parsed = JSON.parse(req.body.data);
      isRemoveBg = parsed.isRemoveBg === true || parsed.isRemoveBg === "true";
    } else {
      isRemoveBg = req.body.isRemoveBg === "true";
    }
  } catch { }

  if (!req.file || !isRemoveBg) return next();

  try {
    const formData = new FormData();
    formData.append("image_file", req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });
    formData.append("size", "auto");

    const response = await fetch(
      "https://api.remove.bg/v1.0/removebg",
      {
        method: "POST",
        headers: {
          "X-Api-Key": REMOVE_BG_API_KEY
        },
        body: formData
      }
    );

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`remove.bg failed: ${text}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    // 🔁 Replace original buffer
    req.file.buffer = buffer;

    next();
  } catch (err) {
    console.error("Background removal failed:", err.message);
    next(); // fail-open (upload original image)
  }
};




export const imagekitUpload = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const result = await imagekit.files.upload({
      file: req.file.buffer.toString("base64"),
      fileName: req.file.originalname,
      folder: "/products",
      useUniqueFileName: true
    });

    req.image = {
      fileId: result.fileId,
      name: result.name,
      url: result.url,
      filePath: result.filePath
    };

    next();
  } catch (err) {
    res.status(500).json({
      message: "ImageKit upload failed",
      error: err.message
    });
  }
};
