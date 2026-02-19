import { useQuery } from "@tanstack/react-query";
import { getHeroSlides } from "./hero.api";
import { heroKeys } from "./hero.keys";

export const useHeroSlides = () => {
    return useQuery({
        queryKey: heroKeys.lists(),
        queryFn: getHeroSlides,
    });
};
