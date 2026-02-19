import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addHeroSlide, updateHeroSlide, deleteHeroSlide } from "./hero.api";
import { heroKeys } from "./hero.keys";
import { toast } from "react-toastify";

export const useAddHeroSlide = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => addHeroSlide(data),
        onSuccess: (data) => {
            toast.success(data?.message || "Slide added successfully");
            queryClient.invalidateQueries({
                queryKey: heroKeys.lists(),
            });
        },
    });
};

export const useUpdateHeroSlide = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }) => updateHeroSlide({ id, formData }),
        onSuccess: (data) => {
            toast.success(data?.message || "Slide updated successfully");
            queryClient.invalidateQueries({
                queryKey: heroKeys.lists(),
            });
        },
    });
};

export const useDeleteHeroSlide = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => deleteHeroSlide(id),
        onSuccess: (data) => {
            toast.success(data?.message || "Slide deleted successfully");
            queryClient.invalidateQueries({
                queryKey: heroKeys.lists(),
            });
        },
    });
};
