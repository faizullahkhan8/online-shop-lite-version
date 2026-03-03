import { useQuery } from "@tanstack/react-query";
import { getAllCollections } from "./collection.api";
import { collectionKeys } from "./collection.keys";

export const useCollections = (params) => {
    return useQuery({
        queryKey: params ? [...collectionKeys.all, params] : collectionKeys.all,
        queryFn: () => getAllCollections(params),
    });
};
