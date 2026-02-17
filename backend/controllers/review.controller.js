import expressAsyncHandler from "express-async-handler";
import {
    getLocalReviewModel,
    getLocalProductModel,
} from "../config/localDb.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const addReview = expressAsyncHandler(async (req, res, next) => {
    console.log("point : 01");
    const { rating, comment, productId, name, email } = req.body;

    console.log(req.body);
    console.log("point : 02");

    const Product = getLocalProductModel();
    console.log("point : 03");
    const Review = getLocalReviewModel();
    console.log("point : 04");

    if (!Product || !Review) {
        return next(new ErrorResponse("Database models not found", 500));
    }
    console.log("point : 05");

    const product = await Product.findById(productId);
    console.log("point : 06");
    if (!product) {
        return next(new ErrorResponse("Product not found", 404));
    }
    console.log("point : 07");

    let filter = { product: productId };
    console.log("point : 08");

    // Guest user must provide name & email
    if (!name || !email) {
        return next(
            new ErrorResponse(
                "Name and email are required for guest reviews",
                400,
            ),
        );
    }
    console.log("point : 09");

    filter.email = email.toLowerCase();
    filter.name = name; // lowercase for uniqueness
    console.log("point : 10");

    // Check if review already exists
    const alreadyReviewed = await Review.findOne(filter);
    console.log("point : 11");
    if (alreadyReviewed) {
        return next(
            new ErrorResponse("You have already reviewed this product", 400),
        );
    }
    console.log("point : 12");
    // Create review
    const reviewData = {
        rating: Number(rating),
        comment,
        product: productId,
        name: name,
        email: email.toLowerCase(),
        isGuest: true,
    };
    console.log("point : 13");
    console.log(reviewData);
    const review = await Review.create(reviewData);
    console.log("point : 14");

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    console.log("point : 15");
    product.numReviews = reviews.length;
    console.log("point : 16");
    product.rating =
        reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    console.log("point : 17");
    await product.save({ validateModifiedOnly: true });
    console.log("point : 18");

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
