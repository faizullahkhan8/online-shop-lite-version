import expressAsyncHandler from "express-async-handler";
import mongoose from "mongoose";
import {
    getLocalProductModel,
    getLocalPromotionModel,
    getLocalCollectionModel,
} from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { getEffectivePrice } from "../utils/promotionHelper.js";
import { deleteImageKitFile } from "../utils/DeleteFileImageKit.js";

export const createProduct = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { name, price, description, stock, lowStock, collection, images } =
        req.body;

    if (
        !name ||
        !price ||
        !description ||
        !stock ||
        !lowStock ||
        images.length < 1
    )
        return next(new ErrorResponse("All fields are required", 400));

    const isProductExist = await ProductModel.findOne({ name });
    if (isProductExist)
        return next(new ErrorResponse("Product already exists", 400));

    const product = await ProductModel.create({
        name,
        price,
        description,
        stock,
        lowStock,
        collection: collection || null,
        images,
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

export const uploadImages = expressAsyncHandler(async (req, res, next) => {
    if (req.images) {
        return res.status(201).json({
            success: true,
            images: req.images,
        });
    } else {
        return next(
            new ErrorResponse(
                "something went wronge while uploading images!",
                401,
            ),
        );
    }
});

export const deleteImage = expressAsyncHandler(async (req, res, next) => {
    const imageData = req.body;

    if (!imageData.fileId) {
        return next(new ErrorResponse("image data is not provided!", 400));
    }

    try {
        await deleteImageKitFile(imageData.fileId);
    } catch (error) {
        return next(new ErrorResponse("image deletion failed!", 400));
    }

    return res.status(200).json({
        success: true,
        deleted_image: imageData,
    });
});

export const getAllProducts = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const {
        collection,
        minPrice,
        maxPrice,
        search,
        promotionId,
        page,
        limit,
        excludeActivePromotions,
        currentPromotionId,
        excludeAssignedToCollection,
        excludeInactiveCollections,
    } = req.query;

    let query = {};

    if (collection) {
        if (mongoose.isValidObjectId(collection)) {
            query.collection = collection;
        } else {
            const CollectionModel = getLocalCollectionModel();
            if (CollectionModel) {
                const matchedCollection = await CollectionModel.findOne({
                    name: collection.toLowerCase(),
                }).select("_id");
                if (matchedCollection?._id) {
                    query.collection = matchedCollection._id;
                } else {
                    query.collection = null;
                }
            } else {
                query.collection = collection;
            }
        }
    }

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (promotionId) {
        if (!mongoose.isValidObjectId(promotionId)) {
            query._id = {
                ...(query._id || {}),
                $in: [],
            };
        } else {
            const PromotionModel = getLocalPromotionModel();

            if (!PromotionModel) {
                return next(
                    new ErrorResponse("Promotion model not found", 500),
                );
            }

            const promotion =
                await PromotionModel.findById(promotionId).select("products");

            if (!promotion || promotion.products.length === 0) {
                query._id = {
                    ...(query._id || {}),
                    $in: [],
                };
            } else {
                query._id = {
                    ...(query._id || {}),
                    $in: promotion.products,
                };
            }
        }
    }

    if (excludeActivePromotions === "true") {
        const PromotionModel = getLocalPromotionModel();
        if (PromotionModel) {
            const promotionQuery = {
                status: { $in: ["ACTIVE", "SCHEDULED"] },
            };

            if (currentPromotionId) {
                promotionQuery._id = { $ne: currentPromotionId };
            }

            const activePromotions =
                await PromotionModel.find(promotionQuery).select("products");

            const usedProductIds = activePromotions.reduce((acc, promo) => {
                return acc.concat(promo.products);
            }, []);

            if (usedProductIds.length > 0) {
                if (query._id) {
                    query._id.$nin = [
                        ...(query._id.$nin || []),
                        ...usedProductIds,
                    ];
                } else {
                    query._id = { $nin: usedProductIds };
                }
            }
        }
    }

    if (excludeAssignedToCollection === "true") {
        const assignedProducts = await ProductModel.find({
            collection: { $exists: true, $ne: null },
        }).select("_id");

        const assignedProductIds = assignedProducts.map((p) => p._id);

        if (assignedProductIds.length > 0) {
            if (query._id) {
                query._id.$nin = [
                    ...(query._id.$nin || []),
                    ...assignedProductIds,
                ];
            } else {
                query._id = { $nin: assignedProductIds };
            }
        }
    }

    if (excludeInactiveCollections === "true") {
        const CollectionModel = getLocalCollectionModel();
        if (CollectionModel) {
            const inactiveCollections = await CollectionModel.find({
                isActive: false,
            }).select("_id");

            const inactiveCollectionIds = inactiveCollections.map((c) => c._id);

            if (inactiveCollectionIds.length > 0) {
                // Determine if we need to merge with existing collection query
                if (query.collection) {
                    // If a specific collection is already being queried, check if it's inactive
                    // If it is inactive, this query will naturally return nothing if we exclude it.
                    // For safety, we can convert it to a complex query if needed, but usually
                    // excludeInactiveCollections is used when fetching ALL products.
                    // If query.collection is an object (e.g., with $in), we can refine it.
                    // Assuming query.collection is an ObjectId.
                    query.collection = {
                        $in: [query.collection],
                        $nin: inactiveCollectionIds,
                    };
                } else {
                    query.collection = { $nin: inactiveCollectionIds };
                }
            }
        }
    }

    const pageNum = Number(page) || 1;
    const limitNum = Number(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const products = await ProductModel.find(query)
        .populate("collection", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum);

    const totalProducts = await ProductModel.countDocuments(query);

    const productsWithPromos = await Promise.all(
        products.map(async (product) => {
            const { price: effectivePrice, promotion } =
                await getEffectivePrice(product._id, product.price);
            return {
                ...product.toObject(),
                id: product._id,
                effectivePrice,
                promotion,
            };
        }),
    );

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products: productsWithPromos,
        totalPages: Math.ceil(totalProducts / limitNum),
        currentPage: pageNum,
        totalProducts,
    });
});

export const getProductById = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { id } = req.params;

    const product = await ProductModel.findById(id).populate("collection");
    if (!product) return next(new ErrorResponse("Product not found", 404));

    const { price: effectivePrice, promotion } = await getEffectivePrice(
        product._id,
        product.price,
    );

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product: {
            ...product.toObject(),
            id: product._id,
            effectivePrice,
            promotion,
        },
    });
});

export const updateProduct = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { id } = req.params;
    const existingProduct = await ProductModel.findById(id);

    if (!existingProduct)
        return next(new ErrorResponse("Product not found", 404));

    const { images = [], ...otherFields } = req.body;

    const existingImageIds = existingProduct.images.map((img) =>
        img._id.toString(),
    );

    const newImageIds = images.map((img) => img._id);

    const removedImageIds = existingImageIds.filter(
        (id) => !newImageIds.includes(id),
    );

    existingProduct.set({
        ...otherFields,
        collection: otherFields.collection || null,
        images,
    });

    await existingProduct.save();

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        removedImages: removedImageIds, // optional debug info
        product: existingProduct,
    });
});

export const assignCollectionToProducts = expressAsyncHandler(
    async (req, res, next) => {
        const ProductModel = getLocalProductModel();
        const CollectionModel = getLocalCollectionModel();

        if (!ProductModel) {
            return next(new ErrorResponse("Product model not found", 500));
        }

        if (!CollectionModel) {
            return next(new ErrorResponse("Collection model not found", 500));
        }

        const { collectionId, productIds } = req.body;

        if (!collectionId || !mongoose.isValidObjectId(collectionId)) {
            return next(
                new ErrorResponse("Valid collectionId is required", 400),
            );
        }

        if (!Array.isArray(productIds) || productIds.length === 0) {
            return next(
                new ErrorResponse("At least one productId is required", 400),
            );
        }

        const dedupedProductIds = [...new Set(productIds)];
        const hasInvalidProductId = dedupedProductIds.some(
            (id) => !mongoose.isValidObjectId(id),
        );

        if (hasInvalidProductId) {
            return next(
                new ErrorResponse("One or more productIds are invalid", 400),
            );
        }

        const collection =
            await CollectionModel.findById(collectionId).select("_id");

        if (!collection) {
            return next(new ErrorResponse("Collection not found", 404));
        }

        const result = await ProductModel.updateMany(
            { _id: { $in: dedupedProductIds } },
            { $set: { collection: collection._id } },
        );

        return res.status(200).json({
            success: true,
            message: "Collection assigned to products successfully",
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
        });
    },
);

export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { id } = req.params;
    const product = await ProductModel.findById(id);
    if (!product) return next(new ErrorResponse("Product not found", 404));

    try {
        if (product.images && product.images.length > 0) {
            const deletePromises = product.images.map((img) =>
                deleteImageKitFile(img.fileId),
            );
            await Promise.all(deletePromises);
        }
    } catch (err) {
        return next(
            new ErrorResponse("Failed to delete images from ImageKit", 500),
        );
    }

    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});
