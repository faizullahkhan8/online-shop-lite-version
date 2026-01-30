import multer from "multer";
import fs from "fs";

const BACKEND_SERVER_IMAGE_PATH = "public/images/product-images";

// ADD THIS: Sync check to create folder if it doesn't exist
if (!fs.existsSync(BACKEND_SERVER_IMAGE_PATH)) {
    fs.mkdirSync(BACKEND_SERVER_IMAGE_PATH, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, BACKEND_SERVER_IMAGE_PATH);
    },
    filename: function (req, file, cb) {
        // Use a cleaner extension logic
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 }
});