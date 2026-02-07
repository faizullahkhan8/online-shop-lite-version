import expressAsyncHandler from "express-async-handler";
import {
    getLocalOrderModel,
    getLocalProductModel,
    getLocalUserModel,
} from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { getEffectivePrice } from "../utils/promotionHelper.js";

export const placeOrder = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();
    const UserModel = getLocalUserModel();

    if (!OrderModel || !ProductModel || !UserModel) {
        return next(new Error("Order model not found"));
    }

    const {
        items,
        recipient,
        payment,
        userId,
        taxAmount,
        shippingFee,
        shippingMethod,
        status,
    } = req.body;

    if (!Array.isArray(items) || items.length < 1 || !recipient || !payment) {
        return next(new Error("All fields are required"));
    }

    if (
        !recipient.name ||
        !recipient.street ||
        !recipient.city ||
        !recipient.phone
    ) {
        return next(new ErrorResponse("Recipient fields are required", 400));
    }

    if (!payment.method) {
        return next(new ErrorResponse("Payment method is required", 400));
    }

    // Normalize and validate items with current promotional prices
    let normalizedItems;
    try {
        normalizedItems = await Promise.all(
            items.map(async (item) => {
                const quantity = Number(item.quantity) || 0;
                const tempProd = await ProductModel.findById(item.product);
                if (!tempProd) {
                    throw new ErrorResponse(
                        `Product not found: ${item.product}`,
                        404,
                    );
                }

                // SECURITY: Re-calculate the price on server side
                const { price: effectivePrice } = await getEffectivePrice(
                    tempProd._id,
                    tempProd.price,
                );

                if (quantity <= 0) {
                    throw new ErrorResponse(
                        "Item quantity must be greater than 0",
                        400,
                    );
                }

                return {
                    product: item.product,
                    quantity,
                    price: effectivePrice,
                    totalAmount: effectivePrice * quantity,
                };
            }),
        );
    } catch (error) {
        return next(error);
    }

    let orderUserId = req.user?._id;
    if (req.user?.role === "admin" && userId) {
        const userExists = await UserModel.findById(userId);
        if (!userExists) {
            return next(new ErrorResponse("User not found", 404));
        }
        orderUserId = userId;
    }

    // Process stock and sold count
    for (const prod of normalizedItems) {
        const tempProd = await ProductModel.findById(prod.product);
        tempProd.stock -= prod.quantity;
        tempProd.sold += prod.quantity;
        await tempProd.save({ validateModifiedOnly: true });
    }

    const itemsTotal = normalizedItems.reduce(
        (sum, item) => sum + item.totalAmount,
        0,
    );
    const computedTax = Number(taxAmount) || 0;
    const computedShipping = Number(shippingFee) || 0;
    if (computedTax < 0 || computedShipping < 0) {
        return next(
            new ErrorResponse("Tax and shipping must be valid amounts", 400),
        );
    }
    const computedGrandTotal = itemsTotal + computedTax + computedShipping;

    const order = new OrderModel({
        userId: orderUserId,
        items: normalizedItems,
        taxAmount: computedTax,
        shippingFee: computedShipping,
        shippingMethod,
        grandTotal: computedGrandTotal,
        recipient,
        payment,
        status: status ?? "pending",
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

    const allOrders = await OrderModel.find({ isDeleted: false });

    return res.status(200).json({
        success: true,
        message: "All orders fetched.",
        orders: allOrders,
    });
});

export const getUserOrders = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();

    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const orders = await OrderModel.find({
        userId: req.user._id,
        isDeleted: false,
    }).populate({
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

    const order = await OrderModel.findOne({
        _id: req.params.id,
        isDeleted: false,
    })
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

export const updatePaymentStatus = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    if (!OrderModel) return next(new ErrorResponse("Model not found!", 400));

    const { ispaid } = req.body;

    const order = await OrderModel.findById(req.params.id);
    if (!order) return next(new ErrorResponse("Order not found", 404));

    order.payment = {
        ...order.payment,
        ispaid: Boolean(ispaid),
    };

    await order.save({ validateModifiedOnly: true });

    const populatedOrder = await OrderModel.findById(order._id)
        .populate("userId")
        .populate("items.product");

    return res.status(200).json({
        success: true,
        message: "Payment status updated.",
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
            new ErrorResponse("Not authorized to delete this order", 403),
        );
    }

    order.isDeleted = true;
    await order.save({ validateModifiedOnly: true });

    return res.status(200).json({ success: true, message: "Order deleted." });
});

export const getDashboardStats = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();
    const UserModel = getLocalUserModel();

    if (!OrderModel || !ProductModel || !UserModel) {
        return next(new ErrorResponse("Model not found!", 400));
    }

    const orders = await OrderModel.find({ isDeleted: false }).populate("items.product");
    const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrders = orders.length;

    const totalProducts = await ProductModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();

    // 1. Daily Sales for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailySales = await OrderModel.aggregate([
        {
            $match: {
                createdAt: { $gte: thirtyDaysAgo },
                isDeleted: false,
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                total: { $sum: "$grandTotal" },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    // 2. Category Distribution (Sales and Product Count)
    const categoryStats = await ProductModel.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 },
                totalSold: { $sum: "$sold" },
            },
        },
        {
            $lookup: {
                from: "categories",
                localField: "_id",
                foreignField: "_id",
                as: "categoryInfo",
            },
        },
        { $unwind: "$categoryInfo" },
        {
            $project: {
                name: "$categoryInfo.name",
                count: 1,
                totalSold: 1,
            },
        },
    ]);

    // 3. Order Status Analysis
    const orderStatusStats = await OrderModel.aggregate([
        { $match: { isDeleted: false } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    // 4. Inventory Alerts (Out of Stock and Low Stock)
    const outOfStockItems = await ProductModel.find({ 
        $or: [{ stock: 0 }, { stock: { $lte: 0 } }, { stock: null }, { stock: { $exists: false } }] 
    }).select("name stock price image");

    const lowStockItems = await ProductModel.find({ 
        stock: { $gt: 0, $lte: 5 } 
    }).select("name stock price image");

    return res.status(200).json({
        success: true,
        stats: {
            totalSales,
            totalOrders,
            totalProducts,
            totalUsers,
            dailySales,
            categoryStats,
            orderStatusStats,
            inventory: {
                outOfStock: outOfStockItems,
                lowStock: lowStockItems,
                outOfStockCount: outOfStockItems.length,
                lowStockCount: lowStockItems.length,
            },
        },
    });
});
