import { Router } from "express";
import {
    handleOptionalBackgroundRemoval,
    upload,
    imagekitUpload,
} from "../middlewares/multer.middleware.js";
import {
    createProduct,
    updateProduct,
    assignCollectionToProducts,
    deleteProduct,
    getProductById,
    uploadImages,
    deleteImage,
} from "../controllers/product.controller.js";
import { authorize, isAuth } from "../middlewares/auth.middleware.js";
import { getAllProducts } from "../controllers/product.controller.js";

const router = Router();

router.post("/create", isAuth, authorize(["admin"]), createProduct);

router.post(
    "/upload-images",
    isAuth,
    authorize(["admin"]),
    upload.array("images"),
    handleOptionalBackgroundRemoval,
    imagekitUpload,
    uploadImages,
);

router.delete("/delete-image", isAuth, authorize(["admin"]), deleteImage);

router.patch(
    "/assign-collection",
    isAuth,
    authorize(["admin"]),
    assignCollectionToProducts,
);
router.patch("/update/:id", isAuth, authorize(["admin"]), updateProduct);
router.get("/all", getAllProducts);
router.delete("/delete/:id", isAuth, authorize(["admin"]), deleteProduct);
router.get("/get/:id", getProductById);

export default router;
