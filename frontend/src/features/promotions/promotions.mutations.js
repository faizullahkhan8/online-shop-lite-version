// frontend/src/features/promotions/promotions.mutations.js

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    addPromotion,
    updatePromotion,
    deletePromotion,
} from "./promotions.api";
import { promotionKeys } from "./promotions.keys";
import { toast } from "react-toastify";

export const useAddPromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addPromotion,
        onSuccess: (data) => {
            toast.success(data?.message || "Promotion created successfully");
            queryClient.invalidateQueries({
                queryKey: promotionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: promotionKeys.active(),
            });
        },
    });
};

export const useUpdatePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePromotion,
        onSuccess: (data) => {
            toast.success(data?.message || "Promotion updated successfully");
            queryClient.invalidateQueries({
                queryKey: promotionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: promotionKeys.active(),
            });
        },
    });
};

export const useDeletePromotion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePromotion,
        onSuccess: (data) => {
            toast.success(data?.message || "Promotion deleted successfully");
            queryClient.invalidateQueries({
                queryKey: promotionKeys.lists(),
            });
            queryClient.invalidateQueries({
                queryKey: promotionKeys.active(),
            });
        },
    });
};
