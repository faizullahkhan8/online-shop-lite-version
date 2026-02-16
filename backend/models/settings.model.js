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
    },
    {
        timestamps: true,
    },
);

export default settingsSchema;
