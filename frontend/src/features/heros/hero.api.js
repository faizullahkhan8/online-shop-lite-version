import apiClient from "../../api/apiClient";

export const getHeroSlides = async () => {
    const { data } = await apiClient.get("/hero");
    return data;
};

export const addHeroSlide = async (formData) => {
    const { data } = await apiClient.post("/hero", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const updateHeroSlide = async ({ id, formData }) => {
    const { data } = await apiClient.put(`/hero/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
};

export const deleteHeroSlide = async (id) => {
    const { data } = await apiClient.delete(`/hero/${id}`);
    return data;
};
