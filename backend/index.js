import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { resolve } from "path";

// import {
//     checkoutLimiter,
//     trackingLimiter,
//     generalLimiter,
// } from "./middlewares/rateLimiters.js";
import { connectToDB } from "./config/localDb.js";
import userRouter from "./routers/user.router.js";
import productRouter from "./routers/product.router.js";
import collectionRouter from "./routers/collection.router.js";
import orderRouter from "./routers/order.router.js";
import settingsRouter from "./routers/settings.router.js";
import promotionRouter from "./routers/promotion.router.js";
import heroRouter from "./routers/hero.router.js";
import reviewRouter from "./routers/review.router.js";

import { errorHandler } from "./middlewares/ErrorHandler.js";
import cookieParser from "cookie-parser";
dotenv.config();

const app = express();
app.use(express.static("dist"));
app.use("/public", express.static("public"));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());

// CORS: Must be early, before route handlers and rate limiters
const corsOptions = {
    origin: (origin, callback) => {
        callback(null, true); // har origin allow
    },
    credentials: true,
};

app.use(cors(corsOptions));

// app.use(
//     cors({
//         origin: ["http://localhost:5173"],
//         credentials: true,
//         methods: ["POST", "DELETE", "PUT", "PATCH", "GET"],
//     }),
// );

// Security: Helmet headers
app.use(helmet());

// Custom sanitization: Remove MongoDB operators from body/params (not query which is read-only)
app.use((req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== "object" || obj === null) return;
        for (const key in obj) {
            if (key.includes("$") || key.includes(".")) {
                delete obj[key];
            } else if (typeof obj[key] === "object") {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    if (req.params) sanitize(req.params);
    next();
});

// Apply general rate limit to all API requests
// app.use("/api/", generalLimiter);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the API" });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/collections", collectionRouter);
app.use("/api/orders", orderRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/promotions", promotionRouter);
app.use("/api/hero", heroRouter);
app.use("/api/reviews", reviewRouter);

app.get("/{*splat}", (req, res) => {
    res.sendFile(process.cwd() + "/dist/index.html");
});

app.get("/{*splat}", (req, res) => {
    res.sendFile(resolve("dist/index.html"));
});

app.use(errorHandler);

// Connect to DB once at startup, then start the server
connectToDB()
    .then(() => {
        console.log("✅ Database connected successfully");
        app.listen(process.env.PORT || 3000, () => {
            console.log(
                `Server is running on port ${process.env.PORT || 3000}`,
            );
        });
    })
    .catch((err) => {
        console.error("❌ Initial DB connection failed:", err);
        process.exit(1);
    });
