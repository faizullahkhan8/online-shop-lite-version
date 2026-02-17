import { Schema, SchemaTypes } from "mongoose";

const reviewSchema = new Schema(
    {
        product: {
            type: SchemaTypes.ObjectId,
            ref: "Product",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
        },
        isGuest: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

reviewSchema.index({ name: 1, email: 1 }, { unique: true });

export default reviewSchema;
