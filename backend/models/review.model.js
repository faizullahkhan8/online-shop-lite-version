import { Schema, SchemaTypes } from "mongoose";

const reviewSchema = new Schema(
    {
        user: {
            type: SchemaTypes.ObjectId,
            ref: "User",
        },
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

// Prevent multiple reviews from the same user for the same product
reviewSchema.index({ name: 1, email: 1 }, { unique: true });

export default reviewSchema;
