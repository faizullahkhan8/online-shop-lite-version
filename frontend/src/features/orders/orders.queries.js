import { useQuery } from "@tanstack/react-query";
import {
    getAllOrders,
    getUserOrders,
    getOrderById,
    getOrderByTrackingToken,
} from "./orders.api";
import { orderKeys } from "./orders.keys";

export const useOrders = () =>
    useQuery({
        queryKey: orderKeys.lists(),
        queryFn: getAllOrders,
    });

// this is not required in this project yet
export const useUserOrders = () =>
    useQuery({
        queryKey: [...orderKeys.lists(), "user"],
        queryFn: getUserOrders,
    });

export const useOrderById = (id) =>
    useQuery({
        queryKey: orderKeys.detail(id),
        queryFn: () => getOrderById(id),
        enabled: !!id,
    });

export const useOrderTracking = (token) =>
    useQuery({
        queryKey: orderKeys.tracking(token),
        queryFn: () => getOrderByTrackingToken(token),
        enabled: !!token,
    });
