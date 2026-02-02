import multer from "multer";
import fs from "fs";
import path from "path";

const BACKEND_SERVER_IMAGE_PATH = "public/images/product-images";
const REMOVE_BG_API_KEY = "jmDbtt3JyAwgvXpkMxAhxT84";

if (!fs.existsSync(BACKEND_SERVER_IMAGE_PATH)) {
    fs.mkdirSync(BACKEND_SERVER_IMAGE_PATH, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, BACKEND_SERVER_IMAGE_PATH);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = file.originalname.split(".").pop();
        cb(null, `${file.fieldname}-${uniqueSuffix}.${ext}`);
    },
});

export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

export const handleOptionalBackgroundRemoval = async (req, res, next) => {
    let isRemoveBg = false;

    try {
        if (req.body.data) {
            const parsedData = JSON.parse(req.body.data);
            isRemoveBg =
                parsedData.isRemoveBg === true ||
                parsedData.isRemoveBg === "true";
        } else {
            isRemoveBg = req.body.isRemoveBg === "true";
        }
    } catch (e) {
        console.error("Error parsing metadata:", e);
    }

    if (!req.file || !isRemoveBg) {
        return next();
    }

    try {
        const filePath = path.resolve(req.file.path);
        const formData = new FormData();

        formData.append(
            "image_file",
            new Blob([fs.readFileSync(filePath)]),
            req.file.filename,
        );
        formData.append("size", "auto");

        const response = await fetch("https://api.remove.bg/v1.0/removebg", {
            method: "POST",
            headers: { "X-Api-Key": REMOVE_BG_API_KEY },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                `Remove.bg API failed: ${JSON.stringify(errorData)}`,
            );
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        fs.writeFileSync(filePath, buffer);

        next();
    } catch (error) {
        console.error("Background removal error:", error);
        next();
    }
};
