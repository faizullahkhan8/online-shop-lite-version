// frontend/src/features/promotions/promotions.api.js

import apiClient from "../apiClient";
import { PROMOTION_ROUTES } from "../../api/routes";

export const getActiveDeals = async () => {
    const { data } = await apiClient.get(PROMOTION_ROUTES.GET_ACTIVE);
    return data;
};

export const getAllPromotions = async () => {
    const { data } = await apiClient.get(PROMOTION_ROUTES.GET_ALL);
    return data;
};

export const getPromotionById = async (id) => {
    const { data } = await apiClient.get(`${PROMOTION_ROUTES.GET_ALL}/${id}`);
    return data;
};

export const addPromotion = async (promotionData) => {
    const { data } = await apiClient.post(
        PROMOTION_ROUTES.CREATE,
        promotionData,
    );
    return data;
};

export const updatePromotion = async ({ id, data: body }) => {
    const { data } = await apiClient.put(
        `${PROMOTION_ROUTES.UPDATE}/${id}`,
        body,
    );
    return data;
};

export const deletePromotion = async (id) => {
    const { data } = await apiClient.delete(`${PROMOTION_ROUTES.DELETE}/${id}`);
    return data;
};
