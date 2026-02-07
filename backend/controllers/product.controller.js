import expressAsyncHandler from "express-async-handler";
import { getLocalProductModel } from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import { getEffectivePrice } from "../utils/promotionHelper.js";
import { deleteImageKitFile } from "../utils/DeleteFileImageKit.js";


export const createProduct = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { name, price, description, category, stock } = JSON.parse(
        req.body.data,
    );
    if (!name || !price || !description || !category || !stock)
        return next(new ErrorResponse("All fields are required", 400));

    const isProductExist = await ProductModel.findOne({ name });
    if (isProductExist)
        return next(new ErrorResponse("Product already exists", 400));

    const product = await ProductModel.create({
        name,
        price,
        description,
        category,
        stock,
        image: req.image.filePath || "",
        imagekitFileId: req.image.fileId || "",
    });

    return res.status(201).json({
        success: true,
        message: "Product created successfully",
        product,
    });
});

export const getAllProducts = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const {
        category,
        minPrice,
        maxPrice,
        search,
        page = 1,
        limit = 9,
    } = req.query;

    let query = {};

    if (category) {
        query.category = category;
    }

    if (search) {
        query.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await ProductModel.find(query)
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit));

    const totalProducts = await ProductModel.countDocuments(query);

    // Enrich products with promotional pricing
    const productsWithPromos = await Promise.all(
        products.map(async (product) => {
            const { price: effectivePrice, promotion } = await getEffectivePrice(
                product._id,
                product.price,
            );
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
        totalPages: Math.ceil(totalProducts / Number(limit)),
        currentPage: Number(page),
        totalProducts,
    });
});

export const getProductById = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { id } = req.params;

    const product = await ProductModel.findById(id).populate("category");
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

    const product = await ProductModel.findById(id);
    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    let updateData;
    try {
        updateData = JSON.parse(req.body.data);
    } catch (error) {
        return next(new ErrorResponse("Invalid product data format", 400));
    }

    if (req.image.fileId) {
        try {
            await deleteImageKitFile(product.imagekitFileId);
            updateData.imagekitFileId = req.image.fileId;
            updateData.image = req.image.filePath;
        } catch (err) {
            return next(new ErrorResponse("Failed to delete old image from ImageKit", 500));
        }
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true },
    );

    return res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updatedProduct,
    });
});

export const deleteProduct = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();

    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { id } = req.params;

    const product = await ProductModel.findById(id);
    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    try {
        if (product.imagekitFileId) {
            await deleteImageKitFile(product.imagekitFileId);

        }
    } catch (err) {
        return next(new ErrorResponse("Failed to delete old image from ImageKit", 500));
    }

    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        product,
    });
});
