import multer from "multer";
import imagekit from "../config/imagekit.js";
import FormData from "form-data";
import fetch from "node-fetch";

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images allowed"));
        }
        cb(null, true);
    },
});

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export const handleOptionalBackgroundRemoval = async (req, res, next) => {
    let isRemoveBg = false;

    // 1️⃣ Read remove flag safely
    try {
        if (req.body.data) {
            const parsed = JSON.parse(req.body.data);
            isRemoveBg =
                parsed.isRemoveBg === true || parsed.isRemoveBg === "true";
        } else {
            isRemoveBg =
                req.body.isRemoveBg === "true" || req.body.isRemoveBg === true;
        }
    } catch {
        isRemoveBg = false;
    }

    if (!req.file || !isRemoveBg) return next();

    try {
        const formData = new FormData();

        // MUST pass buffer as-is
        formData.append("image_file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": process.env.REMOVE_BG_API_KEY,
                ...formData.getHeaders(),
            },
            body: formData,
        });

        // 🚨 If error, LOG EVERYTHING
        if (!response.ok) {
            const errorText = await response.text();
            console.error("remove.bg error:", errorText);
            throw new Error(`remove.bg failed (${response.status})`);
        }

        const buffer = Buffer.from(await response.arrayBuffer());

        // 2️⃣ Overwrite original image
        req.file.buffer = buffer;
        req.file.size = buffer.length;
        req.file.mimetype = "image/png"; // remove.bg always returns PNG

        console.log("✅ Background removed successfully");
        next();
    } catch (err) {
        console.error("❌ Background removal failed:", err);
        next(); // fail-open
    }
};

export const imagekitUpload = async (req, res, next) => {
    if (!req.file) {
        return next();
    }

    try {
        const result = await imagekit.files.upload({
            file: req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
            folder: "/products",
            useUniqueFileName: true,
        });

        req.image = {
            fileId: result.fileId,
            url: result.url,
            name: result.name,
            filePath: result.filePath,
        };

        next();
    } catch (err) {
        console.error("❌ ImageKit upload failed:", err);
        return res.status(500).json({
            message: "Image upload failed",
            error: err.message,
        });
    }
};
