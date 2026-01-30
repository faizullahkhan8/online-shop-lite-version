import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
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
    createProduct
);
router.patch(
    "/update/:id",
    isAuth,
    authorize(["admin"]),
    upload.single("image"),
    updateProduct
);
router.get("/all", getAllProducts);
router.delete("/delete/:id", isAuth, authorize(["admin"]), deleteProduct);
router.get("/get/:id", getProductById);

export default router;
