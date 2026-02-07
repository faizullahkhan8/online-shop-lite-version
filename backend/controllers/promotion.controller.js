import expressAsyncHandler from "express-async-handler";
import { getLocalPromotionModel } from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const addPromotion = expressAsyncHandler(async (req, res, next) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel)
        return next(new ErrorResponse("Promotion model not found", 500));

    const {
        title,
        type,
        discountType,
        discountValue,
        startTime,
        endTime,
        products,
    } = req.body;

    if (
        !title ||
        !type ||
        !discountType ||
        !discountValue ||
        !startTime ||
        !endTime
    ) {
        return next(new ErrorResponse("All fields are required", 400));
    }

    // Basic validation: end time must be after start time and in the future
    if (new Date(endTime) <= new Date(startTime)) {
        return next(
            new ErrorResponse("End time must be after start time", 400),
        );
    }

    if (new Date(endTime) <= new Date()) {
        return next(new ErrorResponse("End time must be in the future", 400));
    }

    // Determine initial status
    let status = "SCHEDULED";
    const now = new Date();
    if (now >= new Date(startTime) && now <= new Date(endTime)) {
        status = "ACTIVE";
    }

    const promotion = await PromotionModel.create({
        title,
        type,
        discountType,
        discountValue,
        startTime,
        endTime,
        products,
        status,
    });

    res.status(201).json({
        success: true,
        message: "Promotion created successfully",
        promotion,
    });
});

export const getActiveDeals = expressAsyncHandler(async (req, res, next) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel)
        return next(new ErrorResponse("Promotion model not found", 500));

    const now = new Date();
    const activePromotions = await PromotionModel.find({
        startTime: { $lte: now },
        endTime: { $gte: now },
    }).populate("products");

    res.status(200).json({
        success: true,
        count: activePromotions.length,
        data: activePromotions,
    });
});
