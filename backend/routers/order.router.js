import { Router } from "express";
import { authorize, isAuth } from "../middlewares/auth.middleware.js";
import {
    checkoutLimiter,
    trackingLimiter,
} from "../middlewares/rateLimiters.js";
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
} from "../controllers/order.controller.js";

const router = new Router();

router.post("/place-order", checkoutLimiter, placeOrder);
router.get("/get-all", isAuth, authorize("admin"), getAllOrder);

// Guest order tracking via token (PUBLIC - no auth required) with rate limiting
router.get("/track/:trackingToken", trackingLimiter, getOrderByTrackingToken);

// Dashboard stats (admin only) - must be above /:id
router.get("/dashboard-stats", isAuth, authorize("admin"), getDashboardStats);

router.get("/my-orders", isAuth, getUserOrders);
router.get("/:id", getOrderById);
router.patch("/update/:id", isAuth, authorize("admin"), updateOrderStatus);
router.patch("/payment/:id", isAuth, authorize("admin"), updatePaymentStatus);
router.delete("/delete/:id", isAuth, authorize("admin"), deleteOrder);

// Cancellation routes
router.put("/:id/cancel", isAuth, cancelOrder);
router.put(
    "/:id/items/:itemId/cancel",
    isAuth,
    authorize("admin"),
    cancelOrderItem,
);

export default router;
