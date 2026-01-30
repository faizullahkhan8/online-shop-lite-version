import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDB } from "./config/localDb.js";
import userRouter from "./routers/user.router.js";
import productRouter from "./routers/product.router.js";
import categoryRouter from "./routers/category.router.js";
import orderRouter from "./routers/order.router.js";

import { errorHandler } from "./middlewares/ErrorHandler.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use("/public", express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        credentials: true,
    })
);

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);

app.use(errorHandler);
connectToDB();

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
