/**
 * Utility functions for pricing calculations
 * These help keep our components clean and logic reusable
 */

import { PRICING } from "../constants";

/**
 * Calculate price tiers for bulk ordering
 * @param {number} basePrice - The original product price
 * @returns {Array} Array of price tier objects with quantity and price
 *
 * Example: calculatePriceTiers(10)
 * Returns: [
 *   { quantity: "50-100 pcs", price: 9.00 },
 *   { quantity: "100-200 pcs", price: 12.50 },
 *   { quantity: ">500 pcs", price: 25.00 }
 * ]
 */
export const calculatePriceTiers = (basePrice) => {
    // Make sure we have a valid price
    if (!basePrice || basePrice <= 0) {
        console.warn("Invalid base price provided:", basePrice);
        return [];
    }

    return [
        {
            quantity: PRICING.TIER_1_LABEL,
            price: basePrice * PRICING.TIER_1_MULTIPLIER,
        },
        {
            quantity: PRICING.TIER_2_LABEL,
            price: basePrice * PRICING.TIER_2_MULTIPLIER,
        },
        {
            quantity: PRICING.TIER_3_LABEL,
            price: basePrice * PRICING.TIER_3_MULTIPLIER,
        },
    ];
};

/**
 * Format price to display with 2 decimal places
 * @param {number} price - Price to format
 * @returns {string} Formatted price string
 *
 * Example: formatPrice(10.5) returns "Rs:10.50"
 */
export const formatPrice = (price) => {
    if (typeof price !== "number") {
        return "Rs: 0.00";
    }
    return `$Rs: {price.toFixed(2)}`;
};

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountedPrice - Price after discount
 * @returns {number} Discount percentage
 *
 * Example: calculateDiscount(100, 75) returns 25
 */
export const calculateDiscount = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) {
        return 0;
    }

    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
};
