// import apiClient from "./apiClient";
// // <-- your pre-configured axios instance

// // ===============================
// // Upload Multiple Images
// // ===============================
// export const uploadMultipleImages = async (formData) => {
//     try {
//         const { data } = await apiClient.post(
//             "/products/upload-images",
//             formData,
//             {
//                 headers: {
//                     "Content-Type": "multipart/form-data",
//                 },
//             },
//         );

//         return data;
//     } catch (error) {
//         throw normalizeError(error);
//     }
// };

// // ===============================
// // Delete Uploaded Image
// // ===============================
// export const deleteUploadImage = async (imageData) => {
//     try {
//         const { data } = await apiClient.delete(`/products/delete-image`, {
//             data: imageData,
//         });

//         return data;
//     } catch (error) {
//         throw normalizeError(error);
//     }
// };

// // ===============================
// // Error Normalizer
// // ===============================
// const normalizeError = (error) => {
//     if (error.response?.data?.message) {
//         return new Error(error.response.data.message);
//     }

//     if (error.message) {
//         return new Error(error.message);
//     }

//     return new Error("Something went wrong");
// };

import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

/* =========================================================
   API Functions (Private)
========================================================= */

const uploadMultipleImagesApi = async (formData) => {
    const { data } = await apiClient.post("/products/upload-images", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return data;
};

const deleteUploadImageApi = async (imageData) => {
    const { data } = await apiClient.delete("/products/delete-image", {
        data: imageData,
    });
    return data;
};

/* =========================================================
   Mutations
========================================================= */

export const useUploadMultipleImages = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: uploadMultipleImagesApi,
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });
            toast.success("Images uploaded successfully");
            return data;
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Upload failed";
            toast.error(message);
            console.error("Upload Images Error:", error);
        },
    });
};

export const useDeleteUploadImage = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteUploadImageApi,
        onSuccess: (data) => {
            toast.success("Image deleted successfully");

            // Optional: invalidate product queries if needed
            queryClient.invalidateQueries({
                queryKey: ["products"],
            });

            return data;
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message ||
                error?.message ||
                "Delete failed";
            toast.error(message);
            console.error("Delete Image Error:", error);
        },
    });
};
