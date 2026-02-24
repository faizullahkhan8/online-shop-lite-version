// frontend/src/features/promotions/promotions.api.js

import apiClient from "../apiClient";

export const getActiveDeals = async () => {
    const { data } = await apiClient.get("/promotions/active");
    return data;
};

export const getPromotionHighlights = async () => {
    const { data } = await apiClient.get("/promotions/highlights");
    console.log(data, "THe promositon highlight ishere. ")
    return data;
};

export const getAllPromotions = async () => {
    const { data } = await apiClient.get("/promotions/");
    return data;
};

export const getPromotionById = async (id) => {
    const { data } = await apiClient.get(`/promotions/${id}`);
    return data;
};

export const addPromotion = async (promotionData) => {
    const { data } = await apiClient.post("/promotions/", promotionData);
    return data;
};

export const updatePromotion = async ({ id, data: body }) => {
    const { data } = await apiClient.put(`/promotions/${id}`, body);
    return data;
};

export const deletePromotion = async (id) => {
    const { data } = await apiClient.delete(`/promotions/${id}`);
    return data;
};
