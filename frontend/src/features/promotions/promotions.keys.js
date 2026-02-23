// frontend/src/features/promotions/promotions.keys.js

export const promotionKeys = {
    all: ["promotions"],
    lists: () => [...promotionKeys.all, "list"],
    active: () => [...promotionKeys.all, "active"],
    highlights: () => [...promotionKeys.all, "highlights"],
    details: () => [...promotionKeys.all, "detail"],
    detail: (id) => [...promotionKeys.details(), id],
};
