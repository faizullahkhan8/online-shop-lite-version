/**
 * SuppliersByRegion Component
 * Shows a grid of countries where we have suppliers
 * 
 * Used on: Home Page
 * 
 * Note: Country data is imported from constants file
 * This makes it easy to update the list in one place
 */

import { memo } from "react";
import { SUPPLIER_COUNTRIES } from "../../constants";

const SuppliersByRegion = () => {
    return (
        <section className="max-w-7xl mx-auto">
            {/* Section Heading */}
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                Suppliers by region
            </h2>
            
            {/* Countries Grid - Responsive layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {SUPPLIER_COUNTRIES.map((region) => (
                    <div
                        key={region.country}
                        className="bg-white border border-gray-200 rounded-md p-3 
                                   flex items-center gap-3 hover:shadow-md 
                                   transition-shadow cursor-pointer group"
                    >
                        {/* Country Flag Emoji */}
                        <span className="text-2xl">{region.flag}</span>
                        
                        {/* Country Name */}
                        <span className="text-sm font-medium text-gray-700 
                                       group-hover:text-primary transition-colors">
                            {region.country}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
};

// Prevent re-renders when parent updates
SuppliersByRegion.displayName = 'SuppliersByRegion';

export default memo(SuppliersByRegion);
