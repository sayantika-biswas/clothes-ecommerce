// components/ProductFilters.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  availableFilters,
  onClearFilters 
}) => {
  const [openSections, setOpenSections] = useState({
    color: true,
    size: true,
    brand: true,
    price: true,
    discount: true
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFilterChange = (filterType, value) => {
    onFilterChange(filterType, value);
  };

  const FilterSection = ({ title, sectionKey, children }) => (
    <div className="border-b border-gray-200 py-4">
      <button
        className="flex items-center justify-between w-full text-left font-medium text-gray-900 py-1"
        onClick={() => toggleSection(sectionKey)}
      >
        <span className="text-sm font-normal tracking-wide">{title}</span>
        {openSections[sectionKey] ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {openSections[sectionKey] && (
        <div className="mt-3 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const CheckboxFilter = ({ items, filterType, selectedItems = [] }) => (
    <div className="space-y-2">
      {items?.map((item) => (
        <label key={item.value} className="flex items-center space-x-3 cursor-pointer group">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.value)}
            onChange={() => handleFilterChange(filterType, item.value)}
            className="w-4 h-4 text-black border-gray-400 rounded focus:ring-black"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 capitalize">
            {item.label.toLowerCase()}
          </span>
          <span className="text-xs text-gray-400 ml-auto">({item.count})</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="bg-cream-white border-r border-gray-200 pr-4">
      {/* Header */}
      {/* <div className="mb-2">
        <h3 className="text-lg font-normal text-gray-900">FILTERS</h3>
      </div> */}

      <div className="space-y-0">
        {/* Color Filter */}
        {availableFilters.colors && availableFilters.colors.length > 0 && (
          <FilterSection title="Color" sectionKey="color">
            <CheckboxFilter
              items={availableFilters.colors}
              filterType="colors"
              selectedItems={filters.colors || []}
            />
          </FilterSection>
        )}

        {/* Size Filter */}
        {availableFilters.sizes && availableFilters.sizes.length > 0 && (
          <FilterSection title="Size" sectionKey="size">
            <div className="grid grid-cols-3 gap-2">
              {availableFilters.sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => handleFilterChange('sizes', size.value)}
                  className={`p-2 text-xs border rounded-sm text-center transition-all ${
                    filters.sizes?.includes(size.value)
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Brand Filter */}
        {availableFilters.brands && availableFilters.brands.length > 0 && (
          <FilterSection title="Brand" sectionKey="brand">
            <CheckboxFilter
              items={availableFilters.brands}
              filterType="brands"
              selectedItems={filters.brands || []}
            />
          </FilterSection>
        )}

        {/* Price Range Filter */}
        <FilterSection title="Price" sectionKey="price">
          <div className="space-y-3">
            {[
              { label: 'Under ₹500', value: [0, 500] },
              { label: '₹500 - ₹1000', value: [500, 1000] },
              { label: '₹1000 - ₹2000', value: [1000, 2000] },
              { label: '₹2000 - ₹5000', value: [2000, 5000] },
              { label: 'Over ₹5000', value: [5000, availableFilters.priceRange[1]] },
            ].map((range) => (
              <label key={range.label} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  name="price"
                  checked={JSON.stringify(filters.price) === JSON.stringify(range.value)}
                  onChange={() => handleFilterChange('price', range.value)}
                  className="w-4 h-4 text-black border-gray-400 focus:ring-black"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>

        {/* Discount Filter */}
        <FilterSection title="Discount" sectionKey="discount">
          <div className="space-y-2">
            {[
              { label: '10% and above', value: 10 },
              { label: '20% and above', value: 20 },
              { label: '30% and above', value: 30 },
              { label: '40% and above', value: 40 },
              { label: '50% and above', value: 50 },
            ].map((discount) => (
              <label key={discount.value} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.discount === discount.value}
                  onChange={() => handleFilterChange('discount', discount.value)}
                  className="w-4 h-4 text-black border-gray-400 rounded focus:ring-black"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  {discount.label}
                </span>
              </label>
            ))}
          </div>
        </FilterSection>
      </div>
    </div>
  );
};

export default ProductFilters;