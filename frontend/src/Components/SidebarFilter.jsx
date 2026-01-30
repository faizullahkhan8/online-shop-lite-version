import { ChevronUp, ChevronDown, Star } from "lucide-react";
import { useState, useEffect } from "react";

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-gray-200 py-4 first:border-0 ">
      <button 
        className="flex items-center justify-between w-full mb-3 font-semibold text-gray-800 hover:text-primary transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
      </button>
      {isOpen && <div className="space-y-2 animate-fadeIn">{children}</div>}
    </div>
  );
};

const SidebarFilter = ({ filters, onFilterChange }) => {
  // Local state for price inputs to avoid triggering on every keystroke
  const [priceRange, setPriceRange] = useState({ min: filters.minPrice || '', max: filters.maxPrice || '' });

  useEffect(() => {
    setPriceRange({ min: filters.minPrice || '', max: filters.maxPrice || '' });
  }, [filters.minPrice, filters.maxPrice]);

  const handleCheckboxChange = (category, value) => {
    const currentValues = filters[category] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];
    
    onFilterChange({ [category]: newValues });
  };

  const handleRadioChange = (category, value) => {
    onFilterChange({ [category]: value });
  };

  const handlePriceApply = () => {
    onFilterChange({ 
      minPrice: priceRange.min, 
      maxPrice: priceRange.max 
    });
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block pr-4">
      {/* Category */}
      <FilterSection title="Category">
        <div className="flex flex-col gap-2 text-gray-600">
             {["Mobile accessory", "Electronics", "Smartphones", "Modern tech"].map((cat) => (
                 <button 
                    key={cat}
                    onClick={() => onFilterChange({ category: cat })}
                    className={`text-left hover:text-primary transition-colors ${filters.category === cat ? 'text-primary font-medium' : ''}`}
                 >
                    {cat}
                 </button>
             ))}
             <button onClick={() => onFilterChange({ category: '' })} className="text-primary text-sm mt-1 text-left hover:underline">See all</button>
        </div>
      </FilterSection>

      {/* Brands */}
      <FilterSection title="Brands">
        {["Samsung", "Apple", "Huawei", "Pocco", "Lenovo"].map((brand) => (
          <label key={brand} className="flex items-center gap-2 cursor-pointer group">
            <input 
                type="checkbox" 
                checked={filters.brands?.includes(brand) || false}
                onChange={() => handleCheckboxChange('brands', brand)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
            />
            <span className="text-gray-600 group-hover:text-gray-900">{brand}</span>
          </label>
        ))}
      </FilterSection>

      {/* Features */}
      <FilterSection title="Features">
         {["Metallic", "Plastic cover", "8GB Ram", "Super power", "Large Memory"].map((feature) => (
          <label key={feature} className="flex items-center gap-2 cursor-pointer group">
            <input 
                type="checkbox" 
                checked={filters.features?.includes(feature) || false}
                onChange={() => handleCheckboxChange('features', feature)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
            />
            <span className="text-gray-600 group-hover:text-gray-900">{feature}</span>
          </label>
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price range">
         <input 
            type="range" 
            min="0" 
            max="10000" 
            value={priceRange.max || 1000} 
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-4" 
         />
         <div className="flex items-center gap-3">
             <div className="flex-1">
                 <label className="text-xs text-gray-500 mb-1 block">Min</label>
                 <input 
                    type="number" 
                    placeholder="0" 
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary" 
                 />
             </div>
             <div className="flex-1">
                 <label className="text-xs text-gray-500 mb-1 block">Max</label>
                 <input 
                    type="number" 
                    placeholder="99999" 
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-primary" 
                 />
             </div>
         </div>
         <button 
            onClick={handlePriceApply}
            className="w-full mt-3 bg-white border border-gray-200 text-primary font-medium py-1.5 rounded hover:bg-gray-50 transition-colors shadow-sm active:scale-95 duration-200"
         >
            Apply
         </button>
      </FilterSection>

       {/* Condition */}
       <FilterSection title="Condition">
          {["Any", "Refurbished", "Brand new", "Old items"].map((item) => (
            <label key={item} className="flex items-center gap-2 cursor-pointer group">
                <input 
                    type="radio" 
                    name="condition" 
                    checked={(filters.condition === item) || (item === 'Any' && !filters.condition)}
                    onChange={() => handleRadioChange('condition', item === 'Any' ? '' : item)}
                    className="w-4 h-4 text-primary focus:ring-primary" 
                />
                <span className="text-gray-600 group-hover:text-gray-900">{item}</span>
            </label>
          ))}
       </FilterSection>

       {/* Ratings */}
       <FilterSection title="Ratings">
          {[5, 4, 3, 2].map((stars) => (
              <label key={stars} className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded p-1 -ml-1">
                  <input 
                    type="checkbox" 
                    checked={filters.rating === stars}
                    onChange={() => handleRadioChange('rating', filters.rating === stars ? null : stars)}
                    className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" 
                  />
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} fill={i < stars ? "currentColor" : "none"} className={i < stars ? "text-amber-500" : "text-gray-300"} />
                    ))}
                  </div>
              </label>
          ))}
       </FilterSection>
    </aside>
  );
};

export default SidebarFilter;
