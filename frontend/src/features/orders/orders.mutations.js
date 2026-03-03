import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    placeOrder,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    cancelOrderItem,
    cancelOrder,
    markItemReturned,
    markOrderReturned,
    markItemRefunded,
    markOrderRefunded,
    togglePaymentStatus,
} from "./orders.api";
import { orderKeys } from "./orders.keys";
import { toast } from "react-toastify";

export const usePlaceOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: placeOrder,
        onSuccess: (data) => {
            toast.success("Order placed successfully.");
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useUpdateOrderStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrderStatus,
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useUpdatePaymentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updatePaymentStatus,
        onSuccess: (_, { orderId }) => {
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useDeleteOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteOrder,
        onSuccess: () => {
            toast.success("Order deleted successfully.");
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useCancelOrderItem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelOrderItem,
        onSuccess: (_, { orderId }) => {
            toast.success("Order item cancelled.");
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useCancelOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: cancelOrder,
        onSuccess: (_, { orderId }) => {
            toast.success("Order cancelled.");
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

const makeReturnRefundHook = (mutationFn, successMsg) => () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn,
        onSuccess: (_, { orderId }) => {
            toast.success(successMsg);
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};

export const useMarkItemReturned = makeReturnRefundHook(
    markItemReturned,
    "Item return status updated.",
);
export const useMarkOrderReturned = makeReturnRefundHook(
    markOrderReturned,
    "Order return status updated.",
);
export const useMarkItemRefunded = makeReturnRefundHook(
    markItemRefunded,
    "Item refund status updated.",
);
export const useMarkOrderRefunded = makeReturnRefundHook(
    markOrderRefunded,
    "Order refund status updated.",
);

export const useTogglePaymentStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: togglePaymentStatus,
        onSuccess: (_, { orderId }) => {
            toast.success("Payment status toggled.");
            queryClient.invalidateQueries({
                queryKey: orderKeys.detail(orderId),
            });
            queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
        },
    });
};
