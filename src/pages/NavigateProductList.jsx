// NavigateproductList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { Filter, X } from 'lucide-react';
import axios from '../utils/axios';

const NavigateproductList = () => {
  const { gender, categorySlug, subcategorySlug } = useParams();
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    brands: [],
    sizes: [],
    colors: [],
    price: null,
    discount: null
  });

  // Available filters
  const [availableFilters, setAvailableFilters] = useState({
    brands: [],
    sizes: [],
    colors: [],
    priceRange: [0, 10000]
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/products');
        if (response.data.success) {
          const allProducts = response.data.products;
          
          // Filter products based on navigation slugs
          const filteredProducts = allProducts.filter(
            (product) =>
              product.category === gender &&
              product.subCategory === categorySlug &&
              product.productType === subcategorySlug
          );
          
          setProducts(filteredProducts);
          extractAvailableFilters(filteredProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [gender, categorySlug, subcategorySlug]);

  const extractAvailableFilters = (products) => {
    const brands = [...new Set(products.map(p => p.brand))];
    const sizes = [...new Set(products.flatMap(p => 
      p.sizes?.map(size => size.size) || []
    ))];
    const colors = [...new Set(products.map(p => p.color))];
    const prices = products.map(p => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    setAvailableFilters({
      brands: brands.map(brand => ({ 
        label: brand, 
        value: brand,
        count: products.filter(p => p.brand === brand).length 
      })),
      sizes: sizes.map(size => ({ 
        label: size, 
        value: size,
        count: products.filter(p => p.sizes?.some(s => s.size === size && s.inStock)).length 
      })),
      colors: colors.map(color => ({ 
        label: color, 
        value: color,
        count: products.filter(p => p.color === color).length 
      })),
      priceRange: [minPrice, maxPrice]
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      if (filterType === 'price' || filterType === 'discount') {
        // For radio buttons, set the value directly
        if (filterType === 'price') {
          return { ...prev, price: JSON.stringify(prev.price) === JSON.stringify(value) ? null : value };
        }
        return { ...prev, [filterType]: prev[filterType] === value ? null : value };
      }
      
      // For array-based filters (brands, sizes, colors)
      const currentArray = prev[filterType] || [];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return { ...prev, [filterType]: newArray };
    });
  };

  const handleClearFilters = () => {
    setFilters({
      brands: [],
      sizes: [],
      colors: [],
      price: null,
      discount: null
    });
  };

  // Apply filters to products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
        return false;
      }

      // Size filter
      if (filters.sizes.length > 0) {
        const hasSelectedSize = product.sizes?.some(size => 
          filters.sizes.includes(size.size) && size.inStock
        );
        if (!hasSelectedSize) return false;
      }

      // Color filter
      if (filters.colors.length > 0 && !filters.colors.includes(product.color)) {
        return false;
      }

      // Price filter
      if (filters.price) {
        const [minPrice, maxPrice] = filters.price;
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }
      }

      // Discount filter
      if (filters.discount && product.discount < filters.discount) {
        return false;
      }

      return true;
    });
  }, [products, filters]);

  // Sort products
  const sortedProducts = useMemo(() => {
    const sorted = [...filteredProducts];

    switch (sortBy) {
      case 'price-low-high':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high-low':
        return sorted.sort((a, b) => b.price - a.price);
      case 'rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'discount':
        return sorted.sort((a, b) => b.discount - a.discount);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      default:
        return sorted.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.rating - a.rating;
        });
    }
  }, [filteredProducts, sortBy]);

  const getActiveFiltersCount = () => {
    return Object.values(filters).reduce((count, filter) => {
      if (Array.isArray(filter)) return count + filter.length;
      if (filter !== null && filter !== '') return count + 1;
      return count;
    }, 0);
  };

  return (
    <div className="min-h-screen bg-cream-white font-serif">
      {/* Header Section
      <div className="border-b border-gray-200">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-light tracking-tight text-gray-900">StyleCart</h1>
                <p className="text-sm text-gray-600 mt-1">Never Blend In</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Featured Collections</p>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {gender} {categorySlug && `› ${categorySlug}`} {subcategorySlug && `› ${subcategorySlug}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-20 py-8">
        <div className="flex  gap-12">
          {/* Desktop Filters - Clean Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <ProductFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              availableFilters={availableFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Mobile Filters Overlay */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/40 bg-opacity-50" onClick={() => setShowFilters(false)} />
              <div className="fixed top-0 left-0 h-full w-80 bg-cream-white overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-6">
                  {/* <h3 className="text-lg font-medium">FILTERS</h3> */}
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <ProductFilters
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableFilters={availableFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>
          )}

          {/* Products Section */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <div>
                <h2 className="text-lg font-normal text-gray-900 mb-2 capitalize">
                  {subcategorySlug ? subcategorySlug.replace(/-/g, ' ') : 'All Products'}
                </h2>
                <p className="text-sm text-gray-600">
                  Showing {sortedProducts.length} products
                </p>
              </div>

              <div className="flex items-center gap-6 mt-4 lg:mt-0">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-sm"
                >
                  <Filter className="w-4 h-4" />
                  <span className="text-sm">Filters</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border-0 bg-transparent text-sm font-normal text-gray-900 focus:outline-none focus:ring-0 py-1"
                  >
                    <option value="featured">Relevance</option>
                    <option value="newest">New In</option>
                    <option value="price-low-high">Price: Low to High</option>
                    <option value="price-high-low">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Active Filters Bar */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {filters.colors?.map(color => (
                  <span
                    key={color}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs capitalize"
                  >
                    {color.toLowerCase()}
                    <button
                      onClick={() => handleFilterChange('colors', color)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {filters.sizes?.map(size => (
                  <span
                    key={size}
                    className="inline-flex items-center px-3 py-1 bg-gray-100 rounded-full text-xs"
                  >
                    {size}
                    <button
                      onClick={() => handleFilterChange('sizes', size)}
                      className="ml-2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <button
                  onClick={handleClearFilters}
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-sm mb-2">No products found</div>
                <p className="text-gray-500 text-sm mb-4">Try adjusting your filters</p>
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-2 bg-black text-white text-sm rounded-sm hover:bg-gray-800"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigateproductList;