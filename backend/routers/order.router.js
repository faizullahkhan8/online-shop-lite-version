import { Router } from "express";
import { authorize, isAuth } from "../middlewares/auth.middleware.js";
import {
    getAllOrder,
    placeOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
    getDashboardStats,
} from "../controllers/order.controller.js";

const router = new Router();

router.post("/place-order", isAuth, placeOrder);
router.get("/get-all", isAuth, authorize("admin"), getAllOrder);

// Dashboard stats (admin only) - must be above /:id
router.get("/dashboard-stats", isAuth, authorize("admin"), getDashboardStats);

router.get("/my-orders", isAuth, getUserOrders);
router.get("/:id", isAuth, getOrderById);
router.patch("/update/:id", isAuth, authorize("admin"), updateOrderStatus);
router.delete("/delete/:id", isAuth, authorize("admin"), deleteOrder);

export default router;
