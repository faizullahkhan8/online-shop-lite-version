import multer from "multer";
import imagekit from "../config/imagekit.js";
import FormData from "form-data";
import fetch from "node-fetch";

// Updated to allow up to 10 images
export const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images allowed"), false);
        }
        cb(null, true);
    },
});

// export const handleOptionalBackgroundRemoval = async (req, res, next) => {
//     let isRemoveBg = false;

//     // Check flag (handling both JSON string and direct body)
//     try {
//         const data = req.body.data ? JSON.parse(req.body.data) : req.body;
//         isRemoveBg = data.isRemoveBg === true || data.isRemoveBg === "true";
//     } catch {
//         isRemoveBg = false;
//     }

//     // If no files or flag is false, skip
//     const files = req.files?.length ? req.files : req.file ? [req.file] : [];
//     if (!files.length || !isRemoveBg) return next();
//     // if (!req.files || req.files.length === 0 || !isRemoveBg) return next();

//     try {
//         // Process all images in parallel
//         await Promise.all(
//             req.files.map(async (file) => {
//                 const formData = new FormData();
//                 formData.append("image_file", file.buffer, {
//                     filename: file.originalname,
//                     contentType: file.mimetype,
//                 });
//                 formData.append("size", "auto");

//                 const response = await fetch(
//                     "https://api.remove.bg/v1.0/removebg",
//                     {
//                         method: "POST",
//                         headers: {
//                             "X-Api-Key": process.env.REMOVE_BG_API_KEY,
//                             ...formData.getHeaders(),
//                         },
//                         body: formData,
//                     },
//                 );

//                 if (response.ok) {
//                     const buffer = Buffer.from(await response.arrayBuffer());
//                     file.buffer = buffer;
//                     file.size = buffer.length;
//                     file.mimetype = "image/png";
//                 } else {
//                     const errorText = await response.text();
//                     console.error(
//                         `remove.bg error for ${file.originalname}:`,
//                         errorText,
//                     );
//                     // We don't throw error here so other images can still proceed
//                 }
//             }),
//         );

//         console.log("✅ Background removal processed for all images");
//         next();
//     } catch (err) {
//         console.error("❌ Background removal process failed:", err);
//         next(); // Fail-open: proceed with original images
//     }
// };

// export const imagekitUpload = async (req, res, next) => {
//     const files = req.files?.length ? req.files : req.file ? [req.file] : [];

//     console.log("The image kit is here and started.", req.files)
//     if (!files.length) return next();
//     console.log(req.files, "THe files in image kit")
//     try {
//         const folder = req.imageFolder || "/products";

//         // Map files to ImageKit upload promises
//         const uploadPromises = req.files.map((file) =>
//             imagekit.files.upload({
//                 file: file.buffer.toString("base64"),
//                 fileName: file.originalname,
//                 folder,
//                 useUniqueFileName: true,
//             }),
//         );

//         const results = await Promise.all(uploadPromises);

//         // Store array of image objects in req.images (plural)
//         // req.images = results.map((result) => ({
//         //     fileId: result.fileId,
//         //     url: result.url,
//         //     name: result.name,
//         //     filePath: result.filePath,
//         // }));

//         // next();


//         const mapped = results.map((result) => ({
//             fileId: result.fileId,
//             url: result.url,
//             name: result.name,
//             filePath: result.filePath,
//         }));

//         req.images = mapped;
//         req.image = mapped[0]; // ✅ single image bhi set karo
//         next();
//     } catch (err) {
//         console.error("❌ ImageKit bulk upload failed:", err);
//         return res.status(500).json({
//             message: "Image upload failed",
//             error: err.message,
//         });
//     }
// };




export const handleOptionalBackgroundRemoval = async (req, res, next) => {
    let isRemoveBg = false;

    try {
        const data = req.body.data ? JSON.parse(req.body.data) : req.body;
        isRemoveBg = data.isRemoveBg === true || data.isRemoveBg === "true";
    } catch {
        isRemoveBg = false;
    }

    const files = req.files?.length ? req.files : req.file ? [req.file] : [];
    if (!files.length || !isRemoveBg) return next();

    try {
        await Promise.all(
            files.map(async (file) => {  // ✅ req.files ki jagah files
                const formData = new FormData();
                formData.append("image_file", file.buffer, {
                    filename: file.originalname,
                    contentType: file.mimetype,
                });
                formData.append("size", "auto");

                const response = await fetch(
                    "https://api.remove.bg/v1.0/removebg",
                    {
                        method: "POST",
                        headers: {
                            "X-Api-Key": process.env.REMOVE_BG_API_KEY,
                            ...formData.getHeaders(),
                        },
                        body: formData,
                    },
                );

                if (response.ok) {
                    const buffer = Buffer.from(await response.arrayBuffer());
                    file.buffer = buffer;
                    file.size = buffer.length;
                    file.mimetype = "image/png";
                } else {
                    const errorText = await response.text();
                    console.error(`remove.bg error for ${file.originalname}:`, errorText);
                }
            }),
        );

        // ✅ req.file bhi update karo agar single file thi
        if (req.file && files[0]) {
            req.file.buffer = files[0].buffer;
            req.file.size = files[0].size;
            req.file.mimetype = files[0].mimetype;
        }

        console.log("✅ Background removal processed");
        next();
    } catch (err) {
        console.error("❌ Background removal process failed:", err);
        next();
    }
};








export const imagekitUpload = async (req, res, next) => {
    const files = req.files?.length ? req.files : req.file ? [req.file] : [];

    if (!files.length) return next();

    try {
        const folder = req.imageFolder || "/products";

        const uploadPromises = files.map((file) =>  // ✅ req.files ki jagah files
            imagekit.files.upload({
                file: file.buffer.toString("base64"),
                fileName: file.originalname,
                folder,
                useUniqueFileName: true,
            }),
        );

        const results = await Promise.all(uploadPromises);

        const mapped = results.map((result) => ({
            fileId: result.fileId,
            url: result.url,
            name: result.name,
            filePath: result.filePath,
        }));

        req.images = mapped;
        req.image = mapped[0];
        next();
    } catch (err) {
        console.error("❌ ImageKit bulk upload failed:", err);
        return res.status(500).json({
            message: "Image upload failed",
            error: err.message,
        });
    }
};



