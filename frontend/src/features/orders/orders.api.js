import apiClient from "../apiClient";

const normalizeOrder = (o) => ({
    ...o,
    id: o._id,
    date: o.createdAt,
    totalAmount: o.grandTotal ?? o.totalAmount,
});

export const placeOrder = async (orderData) => {
    const { data } = await apiClient.post("/orders/place-order", orderData);
    return data;
};

export const getAllOrders = async () => {
    const { data } = await apiClient.get("/orders/get-all");

    if (Array.isArray(data?.orders)) {
        data.orders = data.orders.map(normalizeOrder);
    }

    return data;
};

export const getUserOrders = async () => {
    const { data } = await apiClient.get("/orders/my-orders");

    if (Array.isArray(data?.orders)) {
        data.orders = data.orders.map(normalizeOrder);
    }

    return data;
};

export const getOrderById = async (orderId) => {
    const { data } = await apiClient.get(`/orders/${orderId}`);

    if (data?.order) {
        data.order = normalizeOrder(data.order);
    }

    return data;
};

export const getOrderByTrackingToken = async (token) => {
    const { data } = await apiClient.get(`/orders/track/${token}`);

    if (data?.order) {
        data.order = normalizeOrder(data.order);
    }

    return data;
};

export const updateOrderStatus = async ({ orderId, status }) => {
    const { data } = await apiClient.patch(`/orders/update/${orderId}`, {
        status,
    });
    return data;
};

export const updatePaymentStatus = async ({ orderId, ispaid }) => {
    const { data } = await apiClient.patch(`/orders/payment/${orderId}`, {
        ispaid,
    });
    return data;
};

export const deleteOrder = async (orderId) => {
    const { data } = await apiClient.delete(`/orders/delete/${orderId}`);
    return data;
};

export const cancelOrderItem = async ({ orderId, itemId, reason }) => {
    const { data } = await apiClient.put(
        `/orders/${orderId}/items/${itemId}/cancel`,
        { reason },
    );

    if (data?.order) {
        data.order = normalizeOrder(data.order);
    }

    return data;
};

export const cancelOrder = async ({ orderId, reason }) => {
    const { data } = await apiClient.put(`/orders/${orderId}/cancel`, {
        reason,
    });

    if (data?.order) {
        data.order = normalizeOrder(data.order);
    }

    return data;
};
