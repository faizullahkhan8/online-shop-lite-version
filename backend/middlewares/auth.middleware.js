import { getLocalUserModel } from "../config/localDb.js";
import { generateToken, setCookie, verifyToken } from "../utils/jwt.js";
import { ErrorResponse } from "../utils/ErrorResponse.js";
import expressAsyncHandler from "express-async-handler";

export const isAuth = expressAsyncHandler(async (req, res, next) => {
    const UserModel = getLocalUserModel();

    if (!UserModel) {
        return next(new ErrorResponse("User model not found", 404));
    }

    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    let accessDecode;
    let refreshDecode;

    if (accessToken) {
        accessDecode = await verifyToken(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        );
    }

    if (refreshToken) {
        refreshDecode = await verifyToken(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );
    }

    if (!accessDecode && !refreshDecode) {
        return next(new ErrorResponse("Session Expired Login Again", 401));
    }

    const user = await UserModel.findById(refreshDecode.id);

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    if (!accessDecode && refreshDecode) {
        const newAcessToken = generateToken(
            user,
            "1d",
            process.env.JWT_ACCESS_SECRET
        );

        setCookie(res, newAcessToken, 1000 * 60 * 60 * 24, "accessToken");
    }

    req.user = user;

    next();
});

export const authorize = (role = []) =>
    expressAsyncHandler(async (req, res, next) => {
        if (!role.includes(req.user.role)) {
            return next(new ErrorResponse("Unauthorized", 401));
        }
        next();
    });
