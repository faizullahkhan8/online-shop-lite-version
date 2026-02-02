import { Router } from "express";
import {
    handleOptionalBackgroundRemoval,
    upload,
} from "../middlewares/multer.middleware.js";
import {
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
} from "../controllers/product.controller.js";
import { authorize, isAuth } from "../middlewares/auth.middleware.js";
import { getAllProducts } from "../controllers/product.controller.js";

const router = Router();

router.post(
    "/create",
    isAuth,
    authorize(["admin"]),
    upload.single("image"),
    handleOptionalBackgroundRemoval,
    createProduct,
);
router.patch(
    "/update/:id",
    isAuth,
    authorize(["admin"]),
    upload.single("image"),
    handleOptionalBackgroundRemoval,
    updateProduct,
);
router.get("/all", getAllProducts);
router.delete("/delete/:id", isAuth, authorize(["admin"]), deleteProduct);
router.get("/get/:id", getProductById);

export default router;
