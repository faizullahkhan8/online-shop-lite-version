import { Schema } from "mongoose";

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        recipient: {
            name: {
                type: String,
                required: true,
            },
            street: {
                type: String,
                required: true,
            },
            addressLine2: {
                type: String,
                default: "",
            },
            city: {
                type: String,
                required: true,
            },
            state: {
                type: String,
                default: "",
            },
            postalCode: {
                type: String,
                default: "",
            },
            country: {
                type: String,
                default: "",
            },
            phone: {
                type: String,
                required: true,
            },
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
                },
                totalAmount: {
                    type: Number,
                    required: true,
                },
            },
        ],
        grandTotal: {
            type: Number,
            required: true,
        },
        taxAmount: {
            type: Number,
            default: 0,
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        shippingMethod: {
            type: String,
            default: "standard",
        },
        payment: {
            method: {
                type: String,
                required: true,
                enum: ["COD", "online", "card", "bank", "wallet"],
            },
            ispaid: {
                type: Boolean,
                default: false,
            },
        },
        status: {
            type: String,
            enum: ["pending", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default orderSchema;
