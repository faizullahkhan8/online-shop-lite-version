export const heroKeys = {
    all: ["hero"],
    lists: () => [...heroKeys.all, "list"],
    details: () => [...heroKeys.all, "detail"],
    detail: (id) => [...heroKeys.details(), id],
};
