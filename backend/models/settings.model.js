import { Schema } from "mongoose";

const settingsSchema = new Schema(
    {
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
    },
    {
        timestamps: true,
    },
);

export default settingsSchema;
