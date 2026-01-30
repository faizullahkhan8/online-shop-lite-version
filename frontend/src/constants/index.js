/**
 * Constants used throughout the application
 * Keeping values in one place makes them easier to update and maintain
 */

// ============================================
// SUPPLIER REGIONS
// ============================================
// List of countries where we have suppliers
// Used in the SuppliersByRegion component on home page
export const SUPPLIER_COUNTRIES = [
    { country: "Arabic Emirates", flag: "🇦🇪" },
    { country: "Australia", flag: "🇦🇺" },
    { country: "United States", flag: "🇺🇸" },
    { country: "Russia", flag: "🇷🇺" },
    { country: "Italy", flag: "🇮🇹" },
    { country: "Germany", flag: "🇩🇪" },
    { country: "Great Britain", flag: "🇬🇧" },
    { country: "France", flag: "🇫🇷" },
    { country: "China", flag: "🇨🇳" },
];

// ============================================
// PRICING TIERS
// ============================================
// Different pricing based on order quantity
// These multipliers are applied to the base product price
const PRICING = {
    // Small orders get 10% discount
    TIER_1_MULTIPLIER: 0.9,
    TIER_1_LABEL: "50-100 pcs",
    
    // Medium orders - standard markup
    TIER_2_MULTIPLIER: 1.25,
    TIER_2_LABEL: "100-200 pcs",
    
    // Large orders - higher price per unit
    TIER_3_MULTIPLIER: 2.5,
    TIER_3_LABEL: ">500 pcs",
};

// ============================================
// PRODUCT MOCK DATA
// ============================================
// Default values for product enrichment
// Used when API doesn't provide these fields
const PRODUCT_DEFAULTS = {
    REVIEW_COUNT: 32,
    SOLD_COUNT: 154,
    PRICE_TYPE: "Negotiable",
    PRODUCT_TYPE: "Classic style",
    MATERIAL: "Presto material",
    DESIGN: "Modern nick",
    CUSTOMIZATION: "Customized logo and design custom packages",
    PROTECTION: "Refund Policy",
    WARRANTY: "2 years full warranty",
};

// ============================================
// MODEL SPECIFICATIONS
// ============================================
// Sample model/spec data for product detail page
const MODEL_SPECS = {
    STYLE: "Classic style",
    CERTIFICATE: "ISO-9001+CTTY",
    SIZE: "34mm x 450mm x 19mm",
    MEMORY: "36GB RAM",
    FEATURES: [
        "Some great features come here",
        "Lorem ipsum dolor sit amet, consectetur",
        "Duis aute irure dolor in reprehenderit",
        "Some great feature name here"
    ]
};

// ============================================
// SUPPLIER INFO
// ============================================
// Default supplier information
const SUPPLIER_INFO = {
    NAME: "Supplier Trading LLC",
    VERIFIED: true,
    COUNTRY: {
        name: "Germany",
        city: "Berlin",
        flag: "🇩🇪"
    },
    WORLDWIDE_SHIPPING: true
};

// ============================================
// LOADING MESSAGES
// ============================================
// User-friendly loading messages
export const LOADING_MESSAGES = {
    PRODUCT: "Loading product details...",
    PRODUCTS: "Loading products...",
    PAGE: "Loading page...",
    CART: "Loading cart...",
    ORDERS: "Loading orders...",
};

// ============================================
// ERROR MESSAGES  
// ============================================
// Friendly error messages for users
const ERROR_MESSAGES = {
    PRODUCT_NOT_FOUND: "Sorry, we couldn't find that product.",
    NETWORK_ERROR: "Oops! Please check your internet connection.",
    GENERIC_ERROR: "Something went wrong. Please try again.",
    LOGIN_REQUIRED: "Please log in to continue.",
};

// ============================================
// UI CONSTANTS
// ============================================
// Common UI values used across components
const UI = {
    // Toast notification duration
    TOAST_DURATION: 3000,
    
    // How many items to show per page
    ITEMS_PER_PAGE: 10,
    
    // Animation durations (in milliseconds)
    ANIMATION_FAST: 150,
    ANIMATION_NORMAL: 300,
    ANIMATION_SLOW: 500,
};
