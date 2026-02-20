import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";
import { toast } from "react-toastify";

/* =========================================================
   Query Keys (Scoped)
========================================================= */

const settingsKeys = {
    all: ["settings"],
};

/* =========================================================
   API Functions (Private)
========================================================= */

const getSettingsApi = async () => {
    const { data } = await apiClient.get("/settings");
    return data;
};

const updateSettingsApi = async (settings) => {
    const { data } = await apiClient.put("/settings", settings);
    return data;
};

/* =========================================================
   Query
========================================================= */

export const useSettings = () => {
    return useQuery({
        queryKey: settingsKeys.all,
        queryFn: getSettingsApi,
    });
};

/* =========================================================
   Mutation
========================================================= */

export const useUpdateSettings = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateSettingsApi,
        onSuccess: () => {
            toast.success("Settings updated.");
            queryClient.invalidateQueries({
                queryKey: settingsKeys.all,
            });
        },
        onError: (error) => {
            const message =
                error?.response?.data?.message || "Failed to update settings";
            toast.error(message);
        },
    });
};
