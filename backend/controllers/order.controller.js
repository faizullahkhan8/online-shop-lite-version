import expressAsyncHandler from "express-async-handler";
import {
    getLocalOrderModel,
    getLocalProductModel,
    getLocalUserModel,
} from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const placeOrder = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();

    if (!OrderModel || !ProductModel) {
        return next(new Error("Order model not found"));
    }

    const { items, recipient, payment, grandTotal } = req.body;

    if (items.length < 1 || !recipient || !payment || !grandTotal) {
        return next(new Error("All fields are required"));
    }

    console.log(items);

    items.forEach(async (prod) => {
        let tempProd = await ProductModel.findById(prod.product);
        console.log(tempProd);
        tempProd.stock -= prod.quantity;
        tempProd.save({ validateModifiedOnly: true });
    });

    const order = new OrderModel({
        userId: req.user._id,
        items,
        grandTotal,
        recipient,
        payment,
    });

    await order.save();

    return res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order,
    });
});

export const getAllOrder = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();

    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const allOrders = await OrderModel.find({});

    return res.status(200).json({
        success: true,
        message: "All orders fatched.",
        orders: allOrders,
    });
});

export const getUserOrders = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();

    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const orders = await OrderModel.find({ userId: req.user._id }).populate({
        path: "items.product",
        model: "Product",
    });

    return res
        .status(200)
        .json({ success: true, message: "User orders fetched.", orders });
});

export const getOrderById = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();

    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const order = await OrderModel.findById(req.params.id)
        .populate({
            path: "items.product",
            model: "Product",
        })
        .populate("userId");

    if (!order) return next(new ErrorResponse("Order not found", 404));

    return res
        .status(200)
        .json({ success: true, message: "Order fetched.", order });
});

export const updateOrderStatus = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const { status } = req.body;

    const order = await OrderModel.findById(req.params.id);
    if (!order) return next(new ErrorResponse("Order not found", 404));

    order.status = status ?? order.status;
    await order.save({ validateModifiedOnly: true });

    const populatedOrder = await OrderModel.findById(order._id)
        .populate("userId")
        .populate("items.product");

    return res.status(200).json({
        success: true,
        message: "Order updated.",
        order: populatedOrder,
    });
});

export const deleteOrder = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();

    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const order = await OrderModel.findById(req.params.id);

    if (!order) return next(new ErrorResponse("Order not found", 404));

    // only admin can delete orders
    if (req.user.role !== "admin") {
        return next(
            new ErrorResponse("Not authorized to delete this order", 403)
        );
    }

    await order.remove();

    return res.status(200).json({ success: true, message: "Order deleted." });
});

// Dashboard stats for admin
export const getDashboardStats = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();
    const UserModel = getLocalUserModel();

    if (!OrderModel || !ProductModel || !UserModel) {
        return next(new ErrorResponse("Model not found!", 400));
    }

    // Total sales (sum of grandTotal for all orders)
    const orders = await OrderModel.find({});
    const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrders = orders.length;

    console.log(totalOrders, orders);

    const totalProducts = await ProductModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();

    return res.status(200).json({
        success: true,
        stats: {
            totalSales,
            totalOrders,
            totalProducts,
            totalUsers,
        },
    });
});
