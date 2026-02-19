import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createCollection,
    deleteCollection,
    updateCollection,
} from "./collection.api";
import { collectionKeys } from "./collection.keys";

export const useCreateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ collectionData }) => createCollection(collectionData),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: collectionKeys.all,
            });
        },
    });
};

export const useDeleteCollection = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id }) => deleteCollection(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: collectionKeys.all,
            });
        },
    });
};

export const useUpdateCollection = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, collectionData }) =>
            updateCollection({ id, collectionData }),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: collectionKeys.all,
            });
        },
    });
};
