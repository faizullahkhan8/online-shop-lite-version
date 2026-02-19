export const productKeys = {
    all: ["products"],
    list: (filters) => ["products", "list", filters],
    detail: (id) => ["products", "detail", id],
};
