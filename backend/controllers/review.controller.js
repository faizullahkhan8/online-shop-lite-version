import expressAsyncHandler from "express-async-handler";
import {
    getLocalReviewModel,
    getLocalProductModel,
} from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const addReview = expressAsyncHandler(async (req, res, next) => {
    const { rating, comment, productId, name, email } = req.body;

    const Product = getLocalProductModel();
    const Review = getLocalReviewModel();

    if (!Product || !Review) {
        return next(new ErrorResponse("Database models not found", 500));
    }

    const product = await Product.findById(productId);
    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }

    let filter = { product: productId };

    // Guest user must provide name & email
    if (!name || !email) {
        return next(
            new ErrorResponse(
                "Name and email are required for guest reviews",
                400,
            ),
        );
    }

    filter.email = email.toLowerCase();
    filter.name = name; // lowercase for uniqueness

    // Check if review already exists
    const alreadyReviewed = await Review.findOne(filter);
    if (alreadyReviewed) {
        return next(
            new ErrorResponse("You have already reviewed this product", 400),
        );
    }
    // Create review
    const reviewData = {
        rating: Number(rating),
        comment,
        product: productId,
        name: name,
        email: email.toLowerCase(),
        isGuest: true,
    };

    const review = await Review.create({ ...reviewData });

    // Recalculate product rating
    try {
        const reviews = await Review.find({ product: productId });
        product.numReviews = reviews.length;
        product.rating =
            reviews.reduce((acc, item) => item.rating + acc, 0) /
            reviews.length;
        await product.save({ validateModifiedOnly: true });
    } catch (error) {
        return next(new ErrorResponse("You can give one review per product"));
    }

    res.status(201).json({
        success: true,
        message: "Review added",
        review,
    });
});

// @desc    Get product reviews
// @route   GET /api/reviews/:productId
// @access  Public
export const getProductReviews = expressAsyncHandler(async (req, res, next) => {
    const Review = getLocalReviewModel();
    if (!Review) {
        return next(new ErrorResponse("Review model not found", 500));
    }

    const reviews = await Review.find({ product: req.params.productId }).sort({
        createdAt: -1,
    });

    res.status(200).json({ success: true, reviews });
});
