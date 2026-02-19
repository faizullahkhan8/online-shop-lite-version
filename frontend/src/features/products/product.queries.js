import { useQuery } from "@tanstack/react-query";
import { getProductById, getProducts } from "./products.api";
import { productKeys } from "./product.keys";

export const useProducts = (filters = {}) => {
    return useQuery({
        queryKey: productKeys.list(filters),
        queryFn: () => getProducts(filters),
    });
};

export const useProductById = (id) => {
    return useQuery({
        queryKey: productKeys.detail(id),
        queryFn: () => getProductById(id),
    });
};
