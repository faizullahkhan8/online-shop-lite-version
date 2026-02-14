import { Schema } from "mongoose";

const collectionSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        parentId: {
            type: Schema.Types.ObjectId,
            ref: "Collection",
            default: null,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        image: {
            type: String,
            default: "",
        },
        imagekitFileId: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

export default collectionSchema;
