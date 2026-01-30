import { useState } from "react";
import { ORDER_ROUTES } from "../routes";
import apiClient from "../apiClient.js";
import { toast } from "react-toastify";

export const usePlaceOrder = () => {
    const [loading, setLoading] = useState();

    const placeOrder = async (orderData) => {
        try {
            setLoading(true);
            const response = await apiClient.post(
                ORDER_ROUTES.PLACE,
                orderData
            );

            if (response.data) {
                toast.success("Order placed successfully.");
                return response.data;
            }
        } catch (error) {
            let errorMessage =
                error.response.data.message ||
                "Something went wronge. try again!";
            toast.error(errorMessage);
            console.log("Error in place order: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { placeOrder, loading };
};

export const useGetAllOrder = () => {
    const [loading, setLoading] = useState();
    const getAllOrder = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(ORDER_ROUTES.GET_ALL);

            if (response.data) {
                // normalize orders: add id alias and date/totalAmount for UI
                if (Array.isArray(response.data.orders)) {
                    response.data.orders = response.data.orders.map((o) => ({
                        ...o,
                        id: o._id,
                        date: o.createdAt,
                        totalAmount: o.grandTotal ?? o.totalAmount,
                    }));
                }
                return response.data;
            }
        } catch (error) {
            let errorMessage =
                error.response.data.message ||
                "Something went wronge. try again!";
            toast.error(errorMessage);
            console.log("Error in place order: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { getAllOrder, loading };
};

export const useGetUserOrders = () => {
    const [loading, setLoading] = useState();
    const getUserOrders = async () => {
        try {
            setLoading(true);
            const response = await apiClient.get(ORDER_ROUTES.MY_ORDERS);

            if (response.data) {
                if (Array.isArray(response.data.orders)) {
                    response.data.orders = response.data.orders.map((o) => ({
                        ...o,
                        id: o._id,
                        date: o.createdAt,
                        totalAmount: o.grandTotal ?? o.totalAmount,
                    }));
                }
                return response.data;
            }
        } catch (error) {
            let errorMessage =
                error.response?.data?.message ||
                "Something went wronge. try again!";
            toast.error(errorMessage);
            console.log("Error in get user orders: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { getUserOrders, loading };
};

export const useGetOrderById = () => {
    const [loading, setLoading] = useState();
    const getOrderById = async (orderId) => {
        try {
            setLoading(true);
            const response = await apiClient.get(
                `${ORDER_ROUTES.GET_BY_ID}/${orderId}`
            );

            if (response.data && response.data.order) {
                const o = response.data.order;
                response.data.order = {
                    ...o,
                    id: o._id,
                    date: o.createdAt,
                    totalAmount: o.grandTotal ?? o.totalAmount,
                };
                return response.data;
            }
        } catch (error) {
            let errorMessage =
                error.response?.data?.message ||
                "Something went wronge. try again!";
            toast.error(errorMessage);
            console.log("Error in get order by id: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { getOrderById, loading };
};

export const useUpdateOrderStatus = () => {
    const [loading, setLoading] = useState();
    const updateOrderStatus = async ({ orderId, status }) => {
        try {
            setLoading(true);
            const response = await apiClient.patch(
                `${ORDER_ROUTES.UPDATE}/${orderId}`,
                { status }
            );

            if (response.data) return response.data;
        } catch (error) {
            let errorMessage =
                error.response?.data?.message ||
                "Something went wronge. try again!";
            toast.error(errorMessage);
            console.log("Error in update order status: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { updateOrderStatus, loading };
};

export const useDeleteOrder = () => {
    const [loading, setLoading] = useState();
    const deleteOrder = async (orderId) => {
        try {
            setLoading(true);
            const response = await apiClient.delete(
                `${ORDER_ROUTES.DELETE}/${orderId}`
            );

            if (response.data) return response.data;
        } catch (error) {
            let errorMessage =
                error.response?.data?.message ||
                "Something went wronge. try again!";
            toast.error(errorMessage);
            console.log("Error in delete order: ", error.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteOrder, loading };
};
