import express from "express";
import {
    addPromotion,
    getActiveDeals,
} from "../controllers/promotion.controller.js";

const router = express.Router();

router.post("/", addPromotion);
router.get("/active", getActiveDeals);

export default router;
