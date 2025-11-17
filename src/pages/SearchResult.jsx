import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Filter, Grid, List, X, SlidersHorizontal } from 'lucide-react';
import axios from '../utils/axios';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';

const SearchResults = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    colors: [], 
    sizes: [],
    brands: [],
    price: null,
    discount: null
  });

  const [availableFilters, setAvailableFilters] = useState({
    colors: [],
    sizes: [],
    brands: [],
    priceRange: [0, 10000]
  });

  const location = useLocation();
  const navigate = useNavigate();
  
  // Parse URL parameters on component mount and when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {
      colors: searchParams.get('colors')?.split(',').filter(Boolean) || [],
      sizes: searchParams.get('sizes')?.split(',').filter(Boolean) || [],
      brands: searchParams.get('brands')?.split(',').filter(Boolean) || [],
      price: searchParams.get('price') ? searchParams.get('price').split('-').map(Number) : null,
      discount: searchParams.get('discount') ? parseInt(searchParams.get('discount')) : null
    };
    
    console.log('Parsed URL filters:', urlFilters);
    setFilters(urlFilters);
  }, [location.search]);

  // Fetch search results when search query or filters change
  useEffect(() => {
    fetchSearchResults();
  }, [location.search]);

  const updateURL = (newFilters) => {
    const searchParams = new URLSearchParams();
    const currentSearchParams = new URLSearchParams(location.search);
    
    // Preserve search query
    const searchQuery = currentSearchParams.get('q');
    if (searchQuery) {
      searchParams.set('q', searchQuery);
    }
    
    // Add filters to URL parameters
    if (newFilters.colors.length > 0) {
      searchParams.set('colors', newFilters.colors.join(','));
    }
    if (newFilters.sizes.length > 0) {
      searchParams.set('sizes', newFilters.sizes.join(','));
    }
    if (newFilters.brands.length > 0) {
      searchParams.set('brands', newFilters.brands.join(','));
    }
    if (newFilters.price) {
      searchParams.set('price', newFilters.price.join('-'));
    }
    if (newFilters.discount) {
      searchParams.set('discount', newFilters.discount.toString());
    }
    
    const newUrl = `/search?${searchParams.toString()}`;
    console.log('Updating URL to:', newUrl);
    
    // Update URL without page reload
    navigate(newUrl, { replace: true });
  };

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get('q');
      
      if (!searchQuery) {
        setProducts([]);
        setTotalResults(0);
        setLoading(false);
        return;
      }
      
      // Build API parameters from URL
      const params = {
        q: searchQuery,
        ...(filters.colors.length > 0 && { colors: filters.colors.join(',') }),
        ...(filters.sizes.length > 0 && { sizes: filters.sizes.join(',') }),
        ...(filters.brands.length > 0 && { brands: filters.brands.join(',') }),
        ...(filters.price && { minPrice: filters.price[0], maxPrice: filters.price[1] }),
        ...(filters.discount && { discount: filters.discount })
      };

      console.log('API Request Params:', params);

      const response = await axios.get('/search', { params });
      console.log('Search API Response:', response.data);
      
      if (response.data.success) {
        const productsData = response.data.data?.products || [];
        setProducts(productsData);
        setTotalResults(productsData.length);
        
        // Use available filters from backend if available
        if (response.data.data?.availableFilters) {
          setAvailableFilters(response.data.data.availableFilters);
        } else {
          // Fallback to client-side extraction
          extractAvailableFilters(productsData);
        }
      } else {
        setProducts([]);
        setTotalResults(0);
        setAvailableFilters({
          colors: [],
          sizes: [],
          brands: [],
          priceRange: [0, 10000]
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to load search results');
      setProducts([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  };

  const extractAvailableFilters = (products) => {
    const colors = new Map();
    const sizes = new Map();
    const brands = new Map();
    let minPrice = Infinity;
    let maxPrice = 0;

    products.forEach(product => {
      // Colors
      if (product.color) {
        colors.set(product.color, (colors.get(product.color) || 0) + 1);
      }
      
      // Sizes
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(sizeObj => {
          if (sizeObj.inStock && sizeObj.count > 0 && sizeObj.size) {
            sizes.set(sizeObj.size, (sizes.get(sizeObj.size) || 0) + 1);
          }
        });
      }
      
      // Brands
      if (product.brand) {
        brands.set(product.brand, (brands.get(product.brand) || 0) + 1);
      }
      
      // Price range
      if (product.price < minPrice) minPrice = product.price;
      if (product.price > maxPrice) maxPrice = product.price;
    });

    setAvailableFilters({
      colors: Array.from(colors.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      sizes: Array.from(sizes.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      brands: Array.from(brands.entries()).map(([value, count]) => ({
        value,
        label: value,
        count
      })),
      priceRange: [minPrice === Infinity ? 0 : minPrice, maxPrice === 0 ? 10000 : maxPrice]
    });
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      let newFilters;
      
      if (filterType === 'price' || filterType === 'discount') {
        // For price and discount, replace the value
        newFilters = {
          ...prev,
          [filterType]: prev[filterType] === value ? null : value
        };
      } else {
        // For arrays (colors, sizes, brands), toggle the value
        const currentArray = prev[filterType] || [];
        const newArray = currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value];
        
        newFilters = {
          ...prev,
          [filterType]: newArray
        };
      }
      
      // Update URL immediately when filters change
      updateURL(newFilters);
      
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const newFilters = {
      colors: [],
      sizes: [],
      brands: [],
      price: null,
      discount: null
    };
    
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const hasActiveFilters = () => {
    return filters.colors.length > 0 || 
           filters.sizes.length > 0 || 
           filters.brands.length > 0 || 
           filters.price !== null || 
           filters.discount !== null;
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.colors.length > 0) count += filters.colors.length;
    if (filters.sizes.length > 0) count += filters.sizes.length;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.price !== null) count += 1;
    if (filters.discount !== null) count += 1;
    return count;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-white pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header Skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Filters Skeleton */}
              <div className="lg:col-span-1">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              
              {/* Products Skeleton */}
              <div className="lg:col-span-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg shadow p-4">
                      <div className="h-48 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-cream-white font-serif pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-light text-gray-900 mb-2">
                Search Results for "{searchQuery}"
              </h1>
              <p className="text-gray-600">
                {totalResults} {totalResults === 1 ? 'product' : 'products'} found
                {hasActiveFilters() && ` • ${getActiveFiltersCount()} filter${getActiveFiltersCount() === 1 ? '' : 's'} applied`}
              </p>
            </div>
            
            {/* View Controls */}
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center space-x-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
                {hasActiveFilters() && (
                  <span className="bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getActiveFiltersCount()}
                  </span>
                )}
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-100 text-gray-700' : 'text-gray-500'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.colors.map(color => (
                <span key={color} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>Color: {color}</span>
                  <button
                    onClick={() => handleFilterChange('colors', color)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {filters.sizes.map(size => (
                <span key={size} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>Size: {size}</span>
                  <button
                    onClick={() => handleFilterChange('sizes', size)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {filters.brands.map(brand => (
                <span key={brand} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>Brand: {brand}</span>
                  <button
                    onClick={() => handleFilterChange('brands', brand)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              
              {filters.price && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>Price: ₹{filters.price[0]} - ₹{filters.price[1]}</span>
                  <button
                    onClick={() => handleFilterChange('price', filters.price)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              {filters.discount && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                  <span>Discount: {filters.discount}%+</span>
                  <button
                    onClick={() => handleFilterChange('discount', filters.discount)}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              
              <button
                onClick={clearAllFilters}
                className="text-orange-500 hover:text-orange-600 text-sm font-medium"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Results Section */}
        {error ? (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <button
              onClick={fetchSearchResults}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-light text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery ? `No results found for "${searchQuery}". Try adjusting your search terms or filters.` : 'Please enter a search term.'}
            </p>
            <button
              onClick={() => navigate('/products')}
              className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition-colors"
            >
              Browse All Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Filters */}
            <div className="hidden lg:block lg:col-span-1">
              <ProductFilters 
                filters={filters}
                onFilterChange={handleFilterChange}
                availableFilters={availableFilters}
                onClearFilters={clearAllFilters}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md p-6">
                      <ProductCard product={product} view="list" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mobile Filters Overlay */}
        {showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50">
            <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-normal">FILTERS</h3>
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <ProductFilters 
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  availableFilters={availableFilters}
                  onClearFilters={clearAllFilters}
                />
                <div className="mt-6 p-4 border-t">
                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;