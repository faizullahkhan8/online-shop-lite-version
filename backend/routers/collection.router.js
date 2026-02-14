import { Router } from "express";
import { authorize, isAuth } from "../middlewares/auth.middleware.js";
import { upload, imagekitUpload } from "../middlewares/multer.middleware.js";
import {
    createCollection,
    getAllCollections,
    deleteCollection,
    updateCollection,
} from "../controllers/collection.controller.js";

const router = Router();
const setCollectionFolder = (req, res, next) => {
    req.imageFolder = "/collections";
    next();
};

router.post(
    "/create",
    isAuth,
    authorize(["admin"]),
    upload.single("image"),
    setCollectionFolder,
    imagekitUpload,
    createCollection,
);
router.get("/all", getAllCollections);
router.delete("/delete/:id", isAuth, authorize(["admin"]), deleteCollection);
router.patch(
    "/update/:id",
    isAuth,
    authorize(["admin"]),
    upload.single("image"),
    setCollectionFolder,
    imagekitUpload,
    updateCollection,
);

export default router;
