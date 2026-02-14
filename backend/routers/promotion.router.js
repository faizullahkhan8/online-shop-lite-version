import express from "express";
import { isAuth, authorize } from "../middlewares/auth.middleware.js";
import {
    addPromotion,
    getActiveDeals,
    getAllPromotions,
    getPromotionById,
    updatePromotion,
    deletePromotion,
} from "../controllers/promotion.controller.js";

const router = express.Router();

// Public endpoint - guest can view active deals
router.get("/active", getActiveDeals);

// Admin-only endpoints
router.post("/", isAuth, authorize("admin"), addPromotion);
router.get("/", isAuth, authorize("admin"), getAllPromotions); // Admin
router.get("/:id", isAuth, authorize("admin"), getPromotionById); // Admin/Edit
router.put("/:id", isAuth, authorize("admin"), updatePromotion); // Admin
router.delete("/:id", isAuth, authorize("admin"), deletePromotion); // Admin

export default router;
