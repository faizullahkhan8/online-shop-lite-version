import express from "express";
import {
    addReview,
    getProductReviews,
} from "../controllers/review.controller.js";

const router = express.Router();

router.get("/:productId", getProductReviews);
router.post("/", addReview);

export default router;
