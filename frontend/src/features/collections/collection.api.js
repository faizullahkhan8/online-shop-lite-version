import apiClient from "../../api/apiClient";

export const createCollection = async (collectionData) => {
    const isFormData = collectionData instanceof FormData;

    const response = await apiClient.post(
        "/collections/create",
        collectionData,
        isFormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined,
    );

    return response.data;
};

export const getAllCollections = async () => {
    const response = await apiClient.get("/collections/all");
    return response.data;
};

export const deleteCollection = async (id) => {
    const response = await apiClient.delete(`/collections/delete/${id}`);

    return response.data;
};

export const updateCollection = async ({ id, collectionData }) => {
    const isFormData = collectionData instanceof FormData;

    const response = await apiClient.patch(
        `/collections/update/${id}`,
        collectionData,
        isFormData
            ? { headers: { "Content-Type": "multipart/form-data" } }
            : undefined,
    );

    return response.data;
};
