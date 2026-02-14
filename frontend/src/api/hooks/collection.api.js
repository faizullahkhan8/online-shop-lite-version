import { useState } from "react";
import apiClient from "../apiClient";
import { COLLECTION_ROUTES } from "../routes";
import { toast } from "react-toastify";

export const useCreateCollection = () => {
    const [loading, setLoading] = useState(false);

    const createCollection = async (collectionData) => {
        try {
            setLoading(true);
            const isFormData = collectionData instanceof FormData;
            const response = await apiClient.post(
                COLLECTION_ROUTES.CREATE,
                collectionData,
                isFormData
                    ? { headers: { "Content-Type": "multipart/form-data" } }
                    : undefined,
            );

            if (response.data.success) {
                toast.success("Collection created successfully");
                return response.data;
            }
        } catch (error) {
            const ErrorMessage =
                error.response?.data?.message || "Something went wrong";
            toast.error(ErrorMessage);
            console.log("Error in Create Collection", error);
            return;
        } finally {
            setLoading(false);
        }
    };

    return { createCollection, loading };
};

export const useGetAllCollections = () => {
    const [loading, setLoading] = useState(false);

    const getAllCollections = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(COLLECTION_ROUTES.GET_ALL);

            if (response.data.success) {
                return response.data;
            }
        } catch (error) {
            const ErrorMessage =
                error.response?.data?.message || "Something went wrong";
            toast.error(ErrorMessage);
            console.log("Error in Get All Collections", error);
            return;
        } finally {
            setLoading(false);
        }
    };

    return { getAllCollections, loading };
};

export const useDeleteCollection = () => {
    const [loading, setLoading] = useState(false);

    const deleteCollection = async (id) => {
        try {
            setLoading(true);
            const response = await apiClient.delete(
                COLLECTION_ROUTES.DELETE_COLLECTION + "/" + id,
            );

            if (response.data.success) {
                toast.success("Collection deleted successfully");
                return response.data;
            }
        } catch (error) {
            const ErrorMessage =
                error.response?.data?.message || "Something went wrong";
            toast.error(ErrorMessage);
            console.log("Error in Delete Collection", error);
            return;
        } finally {
            setLoading(false);
        }
    };

    return { deleteCollection, loading };
};

export const useUpdateCollection = () => {
    const [loading, setLoading] = useState(false);

    const updateCollection = async ({ id, collectionData }) => {
        try {
            setLoading(true);
            const isFormData = collectionData instanceof FormData;
            const response = await apiClient.patch(
                COLLECTION_ROUTES.UPDATE_COLLECTION + "/" + id,
                collectionData,
                isFormData
                    ? { headers: { "Content-Type": "multipart/form-data" } }
                    : undefined,
            );

            if (response.data.success) {
                toast.success("Collection updated successfully");
                return response.data;
            }
        } catch (error) {
            const ErrorMessage =
                error.response?.data?.message || "Something went wrong";
            toast.error(ErrorMessage);
            console.log("Error in Update Collection", error);
            return;
        } finally {
            setLoading(false);
        }
    };

    return { updateCollection, loading };
};
