// frontend/src/features/promotions/promotions.query.js

import { useQuery } from "@tanstack/react-query";
import {
    getActiveDeals,
    getPromotionHighlights,
    getAllPromotions,
    getPromotionById,
} from "./promotions.api";
import { promotionKeys } from "./promotions.keys";

export const useActiveDeals = () => {
    return useQuery({
        queryKey: promotionKeys.active(),
        queryFn: getActiveDeals,
    });
};

export const usePromotionHighlights = () => {
    return useQuery({
        queryKey: promotionKeys.highlights(),
        queryFn: getPromotionHighlights,
    });
};

export const usePromotions = () => {
    return useQuery({
        queryKey: promotionKeys.lists(),
        queryFn: getAllPromotions,
    });
};

export const usePromotion = (id) => {
    return useQuery({
        queryKey: promotionKeys.detail(id),
        queryFn: () => getPromotionById(id),
        enabled: !!id,
    });
};
