import express from "express";
import {
    getHeroSlides,
    createHeroSlide,
    updateHeroSlide,
    deleteHeroSlide,
} from "../controllers/hero.controller.js";
import { upload, handleOptionalBackgroundRemoval } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.get("/", getHeroSlides);
router.post("/", upload.single("image"), handleOptionalBackgroundRemoval, createHeroSlide);
router.put("/:id", upload.single("image"), handleOptionalBackgroundRemoval, updateHeroSlide);
router.delete("/:id", deleteHeroSlide);

export default router;
