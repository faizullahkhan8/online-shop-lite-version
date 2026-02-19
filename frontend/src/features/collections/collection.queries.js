import { useQuery } from "@tanstack/react-query";
import { getAllCollections } from "./collection.api";

export const useCollections = () => {
    return useQuery({
        queryKey: ["collections"],
        queryFn: () => getAllCollections(),
    });
};
