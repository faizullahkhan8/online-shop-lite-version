const STORAGE_KEY = "guest_orders_v2";

export const readGuestOrders = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Ensure valid order objects with identifier
        return parsed.filter(
            (order) =>
                order &&
                typeof order === "object" &&
                (typeof order._id === "string" || typeof order.id === "string"),
        );
    } catch {
        return [];
    }
};

export const addGuestOrder = (order, max = 10) => {
    if (!order || typeof order !== "object") return;

    const orderId = order._id || order.id;
    if (!orderId) return;

    try {
        const current = readGuestOrders();

        const filtered = current.filter(
            (item) => (item._id || item.id) !== orderId,
        );

        const next = [order, ...filtered].slice(0, max);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // ignore storage failures
    }
};

export const getLastGuestOrder = () => {
    const orders = readGuestOrders();
    return orders[0] || null;
};
