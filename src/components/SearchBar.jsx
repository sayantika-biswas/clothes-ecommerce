// components/SearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, MapPin } from 'lucide-react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

const SearchBar = ({ isMobile = false, onClose }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Focus input when component mounts (especially for mobile)
  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  // Fetch suggestions when query changes
  useEffect(() => {
    if (query.trim().length > 1) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setProducts([]);
      setCategories([]);
      setBrands([]);
      setSubCategories([]);
    }
  }, [query]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/search', {
        params: {
          q: query,
          autocomplete: 'true',
          suggest: 'true',
          limit: 8
        }
      });

      console.log('Autocomplete response:', response.data);

      if (response.data.success && response.data.mode === 'autocomplete') {
        const data = response.data.data;
        setSuggestions(data.suggestions || []);
        setProducts(data.products || []);
        setCategories(data.categories || []);
        setBrands(data.brands || []);
        setSubCategories(data.subCategories || []);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    let searchTerm = '';
    
    if (typeof suggestion === 'string') {
      searchTerm = suggestion;
    } else if (suggestion.value) {
      searchTerm = suggestion.value;
    } else if (suggestion.productName) {
      searchTerm = suggestion.productName;
    }
    
    if (searchTerm) {
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
      saveToRecentSearches(searchTerm);
      setQuery(searchTerm);
      setShowSuggestions(false);
      if (onClose) onClose();
    }
  };

  const handleProductSelect = (product) => {
    navigate(`/product/${product._id}`);
    setShowSuggestions(false);
    if (onClose) onClose();
  };

  const handleRecentSearchSelect = (searchTerm) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    setQuery(searchTerm);
    setShowSuggestions(false);
    if (onClose) onClose();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      saveToRecentSearches(query.trim());
      setShowSuggestions(false);
      if (onClose) onClose();
    }
  };

  const saveToRecentSearches = (searchTerm) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    if (query.length > 0 || recentSearches.length > 0) {
      setShowSuggestions(true);
    }
  };

  const hasSuggestions = suggestions.length > 0 || products.length > 0;
  const showDefaultSuggestions = !hasSuggestions && query.length > 0 && !loading;

  // Popular searches data
  const popularSearches = [
    't-shirt', 'jeans', 'dress', 'kurta', 'shirt', 
    'shorts', 'top', 'jacket', 'sweater', 'shoes'
  ];

  return (
    <div className={`relative ${isMobile ? 'w-full' : 'w-full max-w-2xl'}`} ref={dropdownRef}>
      {/* Search Form */}
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={handleInputFocus}
            placeholder="Search for products, brands, categories..."
            className={`w-full pl-10 pr-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500 ${
              isMobile ? 'text-base' : 'text-sm'
            }`}
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className={`absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-xl z-50 mt-2 max-h-96 overflow-y-auto ${
          isMobile ? 'mx-4' : ''
        }`}>
          {/* Loading State */}
          {loading && (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto"></div>
              <p className="mt-2 text-sm">Searching...</p>
            </div>
          )}

          {/* Recent Searches */}
          {!loading && recentSearches.length > 0 && query.length === 0 && (
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Recent Searches
                </h3>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-orange-500 transition-colors"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((searchTerm, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchSelect(searchTerm)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group transition-colors"
                  >
                    <Clock className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 flex-1">
                      {searchTerm}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Categories */}
          {!loading && query.length === 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {['Men', 'Women', 'Kids', 'Sports', 'Ethnic', 'Casual'].map((category) => (
                  <button
                    key={category}
                    onClick={() => handleSuggestionSelect(category)}
                    className="text-left p-2 rounded-lg hover:bg-gray-50 text-sm text-gray-600 hover:text-orange-500 transition-colors"
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Suggestions</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.type}-${suggestion.value}-${index}`}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group transition-colors"
                  >
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 flex-1">
                      {suggestion.value}
                    </span>
                    <span className="text-xs text-gray-400 capitalize bg-gray-100 px-2 py-1 rounded-full group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                      {suggestion.type}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products */}
          {products.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Products</h3>
              <div className="space-y-3">
                {products.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleProductSelect(product)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group transition-colors"
                  >
                    <img 
                      src={product.images?.[0]?.url || '/placeholder-product.jpg'} 
                      alt={product.productName}
                      className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-orange-600 truncate">
                        {product.productName}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm font-semibold text-gray-900">₹{product.price}</p>
                        {product.discount > 0 && (
                          <p className="text-xs text-gray-500 line-through">₹{product.originalPrice}</p>
                        )}
                        {product.discount > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            {product.discount}% off
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Categories */}
          {categories.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <div className="space-y-2">
                {categories.map((category, index) => (
                  <button
                    key={`category-${index}`}
                    onClick={() => handleSuggestionSelect(category)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-orange-500" />
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 capitalize">
                      {category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brands */}
          {brands.length > 0 && (
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Brands</h3>
              <div className="space-y-2">
                {brands.map((brand, index) => (
                  <button
                    key={`brand-${index}`}
                    onClick={() => handleSuggestionSelect(brand)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group transition-colors"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-orange-600">
                      {brand}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sub Categories */}
          {subCategories.length > 0 && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Sub Categories</h3>
              <div className="space-y-2">
                {subCategories.map((subCategory, index) => (
                  <button
                    key={`subcategory-${index}`}
                    onClick={() => handleSuggestionSelect(subCategory)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center space-x-3 group transition-colors"
                  >
                    <span className="text-sm text-gray-700 group-hover:text-orange-600 capitalize">
                      {subCategory}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* No Results */}
          {showDefaultSuggestions && (
            <div className="p-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium">No results found for "{query}"</p>
              <p className="text-xs mt-1">Try searching for products, brands, or categories</p>
            </div>
          )}

          {/* Popular Searches when no query */}
          {!loading && query.length === 0 && !hasSuggestions && (
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Popular Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentSearchSelect(term)}
                    className="text-xs bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 px-3 py-2 rounded-full transition-colors duration-200"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;