import asyncHandler from "express-async-handler";
import {
    getLocalUserModel,
    getLocalWishlistModel,
    getLocalProductModel,
} from "../config/localDb.js";
import { generateToken, setCookie, verifyToken } from "../utils/jwt.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";

export const registerUser = asyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel) {
        return next(new ErrorResponse("User model not initiated.", 404));
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorResponse("All fields are required", 400));
    }

    const isEmailExists = await UserModel.findOne({ email });

    if (isEmailExists) {
        return next(new ErrorResponse("Email already exists", 400));
    }

    let user;

    try {
        user = await UserModel.create({
            name,
            email,
            password,
            phone: "0331234567",
        });
    } catch (error) {
        console.error("CREATE USER ERROR:", error);
        return next(error);
    }

    const refreshToken = generateToken(
        user,
        "7d",
        process.env.JWT_REFRESH_SECRET
    );
    const accessToken = generateToken(
        user,
        "1d",
        process.env.JWT_ACCESS_SECRET
    );

    setCookie(res, refreshToken, 1000 * 60 * 60 * 24 * 7, "refreshToken");
    setCookie(res, accessToken, 1000 * 60 * 60 * 24, "accessToken");

    return res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: user,
    });
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel) {
        return next(new ErrorResponse("User model not initiated.", 404));
    }

    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("All fields are required", 400));
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 400));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorResponse("Invalid credentials", 400));
    }

    const refreshToken = generateToken(
        user,
        "7d",
        process.env.JWT_REFRESH_SECRET
    );
    const accessToken = generateToken(
        user,
        "1d",
        process.env.JWT_ACCESS_SECRET
    );

    setCookie(res, refreshToken, 1000 * 60 * 60 * 24 * 7, "refreshToken");
    setCookie(res, accessToken, 1000 * 60 * 60 * 24, "accessToken");

    return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: user,
    });
});

export const logoutUser = asyncHandler(async (req, res, next) => {
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    return res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
});

export const getUser = asyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel) {
        return next(new ErrorResponse("User model not initiated.", 404));
    }

    const user = await UserModel.findById(req.params.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    return res.status(200).json({
        success: true,
        message: "User fetched successfully",
        user: user,
    });
});

export const updateUser = asyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel) {
        return next(new ErrorResponse("User model not initiated.", 404));
    }

    const userId = req.params.id;
    const { name, phone, address } = req.body;

    const user = await UserModel.findById(userId);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;
    address && user.addresses.push({ address });

    const updatedUser = await user.save({ validateModifiedOnly: true });

    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user: updatedUser,
    });
});

export const getAllUsers = asyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel)
        return next(new ErrorResponse("User model not initiated.", 404));

    const users = await UserModel.find({}).select("-password");

    return res
        .status(200)
        .json({ success: true, message: "Users fetched", users });
});

export const getAccessToken = asyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel) {
        return next(new ErrorResponse("User model not initiated.", 404));
    }

    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new ErrorResponse("Session expired. Login again", 401));
    }

    const decoded = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET);

    if (!decoded) {
        return next(new ErrorResponse("Session expired. Login again", 401));
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    const accessToken = generateToken(
        user,
        "1d",
        process.env.JWT_ACCESS_SECRET
    );

    if (!accessToken) {
        return next(new ErrorResponse("Access token not generated", 400));
    }

    setCookie(res, accessToken, 1000 * 60 * 60 * 24, "accessToken");

    return res.status(200).json({
        success: true,
        message: "Access token generated successfully",
    });
});

export const getWishlist = asyncHandler(async (req, res, next) => {
    const WishlistModel = getLocalWishlistModel();

    if (!WishlistModel)
        return next(new ErrorResponse("Wishlist model not initiated.", 404));

    const wishlistDoc = await WishlistModel.findOne({
        userId: req.user._id,
    }).populate({ path: "items.product", model: "Product" });

    if (!wishlistDoc) {
        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: [],
        });
    }

    const products = wishlistDoc.items.map((i) => i.product).filter(Boolean);

    return res.status(200).json({
        success: true,
        message: "Wishlist fetched successfully",
        wishlist: products,
    });
});

export const addToWishlist = asyncHandler(async (req, res, next) => {
    const WishlistModel = getLocalWishlistModel();
    const ProductModel = getLocalProductModel();
    const UserModel = getLocalUserModel();

    if (!WishlistModel)
        return next(new ErrorResponse("Wishlist model not initiated.", 404));

    const { productId } = req.body;

    if (!productId)
        return next(new ErrorResponse("Product id is required", 400));

    const product = await ProductModel.findById(productId);
    if (!product) return next(new ErrorResponse("Product not found", 404));

    let wishlistDoc = await WishlistModel.findOne({ userId: req.user._id });

    if (!wishlistDoc) {
        wishlistDoc = await WishlistModel.create({
            userId: req.user._id,
            items: [{ product: productId }],
        });
        // attach wishlist ref to user document
        const user = await UserModel.findById(req.user._id);
        if (user) {
            user.wishlist = wishlistDoc._id;
            await user.save({ validateModifiedOnly: true });
        }
    } else {
        const exists = wishlistDoc.items.find(
            (i) => i.product.toString() === productId.toString()
        );
        if (!exists) {
            wishlistDoc.items.push({ product: productId });
            await wishlistDoc.save({ validateModifiedOnly: true });
        }
    }

    await wishlistDoc.populate({ path: "items.product", model: "Product" });

    const products = wishlistDoc.items.map((i) => i.product).filter(Boolean);

    return res.status(200).json({
        success: true,
        message: "Product added to wishlist",
        wishlist: products,
    });
});

export const removeFromWishlist = asyncHandler(async (req, res, next) => {
    const WishlistModel = getLocalWishlistModel();

    if (!WishlistModel)
        return next(new ErrorResponse("Wishlist model not initiated.", 404));

    const { productId } = req.params;

    const wishlistDoc = await WishlistModel.findOne({ userId: req.user._id });

    if (!wishlistDoc)
        return res.status(200).json({
            success: true,
            message: "Wishlist fetched successfully",
            wishlist: [],
        });

    wishlistDoc.items = wishlistDoc.items.filter(
        (i) => i.product.toString() !== productId.toString()
    );
    await wishlistDoc.save({ validateModifiedOnly: true });

    await wishlistDoc.populate({ path: "items.product", model: "Product" });

    const products = wishlistDoc.items.map((i) => i.product).filter(Boolean);

    return res.status(200).json({
        success: true,
        message: "Product removed from wishlist",
        wishlist: products,
    });
});
