import expressAsyncHandler from "express-async-handler";
import crypto from "crypto";
import mongoose from "mongoose";
import {
    getLocalOrderModel,
    getLocalProductModel,
    getLocalUserModel,
} from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { getEffectivePrice } from "../utils/promotionHelper.js";
import { PlaceOrderSchema } from "../utils/validationSchemas.js";

export const placeOrder = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();
    const UserModel = getLocalUserModel();

    if (!OrderModel || !ProductModel || !UserModel) {
        return next(new Error("Order model not found"));
    }

    // SECURITY: Validate all input with Zod schema
    let validatedData;
    try {
        validatedData = PlaceOrderSchema.parse(req.body);
    } catch (error) {
        const firstError = error.errors[0];
        const fieldPath =
            firstError.path.length > 0
                ? firstError.path.join(".")
                : "unknown field";
        return next(
            new ErrorResponse(
                `Validation error in ${fieldPath}: ${firstError.message}`,
                400,
            ),
        );
    }

    const {
        items,
        recipient,
        payment,
        taxAmount,
        shippingFee,
        shippingMethod,
        status,
    } = validatedData;

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
                const { price: effectivePrice, promotion } =
                    await getEffectivePrice(tempProd._id, tempProd.price);

                if (quantity <= 0) {
                    throw new ErrorResponse(
                        "Item quantity must be greater than 0",
                        400,
                    );
                }

                // Integrity check (client vs server pricing/promotion)
                // If the price/promotion changed since the item was added to cart,
                // reject the order so the client can refresh totals.
                const clientUnitPrice = Number(item.price);
                const clientPromoId = item?.promotion?.id?.toString?.();
                const serverPromoId = promotion?.id?.toString?.();

                if (Number.isFinite(clientUnitPrice)) {
                    const diff = Math.abs(clientUnitPrice - effectivePrice);
                    if (diff > 0.01) {
                        throw new ErrorResponse(
                            "Pricing has changed. Please review your cart and try again.",
                            409,
                        );
                    }
                }

                if (clientPromoId || serverPromoId) {
                    if ((clientPromoId || "") !== (serverPromoId || "")) {
                        throw new ErrorResponse(
                            "Promotion has changed. Please review your cart and try again.",
                            409,
                        );
                    }
                }

                const originalPrice = Number(tempProd.price) || 0;
                const discountTotal = Math.max(
                    0,
                    originalPrice - effectivePrice,
                );
                const discountPerUnit = discountTotal / quantity;

                return {
                    product: item.product,
                    quantity,
                    price: effectivePrice,
                    originalPrice,
                    discount: discountTotal,
                    discountPerUnit,
                    discountTotal,
                    promotion: promotion
                        ? {
                              id: promotion.id,
                              title: promotion.title,
                              type: promotion.type,
                              discountType: promotion.discountType,
                              discountValue: promotion.discountValue,
                          }
                        : null,
                    totalAmount: effectivePrice * quantity,
                };
            }),
        );
    } catch (error) {
        return next(error);
    }

    // let orderUserId = req.user?._id;
    // if (req.user?.role === "admin" && userId) {
    //     const userExists = await UserModel.findById(userId);
    //     if (!userExists) {
    //         return next(new ErrorResponse("User not found", 404));
    //     }
    //     orderUserId = userId;
    // }

    // SECURITY: Use MongoDB transaction for atomicity
    // Ensures stock and order updates both succeed or both fail
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Process stock and sold count within transaction
        for (const prod of normalizedItems) {
            const result = await ProductModel.findByIdAndUpdate(
                prod.product,
                {
                    $inc: { stock: -prod.quantity, sold: prod.quantity },
                },
                { session, new: true },
            );

            // Verify stock didn't go negative
            if (result && result.stock < 0) {
                throw new ErrorResponse(
                    `Insufficient stock for product: ${result.name}. Available: ${result.stock + prod.quantity}`,
                    400,
                );
            }
        }

        const itemsTotal = normalizedItems.reduce(
            (sum, item) => sum + item.totalAmount,
            0,
        );
        const computedTax = Number(taxAmount) || 0;
        const computedShipping = Number(shippingFee) || 0;
        if (computedTax < 0 || computedShipping < 0) {
            throw new ErrorResponse(
                "Tax and shipping must be valid amounts",
                400,
            );
        }
        const computedGrandTotal = itemsTotal + computedTax + computedShipping;

        // Generate tracking token for guest checkout (90 days validity)
        const trackingToken = crypto.randomBytes(32).toString("hex");
        const trackingTokenExpires = new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000,
        );

        const order = new OrderModel({
            items: normalizedItems,
            taxAmount: computedTax,
            shippingFee: computedShipping,
            shippingMethod,
            grandTotal: computedGrandTotal,
            recipient,
            payment,
            status: status ?? "pending",
            trackingToken,
            trackingTokenExpires,
        });

        // Save order within transaction
        await order.save({ session });

        // Commit transaction
        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
            trackingToken,
            trackingUrl: `${process.env.FRONTEND_URL}/track/${trackingToken}`,
        });
    } catch (error) {
        // Abort transaction on any error
        await session.abortTransaction();

        // Re-throw original error or new one
        if (error instanceof ErrorResponse) {
            throw error;
        }
        throw new ErrorResponse(error.message || "Failed to place order", 400);
    } finally {
        session.endSession();
    }
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

export const updatePaymentStatus = expressAsyncHandler(
    async (req, res, next) => {
        const OrderModel = getLocalOrderModel();
        if (!OrderModel)
            return next(new ErrorResponse("Model not found!", 400));

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
    },
);

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

export const cancelOrder = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();

    if (!OrderModel || !ProductModel)
        return next(new ErrorResponse("Model not found!", 400));

    const { reason } = req.body;
    const order = await OrderModel.findById(req.params.id);

    if (!order) return next(new ErrorResponse("Order not found", 404));

    // Ensure user owns the order (if not admin)
    if (
        req.user.role !== "admin" &&
        order.userId.toString() !== req.user._id.toString()
    ) {
        return next(
            new ErrorResponse("Not authorized to cancel this order", 403),
        );
    }

    if (order.status !== "pending") {
        return next(
            new ErrorResponse("Only pending orders can be cancelled", 400),
        );
    }

    order.status = "cancelled";
    order.cancellationReason = reason || "No reason provided";
    order.cancelledBy = req.user._id;

    // Restore stock
    for (const item of order.items) {
        if (item.status !== "cancelled") {
            const product = await ProductModel.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                product.sold -= item.quantity;
                await product.save({ validateModifiedOnly: true });
            }
            item.status = "cancelled"; // Mark all items as cancelled
        }
    }

    await order.save({ validateModifiedOnly: true });

    return res.status(200).json({
        success: true,
        message: "Order cancelled successfully",
        order,
    });
});

export const cancelOrderItem = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();

    if (!OrderModel || !ProductModel)
        return next(new ErrorResponse("Model not found!", 400));

    const { itemId } = req.params;
    const { reason } = req.body;

    const order = await OrderModel.findById(req.params.id);

    if (!order) return next(new ErrorResponse("Order not found", 404));

    // Find the item
    const itemIndex = order.items.findIndex(
        (item) => item._id.toString() === itemId,
    );

    if (itemIndex === -1) {
        return next(new ErrorResponse("Item not found in order", 404));
    }

    const item = order.items[itemIndex];

    if (item.status === "cancelled") {
        return next(new ErrorResponse("Item is already cancelled", 400));
    }

    // Update item status
    item.status = "cancelled";
    item.cancellationReason = reason || "Admin cancelled item";
    item.cancelledBy = req.user._id;

    // Restore stock
    const product = await ProductModel.findById(item.product);
    if (product) {
        product.stock += item.quantity;
        product.sold -= item.quantity;
        await product.save({ validateModifiedOnly: true });
    }

    // Recalculate totals
    // We subtract the item's totalAmount from grandTotal
    // Note: tax and shipping might need adjustment based on business logic,
    // but for now we'll just subtract the item cost.
    order.grandTotal -= item.totalAmount;
    if (order.grandTotal < 0) order.grandTotal = 0;

    await order.save({ validateModifiedOnly: true });

    // Populate for response
    const populatedOrder = await OrderModel.findById(order._id)
        .populate("userId")
        .populate("items.product");

    return res.status(200).json({
        success: true,
        message: "Item cancelled successfully",
        order: populatedOrder,
    });
});

export const getOrderByTrackingToken = expressAsyncHandler(
    async (req, res, next) => {
        const OrderModel = getLocalOrderModel();
        if (!OrderModel)
            return next(new ErrorResponse("Model not found!", 400));

        const { trackingToken } = req.params;

        if (!trackingToken) {
            return next(new ErrorResponse("Tracking token is required", 400));
        }

        const order = await OrderModel.findOne({
            trackingToken,
            isDeleted: false,
        }).populate("items.product");

        if (!order) {
            return next(new ErrorResponse("Order not found", 404));
        }

        // CHECK: Token should not be expired
        if (
            order.trackingTokenExpires &&
            new Date() > order.trackingTokenExpires
        ) {
            return next(new ErrorResponse("Tracking token has expired", 410));
        }

        return res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            order,
        });
    },
);

export const getDashboardStats = expressAsyncHandler(async (req, res, next) => {
    const OrderModel = getLocalOrderModel();
    const ProductModel = getLocalProductModel();
    const UserModel = getLocalUserModel();

    if (!OrderModel || !ProductModel || !UserModel) {
        return next(new ErrorResponse("Model not found!", 400));
    }

    // Get date range from query params
    const { startDate, endDate } = req.query;

    // Build date filter
    const dateFilter = { isDeleted: false };
    if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) {
            dateFilter.createdAt.$gte = new Date(startDate);
        }
        if (endDate) {
            dateFilter.createdAt.$lte = new Date(endDate);
        }
    }

    // Apply date filter to orders
    const orders = await OrderModel.find(dateFilter).populate("items.product");
    const totalSales = orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0);
    const totalOrders = orders.length;

    const totalProducts = await ProductModel.countDocuments();
    const totalUsers = await UserModel.countDocuments();

    // 1. Daily Sales
    // Use provided start date or default to 30 days ago
    let salesStartDate;
    if (startDate) {
        salesStartDate = new Date(startDate);
    } else {
        salesStartDate = new Date();
        salesStartDate.setDate(salesStartDate.getDate() - 30);
    }

    const dailySalesFilter = {
        createdAt: { $gte: salesStartDate },
        isDeleted: false,
    };

    if (endDate) {
        dailySalesFilter.createdAt.$lte = new Date(endDate);
    }

    const dailySales = await OrderModel.aggregate([
        {
            $match: dailySalesFilter,
        },
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                total: { $sum: "$grandTotal" },
                count: { $sum: 1 },
            },
        },
        { $sort: { _id: 1 } },
    ]);

    const collectionStats = await ProductModel.aggregate([
        {
            $group: {
                _id: "$collection",
                count: { $sum: 1 },
                totalSold: { $sum: "$sold" },
            },
        },
        {
            $lookup: {
                from: "collections",
                localField: "_id",
                foreignField: "_id",
                as: "collectionInfo",
            },
        },
        { $unwind: "$collectionInfo" },
        {
            $project: {
                name: "$collectionInfo.name",
                count: 1,
                totalSold: 1,
            },
        },
    ]);

    // 3. Order Status Analysis - filtered by date
    const orderStatusStats = await OrderModel.aggregate([
        { $match: dateFilter },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
            },
        },
    ]);

    // 4. Inventory Alerts
    const outOfStockItems = await ProductModel.find({
        $or: [
            { stock: 0 },
            { stock: { $lte: 0 } },
            { stock: null },
            { stock: { $exists: false } },
        ],
    }).select("name stock price image");

    const lowStockItems = await ProductModel.find({
        stock: { $gt: 0, $lte: 5 },
    }).select("name stock price image");

    return res.status(200).json({
        success: true,
        stats: {
            totalSales,
            totalOrders,
            totalProducts,
            totalUsers,
            dailySales,
            collectionStats,
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
