export const USER_ROUTES = {
    REGISTER: "/users/register",
    LOGIN: "/users/login",
    LOGOUT: "/users/logout",
    GET_USER: "/users/get",
    UPDATE_USER: "/users/update",
    GET_ACCESS_TOKEN: "/users/getAccessToken",
    ADD_USER_FROM_ADMIN: "/users/add",
};

export const PRODUCT_ROUTES = {
    CREATE: "/products/create",
    GET_ALL: "/products/all",
    UPDATE_PRODUCT: "/products/update",
    DELETE_PRODUCT: "/products/delete",
    GET_BY_ID: "/products/get",
};

export const COLLECTION_ROUTES = {
    CREATE: "/collections/create",
    GET_ALL: "/collections/all",
    UPDATE_COLLECTION: "/collections/update",
    DELETE_COLLECTION: "/collections/delete",
};

export const ORDER_ROUTES = {
    PLACE: "/orders/place-order",
    GET_ALL: "/orders/get-all",
    MY_ORDERS: "/orders/my-orders",
    GET_BY_ID: "/orders", // GET /orders/:id
    TRACK: "/orders/track", // GET /orders/track/:trackingToken
    UPDATE: "/orders/update", // PATCH /orders/update/:id
    DELETE: "/orders/delete", // DELETE /orders/delete/:id
    DASHBOARD_STATS: "/orders/dashboard-stats", // GET /orders/dashboard-stats
    CANCEL: "/orders", // PUT /orders/:id/cancel
};

export const WISHLIST_ROUTES = {
    GET: "/users/wishlist",
    ADD: "/users/wishlist/add",
    REMOVE: "/users/wishlist/remove",
};

export const SETTINGS_ROUTES = {
    GET: "/settings",
    UPDATE: "/settings",
};

export const PROMOTION_ROUTES = {
    CREATE: "/promotions",
    GET_ACTIVE: "/promotions/active",
    GET_ALL: "/promotions",
    UPDATE: "/promotions",
    DELETE: "/promotions",
};

export const REVIEW_ROUTES = {
    ADD: "/reviews",
    GET_BY_PRODUCT: "/reviews", // GET /reviews/:productId
};
