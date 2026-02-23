import apiClient from "../apiClient";

export const createProduct = async (product) => {
    const response = await apiClient.post("/products/create", product);
    return response.data;
};

export const getProducts = async (filters = {}) => {
    const response = await apiClient.get("/products/all", { params: filters });
    return response.data;
};

export const getProductById = async (id) => {
    const response = await apiClient.get(`/products/get/${id}`);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await apiClient.delete(`/products/delete/${id}`);
    return response.data;
};

export const updateProduct = async ({ id, product }) => {
    const response = await apiClient.patch(`/products/update/${id}`, product);
    return response.data;
};

export const assignCollectionToProducts = async ({
    collectionId,
    productIds,
}) => {
    const response = await apiClient.patch("/products/assign-collection", {
        collectionId,
        productIds,
    });
    return response.data;
};
