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
            city: {
                type: String,
                required: true,
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
        payment: {
            method: {
                type: String,
                required: true,
                enum: ["COD", "online"],
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
    },
    {
        timestamps: true,
    }
);

export default orderSchema;
