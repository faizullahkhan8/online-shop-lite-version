export const orderKeys = {
    all: ["orders"],
    lists: () => [...orderKeys.all, "list"],
    list: (filters) => [...orderKeys.lists(), { filters }],
    details: () => [...orderKeys.all, "detail"],
    detail: (id) => [...orderKeys.details(), id],
    tracking: (token) => [...orderKeys.all, "tracking", token],
};
