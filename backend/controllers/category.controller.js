import expressAsyncHandler from "express-async-handler";
import { getLocalCategoryModel } from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const createCategory = expressAsyncHandler(async (req, res, next) => {
    const CategoryModel = getLocalCategoryModel();

    if (!CategoryModel) {
        return next(new ErrorResponse("Category model not found", 404))
    }

    const { name, parentId, isActive } = req.body

    if (!name) {
        return next(new ErrorResponse("Name is required", 400))
    }

    const category = await CategoryModel.create({ name, parentId, isActive })

    res.status(201).json({
        success: true,
        message: "Category created successfully",
        category
    })
})

export const getAllCategories = expressAsyncHandler(async (req, res, next) => {
    const CategoryModel = getLocalCategoryModel();

    if (!CategoryModel) {
        return next(new ErrorResponse("Category model not found", 404))
    }

    const categories = await CategoryModel.find().populate("parentId")

    res.status(200).json({
        success: true,
        message: "Categories fetched successfully",
        categories
    })
})

export const deleteCategory = expressAsyncHandler(async (req, res, next) => {
    const CategoryModel = getLocalCategoryModel();

    if (!CategoryModel) {
        return next(new ErrorResponse("Category model not found", 404))
    }

    const { id } = req.params

    if (!id) {
        return next(new ErrorResponse("Category ID is required", 400))
    }

    const category = await CategoryModel.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: "Category deleted successfully",
        category
    })
})

export const updateCategory = expressAsyncHandler(async (req, res, next) => {
    const CategoryModel = getLocalCategoryModel();

    if (!CategoryModel) {
        return next(new ErrorResponse("Category model not found", 404))
    }

    const { id } = req.params

    if (!id) {
        return next(new ErrorResponse("Category ID is required", 400))
    }

    const { name, parentId, isActive } = req.body

    const category = await CategoryModel.findByIdAndUpdate(id, { name, parentId, isActive }, { new: true })

    res.status(200).json({
        success: true,
        message: "Category updated successfully",
        category
    })
})
