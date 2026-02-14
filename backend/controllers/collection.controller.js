import expressAsyncHandler from "express-async-handler";
import { getLocalCollectionModel } from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { deleteImageKitFile } from "../utils/DeleteFileImageKit.js";

export const createCollection = expressAsyncHandler(async (req, res, next) => {
    const CollectionModel = getLocalCollectionModel();

    if (!CollectionModel) {
        return next(new ErrorResponse("Collection model not found", 404));
    }

    let data = req.body;
    if (req.body?.data) {
        try {
            data = JSON.parse(req.body.data);
        } catch (error) {
            return next(new ErrorResponse("Invalid collection data format", 400));
        }
    }
    const { name, parentId, isActive } = data || {};

    if (!name) {
        return next(new ErrorResponse("Name is required", 400));
    }

    if (!req.image) {
        return next(new ErrorResponse("Image is required", 400));
    }

    const collection = await CollectionModel.create({
        name,
        parentId: parentId || null,
        isActive,
        image: req.image?.filePath || "",
        imagekitFileId: req.image?.fileId || "",
    });

    res.status(201).json({
        success: true,
        message: "Collection created successfully",
        collection,
    });
});

export const getAllCollections = expressAsyncHandler(
    async (req, res, next) => {
        const CollectionModel = getLocalCollectionModel();

        if (!CollectionModel) {
            return next(new ErrorResponse("Collection model not found", 404));
        }

    const collections = await CollectionModel.find().populate("parentId");

        res.status(200).json({
            success: true,
            message: "Collections fetched successfully",
            collections,
        });
    },
);

export const deleteCollection = expressAsyncHandler(async (req, res, next) => {
    const CollectionModel = getLocalCollectionModel();

    if (!CollectionModel) {
        return next(new ErrorResponse("Collection model not found", 404));
    }

    const { id } = req.params;

    if (!id) {
        return next(new ErrorResponse("Collection ID is required", 400));
    }

    const collection = await CollectionModel.findByIdAndDelete(id);
    if (collection?.imagekitFileId) {
        await deleteImageKitFile(collection.imagekitFileId);
    }

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully",
        collection,
    });
});

export const updateCollection = expressAsyncHandler(async (req, res, next) => {
    const CollectionModel = getLocalCollectionModel();

    if (!CollectionModel) {
        return next(new ErrorResponse("Collection model not found", 404));
    }

    const { id } = req.params;

    if (!id) {
        return next(new ErrorResponse("Collection ID is required", 400));
    }

    let data = req.body;
    if (req.body?.data) {
        try {
            data = JSON.parse(req.body.data);
        } catch (error) {
            return next(new ErrorResponse("Invalid collection data format", 400));
        }
    }
    const { name, parentId, isActive } = data || {};

    const collection = await CollectionModel.findById(id);
    if (!collection) {
        return next(new ErrorResponse("Collection not found", 404));
    }

    if (req.image?.fileId) {
        if (collection.imagekitFileId) {
            await deleteImageKitFile(collection.imagekitFileId);
        }
        collection.imagekitFileId = req.image.fileId || "";
        collection.image = req.image.filePath || "";
    }

    collection.name = name ?? collection.name;
    collection.parentId =
        parentId !== undefined ? parentId || null : collection.parentId;
    collection.isActive =
        isActive !== undefined ? isActive : collection.isActive;

    await collection.save();

    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        collection,
    });
});
