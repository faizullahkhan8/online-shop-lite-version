import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    assignCollectionToProducts,
    createProduct,
    deleteProduct,
    updateProduct,
} from "./products.api";
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

export const useAssignCollectionToProducts = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ collectionId, productIds }) =>
            assignCollectionToProducts({ collectionId, productIds }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: productKeys.all,
            });
        },
    });
};
