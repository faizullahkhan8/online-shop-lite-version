import expressAsyncHandler from "express-async-handler";
import { getLocalHeroModel } from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import fs from "fs";
import path from "path";

export const getHeroSlides = expressAsyncHandler(async (req, res, next) => {
    const HeroModel = getLocalHeroModel();
    if (!HeroModel) return next(new ErrorResponse("Hero model not found", 500));

    const slides = await HeroModel.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({ success: true, slides });
});

export const createHeroSlide = expressAsyncHandler(async (req, res, next) => {
    const HeroModel = getLocalHeroModel();
    if (!HeroModel) return next(new ErrorResponse("Hero model not found", 500));

    const data = JSON.parse(req.body.data);
    const { title, headline, subtitle, bg, accent, order } = data;

    if (!req.file) return next(new ErrorResponse("Image is required", 400));

    const slide = await HeroModel.create({
        title,
        headline,
        subtitle,
        image: req.file.path, // relative path from public
        bg,
        accent,
        order,
    });

    res.status(201).json({ success: true, slide, message: "Slide created successfully" });
});

export const updateHeroSlide = expressAsyncHandler(async (req, res, next) => {
    const HeroModel = getLocalHeroModel();
    if (!HeroModel) return next(new ErrorResponse("Hero model not found", 500));

    const { id } = req.params;
    const data = JSON.parse(req.body.data);
    const { title, headline, subtitle, bg, accent, order, isActive } = data;

    const slide = await HeroModel.findById(id);
    if (!slide) return next(new ErrorResponse("Slide not found", 404));

    if (req.file) {
        // Remove old image
        if (fs.existsSync(slide.image)) {
            fs.unlinkSync(slide.image);
        }
        slide.image = req.file.path;
    }

    slide.title = title || slide.title;
    slide.headline = headline || slide.headline;
    slide.subtitle = subtitle || slide.subtitle;
    slide.bg = bg || slide.bg;
    slide.accent = accent || slide.accent;
    slide.order = order !== undefined ? order : slide.order;
    slide.isActive = isActive !== undefined ? isActive : slide.isActive;

    await slide.save();

    res.status(200).json({ success: true, slide, message: "Slide updated successfully" });
});

export const deleteHeroSlide = expressAsyncHandler(async (req, res, next) => {
    const HeroModel = getLocalHeroModel();
    if (!HeroModel) return next(new ErrorResponse("Hero model not found", 500));

    const { id } = req.params;
    const slide = await HeroModel.findById(id);
    if (!slide) return next(new ErrorResponse("Slide not found", 404));

    // Remove image
    if (fs.existsSync(slide.image)) {
        fs.unlinkSync(slide.image);
    }

    await slide.deleteOne();

    res.status(200).json({ success: true, message: "Slide deleted successfully" });
});
