import { z } from "zod";

/**
 * Validation schemas for guest checkout order
 * Zod provides runtime validation with excellent error messages
 */

// Phone number regex: allows digits, spaces, dashes, parentheses, plus
const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;

// MongoDB ObjectId regex
const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

export const RecipientSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .trim(),
    street: z
        .string()
        .min(5, "Street address must be at least 5 characters")
        .max(255, "Street address must be less than 255 characters")
        .trim(),
    addressLine2: z
        .string()
        .max(255, "Address line 2 must be less than 255 characters")
        .optional()
        .default(""),
    city: z
        .string()
        .min(2, "City must be at least 2 characters")
        .max(100, "City must be less than 100 characters")
        .trim(),
    state: z
        .string()
        .min(2, "State must be at least 2 characters")
        .max(100, "State must be less than 100 characters")
        .trim()
        .optional()
        .default(""),
    postalCode: z
        .string()
        .min(2, "Postal code must be at least 2 characters")
        .max(20, "Postal code must be less than 20 characters")
        .trim(),
    country: z
        .string()
        .min(2, "Country must be at least 2 characters")
        .max(100, "Country must be less than 100 characters")
        .trim(),
    phone: z
        .string()
        .regex(phoneRegex, "Phone number must be valid (at least 10 digits)")
        .min(10, "Phone number must be at least 10 characters")
        .max(20, "Phone number must be less than 20 characters"),
});

export const OrderItemSchema = z.object({
    product: z.string().regex(mongoIdRegex, "Invalid product ID"),
    quantity: z
        .number()
        .int("Quantity must be a whole number")
        .min(1, "Quantity must be at least 1")
        .max(1000, "Quantity must be less than 1000"),
    price: z
        .number()
        .positive("Price must be a positive number")
        .finite("Price must be a valid number"),
    originalPrice: z
        .number()
        .positive("Original price must be positive")
        .optional(),
    promotion: z
        .object({
            id: z.string().regex(mongoIdRegex).optional(),
            title: z.string().optional(),
            type: z.string().optional(),
            discountType: z.string().optional(),
            discountValue: z.number().optional(),
        })
        .optional()
        .nullable(),
});

export const PaymentSchema = z.object({
    method: z.enum(["COD", "card", "online"], {
        errorMap: () => ({
            message: "Invalid payment method. Must be COD, card, or online",
        }),
    }),
    ispaid: z.boolean().optional().default(false),
});

export const PlaceOrderSchema = z.object({
    items: z
        .array(OrderItemSchema)
        .min(1, "Order must have at least one item")
        .max(100, "Order cannot have more than 100 items"),
    recipient: RecipientSchema,
    payment: PaymentSchema,
    taxAmount: z
        .number()
        .nonnegative("Tax amount must be non-negative")
        .finite("Tax amount must be a valid number")
        .optional()
        .default(0),
    shippingFee: z
        .number()
        .nonnegative("Shipping fee must be non-negative")
        .finite("Shipping fee must be a valid number")
        .optional()
        .default(0),
    shippingMethod: z
        .enum(["standard", "pickup", "express"], {
            errorMap: () => ({ message: "Invalid shipping method" }),
        })
        .optional()
        .default("standard"),
    status: z
        .enum(["pending", "shipped", "delivered", "cancelled"])
        .optional()
        .default("pending"),
});

/**
 * Validation helper function
 * Throws ErrorResponse if validation fails
 */
export const validateOrderData = (data) => {
    try {
        return PlaceOrderSchema.parse(data);
    } catch (error) {
        // Extract first error message
        const firstError = error.errors[0];
        const fieldPath =
            firstError.path.length > 0
                ? firstError.path.join(".")
                : "unknown field";

        return {
            valid: false,
            error: {
                field: fieldPath,
                message: firstError.message,
                code: "VALIDATION_ERROR",
            },
        };
    }
};

export default {
    PlaceOrderSchema,
    RecipientSchema,
    OrderItemSchema,
    PaymentSchema,
    validateOrderData,
};
