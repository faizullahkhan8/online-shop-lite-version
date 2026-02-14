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
            required: true,
        },
        stock: { type: Number, required: true },
        lowStock: { type: Number, required: true },
        image: { type: String, required: true },
        imagekitFileId: { type: String, required: true },
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    },
);

export default productSchema;
