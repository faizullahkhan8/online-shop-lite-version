const STORAGE_KEY = "guest_order_ids_v1";

export const readGuestOrders = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];

        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Ensure valid id strings
        return parsed.filter((id) => typeof id === "string");
    } catch {
        return [];
    }
};

export const addGuestOrder = (orderOrId, max = 10) => {
    try {
        const orderId =
            typeof orderOrId === "string"
                ? orderOrId
                : orderOrId && (orderOrId._id || orderOrId.id);
        if (!orderId) return;

        const current = readGuestOrders();
        const filtered = current.filter((id) => id !== orderId);
        const next = [orderId, ...filtered].slice(0, max);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        // ignore storage failures
    }
};

export const getLastGuestOrder = () => {
    const ids = readGuestOrders();
    return ids[0] || null;
};
