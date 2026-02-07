import mongoose from "mongoose";
import userSchema from "../models/user.model.js";
import productSchema from "../models/product.model.js";
import categorySchema from "../models/category.model.js";
import orderSchema from "../models/order.model.js";
import wishlistSchema from "../models/wishlist.model.js";
import settingsSchema from "../models/settings.model.js";
import promotionSchema from "../models/promotion.model.js";


let localDbConnection = null;
let localUserModel;
let localProductModel;
let localCategoryModel;
let localOrderModel;
let localWishlistModel;
let localSettingsModel;
let localPromotionModel;


export const connectToDB = async () => {
    try {
        // MONGO_URI_ATLAS
        // MONGO_URI_LOCAL

        localDbConnection = await mongoose
            .createConnection(process.env.MONGO_URI_LOCAL)
            .asPromise();

        if (localDbConnection) {
            console.log(`Connected to MongoDB: ${localDbConnection.host}`);
        }

        localUserModel = localDbConnection.model("User", userSchema);
        localProductModel = localDbConnection.model("Product", productSchema);
        localCategoryModel = localDbConnection.model(
            "Category",
            categorySchema,
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

    } catch (error) {
        console.log(error);
    }
};

export const getLocalUserModel = () => localUserModel || null;
export const getLocalProductModel = () => localProductModel || null;
export const getLocalCategoryModel = () => localCategoryModel || null;
export const getLocalOrderModel = () => localOrderModel || null;
export const getLocalWishlistModel = () => localWishlistModel || null;
export const getLocalSettingsModel = () => localSettingsModel || null;
export const getLocalPromotionModel = () => localPromotionModel || null;

