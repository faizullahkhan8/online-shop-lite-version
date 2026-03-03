import { getLocalPromotionModel } from "../config/localDb.js";

export const getEffectivePrice = async (productId, basePrice) => {
    const PromotionModel = getLocalPromotionModel();
    if (!PromotionModel) return { price: basePrice, promotion: null };

    const now = new Date();

    const activePromotion = await PromotionModel.findOne({
        products: { $in: [productId] },
        startTime: { $lte: now },
        endTime: { $gte: now },
        status: "ACTIVE",
    }).sort({ order: 1 });

    if (!activePromotion) {
        return { price: basePrice, promotion: null };
    }

    let effectivePrice = basePrice;
    if (activePromotion.discountType === "PERCENTAGE") {
        effectivePrice =
            basePrice - (basePrice * activePromotion.discountValue) / 100;
    } else if (activePromotion.discountType === "FIXED_AMOUNT") {
        effectivePrice = basePrice - activePromotion.discountValue;
    }

    effectivePrice = Math.max(0, effectivePrice);

    return {
        price: effectivePrice,
        promotion: {
            id: activePromotion._id,
            title: activePromotion.title,
            type: activePromotion.type,
            discountType: activePromotion.discountType,
            discountValue: activePromotion.discountValue,
        },
    };
};
