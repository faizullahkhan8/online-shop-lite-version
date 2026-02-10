import { Schema } from "mongoose";

const heroSlideSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        headline: {
            type: String,
            required: true,
        },
        subtitle: {
            type: String,
        },
        image: {
            type: String,
            required: true,
        },
        imagekitFileId: {
            type: String,
            required: true,
        },
        bg: {
            type: String,
            default: "bg-[#e3f0ff]",
        },
        accent: {
            type: String,
            default: "text-blue-600",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

export default heroSlideSchema;
