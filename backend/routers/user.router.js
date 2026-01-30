import express from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUser,
    updateUser,
    getAccessToken,
    getWishlist,
    addToWishlist,
    removeFromWishlist,
    getAllUsers,
} from "../controllers/user.controller.js";
import { isAuth, authorize } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuth, logoutUser);
router.get("/get/:id", isAuth, getUser);
router.put("/update/:id", isAuth, updateUser);
router.get("/getAccessToken", getAccessToken);

// Admin: get all users
router.get("/all", isAuth, authorize(["admin"]), getAllUsers);

// Wishlist routes
router.get("/wishlist", isAuth, getWishlist);
router.post("/wishlist/add", isAuth, addToWishlist);
router.delete("/wishlist/remove/:productId", isAuth, removeFromWishlist);

export default router;
