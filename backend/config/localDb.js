import mongoose from "mongoose";
import userSchema from "../models/user.model.js";
import productSchema from "../models/product.model.js";
import collectionSchema from "../models/collection.model.js";
import orderSchema from "../models/order.model.js";
import wishlistSchema from "../models/wishlist.model.js";
import settingsSchema from "../models/settings.model.js";
import promotionSchema from "../models/promotion.model.js";
import heroSchema from "../models/hero.model.js";
import reviewSchema from "../models/review.model.js";

let connectionPromise = null;
let localDbConnection = null;
let localUserModel;
let localProductModel;
let localCollectionModel;
let localOrderModel;
let localWishlistModel;
let localSettingsModel;
let localPromotionModel;
let localHeroModel;
let localReviewModel;

export const connectToDB = async () => {
    if (connectionPromise) return connectionPromise;

    connectionPromise = (async () => {
        try {
            // MONGO_URI_ONLINE
            // MONGO_URI_LOCAL

            localDbConnection = await mongoose
                .createConnection(process.env.MONGO_URI_LOCAL, {
                    dbName: "online-shop-lite-version",
                })
                .asPromise();

            if (localDbConnection) {
                console.log(`Connected to MongoDB: ${localDbConnection.host}`);
            }

            localUserModel = localDbConnection.model("User", userSchema);
            localProductModel = localDbConnection.model(
                "Product",
                productSchema,
            );
            localCollectionModel = localDbConnection.model(
                "Collection",
                collectionSchema,
            );
            localOrderModel = localDbConnection.model("Order", orderSchema);
            localWishlistModel = localDbConnection.model(
                "Wishlist",
                wishlistSchema,
            );
            localSettingsModel = localDbConnection.model(
                "Settings",
                settingsSchema,
            );
            localPromotionModel = localDbConnection.model(
                "Promotion",
                promotionSchema,
            );
            localHeroModel = localDbConnection.model("Hero", heroSchema);
            localReviewModel = localDbConnection.model("Review", reviewSchema);

            return localDbConnection;
        } catch (error) {
            console.log("Database connection error:", error);
            connectionPromise = null; // Allow retry on next request
            throw error;
        }
    })();

    return connectionPromise;
};

export const getLocalUserModel = () => localUserModel || null;
export const getLocalProductModel = () => localProductModel || null;
export const getLocalCollectionModel = () => localCollectionModel || null;
export const getLocalOrderModel = () => localOrderModel || null;
export const getLocalWishlistModel = () => localWishlistModel || null;
export const getLocalSettingsModel = () => localSettingsModel || null;
export const getLocalPromotionModel = () => localPromotionModel || null;
export const getLocalHeroModel = () => localHeroModel || null;
export const getLocalReviewModel = () => localReviewModel || null;
