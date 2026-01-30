import mongoose from "mongoose";
import userSchema from "../models/user.model.js";
import productSchema from "../models/product.model.js";
import categorySchema from "../models/category.model.js";
import orderSchema from "../models/order.model.js";
import wishlistSchema from "../models/wishlist.model.js";

let localDbConnection = null;
let localUserModel;
let localProductModel;
let localCategoryModel;
let localOrderModel;
let localWishlistModel;

export const connectToDB = () => {
    localDbConnection = mongoose.createConnection(process.env.MONGO_URL);

    if (localDbConnection) {
        console.log(`Connected to MongoDB: ${localDbConnection.host}`);
    }

    localUserModel = localDbConnection.model("User", userSchema);
    localProductModel = localDbConnection.model("Product", productSchema);
    localCategoryModel = localDbConnection.model("Category", categorySchema);
    localOrderModel = localDbConnection.model("Order", orderSchema);
    localWishlistModel = localDbConnection.model("Wishlist", wishlistSchema);
};

export const getLocalUserModel = () => localUserModel || null;
export const getLocalProductModel = () => localProductModel || null;
export const getLocalCategoryModel = () => localCategoryModel || null;
export const getLocalOrderModel = () => localOrderModel || null;
export const getLocalWishlistModel = () => localWishlistModel || null;
