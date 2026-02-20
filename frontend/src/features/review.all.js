import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

/* =========================================================
   Query Keys (Scoped inside file – not exported separately)
========================================================= */

const reviewKeys = {
    all: ["reviews"],
    product: (productId) => [...reviewKeys.all, "product", productId],
};

/* =========================================================
   API Functions (Private to this file)
========================================================= */

const getProductReviewsApi = async (productId) => {
    const { data } = await apiClient.get(`/reviews/${productId}`);
    return data;
};

const addReviewApi = async (reviewData) => {
    const { data } = await apiClient.post("/reviews/", reviewData);
    return data;
};

/* =========================================================
   Queries
========================================================= */

export const useProductReviews = (productId) => {
    return useQuery({
        queryKey: reviewKeys.product(productId),
        queryFn: () => getProductReviewsApi(productId),
        enabled: !!productId,
        select: (data) => data?.reviews || [],
    });
};

/* =========================================================
   Mutations
========================================================= */

export const useAddReview = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addReviewApi,
        onSuccess: (data, variables) => {
            toast.success("Review submitted successfully");

            // Invalidate the specific product reviews
            queryClient.invalidateQueries({
                queryKey: reviewKeys.product(variables.productId),
            });
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message || "Something went wrong";
            toast.error(message);
        },
    });
};
