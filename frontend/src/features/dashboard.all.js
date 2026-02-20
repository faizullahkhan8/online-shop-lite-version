import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient";

export const useDashboardStats = ({ startDate, endDate } = {}) => {
    return useQuery({
        queryKey: ["dashboard-stats", startDate, endDate],
        queryFn: async () => {
            const response = await apiClient.get("/orders/dashboard-stats", {
                params: {
                    startDate: startDate?.toISOString(),
                    endDate: endDate?.toISOString(),
                },
            });
            return response.data;
        },
        enabled: !!startDate && !!endDate,
    });
};
