import { Schema, SchemaTypes } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        sold: { type: Number, default: 0 },
        collection: {
            type: SchemaTypes.ObjectId,
            ref: "Collection",
        },
        stock: { type: Number, required: true },
        lowStock: { type: Number, required: true },

        // --- CHANGED: Array of image objects ---
        images: [
            {
                url: { type: String, required: true },
                fileId: { type: String, required: true },
                name: { type: String },
                filePath: { type: String },
            },
        ],

        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

export default productSchema;
