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
        image,
        products,
    } = req.body;

    if (
        !title ||
        !type ||
        !discountType ||
        !discountValue ||
        !startTime ||
        !endTime ||
        !image?.fileId
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

    // New promotions are created deactivated by default; admin must activate explicitly.
    let status = "INACTIVE";

    const promotion = await PromotionModel.create({
        title,
        type,
        discountType,
        discountValue,
        startTime,
        endTime,
        image,
        products,
        status,
    });

    // Do NOT auto-activate or deactivate other promotions on create.

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
        status: "ACTIVE",
    })
        .sort({ order: 1 })
        .populate("products");

    res.status(200).json({
        success: true,
        count: activePromotions.length,
        data: activePromotions,
    });
});

export const getPromotionHighlights = expressAsyncHandler(
    async (req, res, next) => {
        const PromotionModel = getLocalPromotionModel();
        if (!PromotionModel)
            return next(new ErrorResponse("Promotion model not found", 500));

        const now = new Date();

        const activePromotion = await PromotionModel.findOne({
            startTime: { $lte: now },
            endTime: { $gte: now },
            status: "ACTIVE",
        })
            .sort({ order: 1, startTime: 1 })
            .populate("products");

        const nextUpcomingPromotion = await PromotionModel.findOne({
            startTime: { $gt: now },
            endTime: { $gt: now },
            status: { $nin: ["CANCELLED", "EXPIRED"] },
            ...(activePromotion?._id ? { _id: { $ne: activePromotion._id } } : {}),
        })
            .sort({ startTime: 1, order: 1 })
            .populate("products");

        res.status(200).json({
            success: true,
            activePromotion: activePromotion || null,
            nextUpcomingPromotion: nextUpcomingPromotion || null,
        });
    },
);

export const getAllPromotions = expressAsyncHandler(async (req, res, next) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel)
        return next(new ErrorResponse("Promotion model not found", 500));

    const promotions = await PromotionModel.find()
        .sort({ order: 1 })
        .populate("products");

    res.status(200).json({
        success: true,
        count: promotions.length,
        promotions,
    });
});

export const getPromotionById = expressAsyncHandler(async (req, res, next) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel)
        return next(new ErrorResponse("Promotion model not found", 500));

    const { id } = req.params;
    const promotion = await PromotionModel.findById(id).populate("products");

    if (!promotion) {
        return next(new ErrorResponse("Promotion not found", 404));
    }

    res.status(200).json({
        success: true,
        promotion,
    });
});

export const updatePromotion = expressAsyncHandler(async (req, res, next) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel)
        return next(new ErrorResponse("Promotion model not found", 500));

    const { id } = req.params;
    let promotion = await PromotionModel.findById(id);

    if (!promotion) {
        return next(new ErrorResponse("Promotion not found", 404));
    }

    // Handle reordering specifically if passing multiple items
    // But for single update:
    promotion = await PromotionModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    // If request attempted to set this promotion ACTIVE, ensure no other ACTIVE promotion exists.
    // Require admin to manually deactivate the existing active promotion first.
    const incomingStatus = req.body?.status;
    if (incomingStatus === "ACTIVE") {
        const otherActive = await PromotionModel.findOne({
            status: "ACTIVE",
            _id: { $ne: promotion._id },
        });
        if (otherActive) {
            return next(
                new ErrorResponse(
                    `Another promotion (${otherActive._id}) is already ACTIVE. Deactivate it before activating this promotion.`,
                    409,
                ),
            );
        }
    }

    res.status(200).json({
        success: true,
        promotion,
    });
});

export const deletePromotion = expressAsyncHandler(async (req, res, next) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel)
        return next(new ErrorResponse("Promotion model not found", 500));

    const { id } = req.params;
    const promotion = await PromotionModel.findById(id);

    if (!promotion) {
        return next(new ErrorResponse("Promotion not found", 404));
    }

    await promotion.deleteOne();

    res.status(200).json({
        success: true,
        message: "Promotion deleted successfully",
    });
});
