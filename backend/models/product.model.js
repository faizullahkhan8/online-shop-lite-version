import { Schema, SchemaTypes } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String, required: true },
        category: {
            type: SchemaTypes.ObjectId,
            ref: "Category",
            required: true,
        },
        stock: { type: Number, required: true },
        image: { type: String, required: true },
    },
    {
        timestamps: true,
    }
);

export default productSchema;
