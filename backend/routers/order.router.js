import { Router } from "express";
import {
    authorize,
    isAuth,
    optionalAuth,
} from "../middlewares/auth.middleware.js";
import {
    getAllOrder,
    placeOrder,
    getUserOrders,
    getOrderById,
    getOrderByTrackingToken,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
    getDashboardStats,
    cancelOrder,
    cancelOrderItem,
    markItemReturned,
    markOrderReturned,
    markItemRefunded,
    markOrderRefunded,
    togglePaymentStatus,
} from "../controllers/order.controller.js";

const router = new Router();

router.post("/place-order", optionalAuth, placeOrder);
router.get("/get-all", isAuth, authorize("admin"), getAllOrder);

// Guest order tracking via token (PUBLIC - no auth required)
router.get("/track/:trackingToken", getOrderByTrackingToken);

// Dashboard stats (admin only) - must be above /:id
router.get("/dashboard-stats", isAuth, authorize("admin"), getDashboardStats);

router.get("/my-orders", isAuth, getUserOrders);
router.get("/:id", getOrderById);
router.patch("/update/:id", isAuth, authorize("admin"), updateOrderStatus);
router.patch("/payment/:id", isAuth, authorize("admin"), updatePaymentStatus);
router.delete("/delete/:id", isAuth, authorize("admin"), deleteOrder);

// Cancellation routes (whole order or single item)
router.put("/:id/cancel", isAuth, cancelOrder);
router.put(
    "/:id/items/:itemId/cancel",
    isAuth,
    authorize("admin"),
    cancelOrderItem,
);

// Return routes — mark physical return to seller (admin only)
// Restores stock when product comes back from customer
router.patch("/:id/return", isAuth, authorize("admin"), markOrderReturned);
router.patch(
    "/:id/items/:itemId/return",
    isAuth,
    authorize("admin"),
    markItemReturned,
);

// Refund routes — mark money returned to customer (admin only)
// Only works when payment was verified (ispaid: true)
router.patch("/:id/refund", isAuth, authorize("admin"), markOrderRefunded);
router.patch(
    "/:id/items/:itemId/refund",
    isAuth,
    authorize("admin"),
    markItemRefunded,
);

router.patch(
    "/:id/toggle-payment",
    isAuth,
    authorize("admin"),
    togglePaymentStatus,
);

export default router;
