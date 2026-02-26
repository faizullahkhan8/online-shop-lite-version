const STORAGE_KEY = "guest_orders_v2";

export const readGuestOrders = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return {};

        const parsed = JSON.parse(raw);
        if (typeof parsed !== "object" || Array.isArray(parsed)) return {};

        return parsed;
    } catch {
        return {};
    }
};

export const addGuestOrder = (order, max = 10) => {
    try {
        console.log("passed: 1");
        console.log(order);
        if (!order?._id || !Array.isArray(order.items)) return;
        console.log("passed: 2");

        const orders = readGuestOrders();
        console.log("passed: 3");

        const normalizedOrder = {
            orderId: order._id,
            createdAt: order.createdAt,
            grandTotal: order.grandTotal,
            items: order.items.map((item) => ({
                productId: item.product?._id,
                name: item.product?.name,
                image: item.product?.images[0]?.url || null,
                quantity: item.quantity,
                unitPrice: item.price,
                totalPrice: item.totalAmount,
            })),
        };

        console.log("passed: 4");
        orders[order._id] = normalizedOrder;
        console.log("passed: 5");

        // Limit to max orders (most recent first)
        const sortedEntries = Object.entries(orders)
            .sort((a, b) => new Date(b[1].createdAt) - new Date(a[1].createdAt))
            .slice(0, max);
        console.log("passed: 6");

        const limitedOrders = Object.fromEntries(sortedEntries);
        console.log("passed: 7");

        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedOrders));
        console.log("passed: 8");
    } catch (error) {
        console.log(error);
    }
};

export const getGuestOrderById = (orderId) => {
    const orders = readGuestOrders();
    return orders[orderId] || null;
};

export const getLastGuestOrder = () => {
    const orders = readGuestOrders();

    const sorted = Object.values(orders).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    return sorted[0] || null;
};
