// frontend/src/features/promotions/promotions.query.js

import { useQuery } from "@tanstack/react-query";
import {
    getActiveDeals,
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
