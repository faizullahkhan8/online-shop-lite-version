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
    },
});

const REMOVE_BG_API_KEY = process.env.REMOVE_BG_API_KEY;

export const handleOptionalBackgroundRemoval = async (req, res, next) => {
    console.log("entred");
    let isRemoveBg = false;

    // 1. Determine if removal is requested
    try {
        if (req.body.data) {
            const parsed = JSON.parse(req.body.data);
            isRemoveBg = String(parsed.isRemoveBg) === "true";
        } else {
            isRemoveBg = String(req.body.isRemoveBg) === "true";
        }
    } catch (e) {
        console.warn(
            "Failed to parse request data for background removal flags.",
        );
    }

    // 2. Short-circuit if not needed
    console.log("isRemoveBg is ", isRemoveBg);
    if (!req.file || !isRemoveBg) return next();
    console.log("isRemoveBg is ", isRemoveBg);

    try {
        const formData = new FormData();
        // Pass the buffer directly with options
        formData.append("image_file", req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });
        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: {
                "X-Api-Key": process.env.REMOVE_BG_API_KEY,
                ...formData.getHeaders(), // IMPORTANT: Includes the boundary
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                `remove.bg API error: ${response.status} - ${JSON.stringify(errorData)}`,
            );
        }

        // 3. Update the request object
        const arrayBuffer = await response.arrayBuffer();
        req.file.buffer = Buffer.from(arrayBuffer);

        // Update size to reflect the new, usually smaller file
        req.file.size = req.file.buffer.length;

        console.log("Background removed successfully.");
        next();
    } catch (err) {
        console.error("Background removal bypassed due to error:", err.message);
        // Fail-open: Proceed with original image if API fails
        next();
    }
};
export const imagekitUpload = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const result = await imagekit.files.upload({
            file: req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
            folder: "/products",
            useUniqueFileName: true,
        });

        req.image = {
            fileId: result.fileId,
            name: result.name,
            url: result.url,
            filePath: result.filePath,
        };

        next();
    } catch (err) {
        res.status(500).json({
            message: "ImageKit upload failed",
            error: err.message,
        });
    }
};
