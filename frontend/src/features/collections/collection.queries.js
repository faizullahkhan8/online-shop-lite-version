import { useQuery } from "@tanstack/react-query";
import { getAllCollections } from "./collection.api";
import { collectionKeys } from "./collection.keys";

export const useCollections = () => {
    return useQuery({
        queryKey: collectionKeys.all,
        queryFn: () => getAllCollections(),
    });
};
