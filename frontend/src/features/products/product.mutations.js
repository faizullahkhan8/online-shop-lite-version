import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, updateProduct } from "./products.api";
import { productKeys } from "./product.keys";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product) => createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.list(),
            });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.list(),
            });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, product }) => {
            return updateProduct({ id, product });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.list(),
            });
        },
    });
};
