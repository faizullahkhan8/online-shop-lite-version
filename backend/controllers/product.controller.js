import expressAsyncHandler from "express-async-handler";
import { getLocalProductModel } from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

import fs from "fs/promises";
import path from "path";

export const createProduct = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { name, price, description, category, stock } = JSON.parse(
        req.body.data
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
        image: "public/images/product-images/" + req.file.filename,
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

    const products = await ProductModel.find();

    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products,
    });
});

export const getProductById = expressAsyncHandler(async (req, res, next) => {
    const ProductModel = getLocalProductModel();
    if (!ProductModel)
        return next(new ErrorResponse("Product model not found", 500));

    const { id } = req.params;

    const product = await ProductModel.findById(id).populate("category");

    return res.status(200).json({
        success: true,
        message: "Product fetched successfully",
        product,
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

    if (req.file) {
        const oldImageName = product.image;

        // --- ADDED CHECK START ---
        // Only attempt to delete if an old image path actually exists
        if (oldImageName) {
            try {
                // It is good practice to check if the file exists on disk
                // before unlinking to prevent the "500" error if the file was manually deleted
                await fs.access(oldImageName);
                await fs.unlink(oldImageName);
            } catch (err) {
                // We log this but perhaps don't stop the update if the file just isn't there
                console.error(
                    "Old image not found or couldn't be deleted:",
                    err.message
                );
            }
        }
        // --- ADDED CHECK END ---

        updateData.image =
            process.env.BACKEND_SERVER_IMAGE_PATH + "/" + req.file.filename;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
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
        if (product.image) {
            const imagePath = path.resolve(product.image);
            await fs.unlink(imagePath);
        }
    } catch (err) {
        return next(new ErrorResponse("Failed to delete old image", 500));
    }

    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        product,
    });
});
