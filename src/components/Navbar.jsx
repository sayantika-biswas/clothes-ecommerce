// components/Navbar.jsx (updated version)
import React, { useState, useRef, useEffect } from "react";
import { User, Heart, ShoppingBag, Search, X, Menu, ChevronDown, ChevronRight, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import axios from "../utils/axios";
import MobileSidebar from "./MobileSidebar";
import SearchBar from "./SearchBar"; // Import the new SearchBar component

const Navbar = () => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [navigationData, setNavigationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isLoggedIn, user, logout } = useAuth();
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const categoryTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [wishlistItemsCount, setWishlistItemsCount] = useState(0);

  // Fetch navigation data from API
  useEffect(() => {
    const fetchNavigationData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get('/navigation');
        console.log('Navigation API Response:', response.data);
        
        // Check if response has navigation data directly
        if (response.data && response.data.navigation) {
          setNavigationData(response.data);
        } else {
          setError('Invalid navigation data structure');
        }
      } catch (error) {
        console.error('Error fetching navigation data:', error);
        setError('Error loading navigation menu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNavigationData();
  }, []);

  useEffect(() => {
    // Try to get from localStorage first for instant load
    const savedCartCount = localStorage.getItem('cartItemsCount');
    const savedWishlistCount = localStorage.getItem('wishlistItemsCount');
    if (savedCartCount) {
      setCartItemsCount(parseInt(savedCartCount));
    }
    if (savedWishlistCount) {
      setWishlistItemsCount(parseInt(savedWishlistCount));
    }

    // Then fetch fresh data from API
    fetchCartCount();
    fetchWishlistCount();
  }, []);

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/cart');
      console.log('Cart API Response:', response.data);
      // Check if response has success field or direct data
      if (response.data.success) {
        const count = response.data.cart?.items?.length || 0;
        setCartItemsCount(count);
        localStorage.setItem('cartItemsCount', count.toString());
      } else if (response.data.items) {
        // Handle case where cart data is directly in response
        const count = response.data.items.length || 0;
        setCartItemsCount(count);
        localStorage.setItem('cartItemsCount', count.toString());
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const fetchWishlistCount = async () => {
    try {
      const response = await axios.get('/wishlist');
      console.log('Wishlist API Response:', response.data);
      // Check if response has success field or direct data
      if (response.data.success) {
        const count = response.data.wishlist?.products?.length || 0;
        setWishlistItemsCount(count);
        localStorage.setItem('wishlistItemsCount', count.toString());
      } else if (response.data.products) {
        // Handle case where wishlist data is directly in response
        const count = response.data.products.length || 0;
        setWishlistItemsCount(count);
        localStorage.setItem('wishlistItemsCount', count.toString());
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  const handleLoginRedirect = () => {
    setIsProfileDropdownOpen(false);
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
    navigate('/');
  };

  const handleProfileMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProfileDropdownOpen(true);
  };

  const handleProfileMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      if (dropdownRef.current && !dropdownRef.current.matches(':hover')) {
        setIsProfileDropdownOpen(false);
      }
    }, 100);
  };

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProfileDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProfileDropdownOpen(false);
    }, 100);
  };

  const handleMainCategoryMouseEnter = (categoryId) => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setActiveMainCategory(categoryId);
    setActiveSubCategory(null);
  };

  const handleMainCategoryMouseLeave = () => {
    categoryTimeoutRef.current = setTimeout(() => {
      setActiveMainCategory(null);
      setActiveSubCategory(null);
    }, 150);
  };

  const handleSubCategoryMouseEnter = (subCategoryId) => {
    if (categoryTimeoutRef.current) {
      clearTimeout(categoryTimeoutRef.current);
    }
    setActiveSubCategory(subCategoryId);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isMobileMenuOpen) setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  // Close menu when pressing escape key
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        closeMobileMenu();
        setActiveMainCategory(null);
        setActiveSubCategory(null);
        if (isSearchOpen) closeSearch();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isSearchOpen]);

  // Get the active main category data
  const getActiveMainCategory = () => {
    return navigationData?.navigation?.topLevel?.find(cat => cat.id === activeMainCategory);
  };

  const activeCategoryData = getActiveMainCategory();

  // Show loading state while fetching navigation data
  if (isLoading) {
    return (
      <nav className="bg-cream-white font-serif text-gray-800 flex justify-between items-center p-1 shadow-sm border-b border-gray-200 m-0 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center space-x-4">
          <button className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <a href="/" className="flex items-center">
            <img
              src="/ecomerccelogo.png"
              alt="Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-200 shadow-sm"
            />
          </a>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="animate-pulse bg-gray-200 rounded-full w-10 h-10"></div>
          <div className="animate-pulse bg-gray-200 rounded-full w-10 h-10"></div>
          <div className="animate-pulse bg-gray-200 rounded-full w-10 h-10"></div>
        </div>
      </nav>
    );
  }

  // Show error state if navigation data fails to load
  if (error) {
    return (
      <nav className="bg-cream-white font-serif text-gray-800 flex justify-between items-center p-1 shadow-sm border-b border-gray-200 m-0 fixed top-0 left-0 right-0 z-30">
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center">
            <img
              src="/ecomerccelogo.png"
              alt="Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-200 shadow-sm"
            />
          </a>
          <span className="text-sm text-red-500">{error}</span>
        </div>
        <div className="flex items-center space-x-4 md:space-x-6">
          <div className="flex flex-col items-center space-y-1">
            <div className="p-2 rounded-full bg-gray-100">
              <User className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="p-2 rounded-full bg-gray-100">
              <Heart className="w-5 h-5 text-gray-700" />
            </div>
          </div>
          <div className="flex flex-col items-center space-y-1">
            <div className="p-2 rounded-full bg-gray-100">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      <nav className="bg-cream-white font-serif text-gray-800 px-6 flex justify-between items-center p-1 shadow-sm border-b border-gray-200 m-0 fixed top-0 left-0 right-0 z-30">
        {/* Left Side: Mobile Menu Button and Logo */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button - Show on both mobile and tablet (hidden on lg screens) */}
          <button
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src="/ecomerccelogo.png"
              alt="Logo"
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
            />
          </a>

          {/* Desktop Navigation - Only show on large screens */}
          <ul className="hidden lg:flex space-x-8 text-lg font-medium items-center">
            {navigationData?.navigation?.topLevel?.map((category) => (
              <li 
                key={category.id}
                className="relative"
                onMouseEnter={() => handleMainCategoryMouseEnter(category.id)}
                onMouseLeave={handleMainCategoryMouseLeave}
              >
                <Link 
                  to={`/${category.slug}`}
                  className="hover:text-orange-400 transition-colors duration-300 relative group py-2 flex items-center"
                >
                  {category.name}
                  <ChevronDown className="w-4 h-4 ml-1 transform group-hover:rotate-180 transition-transform duration-300" />
                </Link>
                
                {/* Mega Menu Dropdown */}
                {activeMainCategory === category.id && activeCategoryData && activeCategoryData.categories && (
                  <div 
                    className={`absolute top-16 left-0 bg-white shadow-2xl rounded-lg p-0 z-30 border border-gray-200 ${
                      activeSubCategory ? 'min-w-[400px]' : 'min-w-[200px]'
                    }`}
                    onMouseEnter={() => handleMainCategoryMouseEnter(category.id)}
                    onMouseLeave={handleMainCategoryMouseLeave}
                  >
                    <div className="flex">
                      {/* Left Panel - Main Categories */}
                      <div className={`${activeSubCategory ? 'w-1/2' : 'w-full'} p-6 ${activeSubCategory ? 'border-r border-gray-100' : ''}`}>
                        <div className="space-y-1">
                          {activeCategoryData.categories.map((mainCat) => (
                            <div 
                              key={mainCat.id}
                              className="relative"
                              onMouseEnter={() => handleSubCategoryMouseEnter(mainCat.id)}
                            >
                              <Link 
                                to={`/${category.slug}/${mainCat.slug}`}
                                className={`flex items-center justify-between py-3 px-4 text-base font-medium rounded-lg transition-all duration-200 ${
                                  activeSubCategory === mainCat.id 
                                    ? 'bg-gray-50 text-orange-400' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-orange-400'
                                }`}
                              >
                                <span>{mainCat.name}</span>
                                {mainCat.subcategories && mainCat.subcategories.length > 0 && (
                                  <ChevronRight className="w-4 h-4" />
                                )}
                              </Link>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right Panel - Subcategories (Only show when a category is hovered) */}
                      {activeSubCategory && (
                        <div className="w-1/2 p-6">
                          {activeCategoryData.categories.map((mainCat) => (
                            activeSubCategory === mainCat.id && mainCat.subcategories && (
                              <div key={mainCat.id} className="space-y-3">
                                <h3 className="text-lg font-bold text-gray-800 mb-4">{mainCat.name}</h3>
                                <div className="grid gap-2">
                                  {mainCat.subcategories.map((subcat) => (
                                    <Link
                                      key={subcat.id}
                                      to={`/${category.slug}/${mainCat.slug}/${subcat.slug}`}
                                      className="block text-gray-600 hover:text-orange-400 transition-colors py-2 px-3 rounded hover:bg-gray-50 group"
                                    >
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">{subcat.name}</span>
                                        {subcat.productCount && (
                                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-gray-50 group-hover:text-orange-400 transition-colors">
                                            {subcat.productCount}
                                          </span>
                                        )}
                                      </div>
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Center: Desktop Search Bar */}
        <div className={`hidden md:flex flex-1 max-w-2xl mx-4 md:mx-8 ${isSearchOpen ? 'hidden' : ''}`}>
          <SearchBar />
        </div>

        {/* Mobile Search Button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          onClick={toggleSearch}
          aria-label="Search"
        >
          <Search className="w-6 h-6 text-gray-700" />
        </button>

        {/* Right Side: Profile, Wishlist, and Bag */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {/* Profile */}
          <div className="relative">
            <div 
              className="hidden md:flex flex-col items-center space-y-1 cursor-pointer group"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                <User className="w-5 h-5 text-gray-700" />
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-orange-400 transition-colors hidden lg:block">
                Profile
              </span>
            </div>
            
            <div 
              className="md:hidden flex flex-col items-center space-y-1 cursor-pointer group"
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
            >
              <div className="p-2 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors duration-300">
                <User className="w-5 h-5 text-gray-700" />
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="flex flex-col items-center space-y-1 cursor-pointer group">
            <a 
              href={isLoggedIn ? "/wishlist" : "#"}
              onClick={(e) => !isLoggedIn && (e.preventDefault(), handleLoginRedirect())}
              className={`p-2 rounded-full transition-colors duration-300 relative ${
                isLoggedIn 
                  ? "bg-gray-100 group-hover:bg-gray-200" 
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
              title={!isLoggedIn ? "Please login to access wishlist" : "Wishlist"}
            >
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlistItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistItemsCount}
                </span>
              )}
            </a>
            <span className="text-xs font-medium text-gray-700 group-hover:text-orange-400 transition-colors hidden md:block">
              Wishlist
            </span>
          </div>

          {/* Bag */}
          <div className="flex flex-col items-center space-y-1 cursor-pointer group">
            <a 
              href={isLoggedIn ? "/cart" : "#"}
              onClick={(e) => !isLoggedIn && (e.preventDefault(), handleLoginRedirect())}
              className={`p-2 rounded-full transition-colors duration-300 relative ${
                isLoggedIn 
                  ? "bg-gray-100 group-hover:bg-gray-200" 
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}
              title={!isLoggedIn ? "Please login to access cart" : "Cart"}
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </a>
            <span className="text-xs font-medium text-gray-700 group-hover:text-orange-400 transition-colors hidden md:block">
              Bag
            </span>
          </div>
        </div>

        {/* Mobile Search Overlay */}
        {isSearchOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white p-4 shadow-lg z-50 border-b border-gray-200">
            <div className="flex items-center space-x-2 mb-4">
              <SearchBar isMobile={true} onClose={closeSearch} />
              <button
                onClick={closeSearch}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Profile Dropdown */}
        {isProfileDropdownOpen && (
          <div 
            ref={dropdownRef}
            className="absolute top-full right-0 bg-white shadow-xl rounded-lg p-4 w-64 z-50 border border-gray-200"
            onMouseEnter={handleDropdownMouseEnter}
            onMouseLeave={handleDropdownMouseLeave}
          >
            {isLoggedIn ? (
              <>
                <div className="mb-3">
                  <p className="text-sm font-bold text-gray-700">Welcome back!</p>
                  <p className="text-sm text-gray-600 truncate">{user?.fullName || user?.name || "User"}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
                
                <hr className="my-2 border-gray-200" />
                
                <div className="space-y-2">
                  <a 
                    href="/orders" 
                    className="block text-sm text-gray-600 hover:text-orange-400 py-1 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    My Orders
                  </a>
                  <a 
                    href="/wishlist" 
                    className="block text-sm text-gray-600 hover:text-orange-400 py-1 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    My Wishlist
                  </a>
                  <a 
                    href="/account" 
                    className="block text-sm text-gray-600 hover:text-orange-400 py-1 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    My Account
                  </a>
                  <a 
                    href="/address-management" 
                    className="block text-sm text-gray-600 hover:text-orange-400 py-1 transition-colors"
                    onClick={() => setIsProfileDropdownOpen(false)}
                  >
                    Saved Addresses
                  </a>
                  
                  <hr className="my-2 border-gray-200" />
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 w-full text-sm text-gray-600 hover:text-red-500 py-1 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-gray-700 mb-3">Welcome!</p>
                <div className="space-y-2">
                  <button
                    onClick={handleLoginRedirect}
                    className="block w-full text-left text-sm text-orange-400 hover:text-orange-500 font-medium py-2 transition-colors"
                  >
                    Login/Sign Up
                  </button>
                  
                  <hr className="my-2 border-gray-200" />
                  
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 text-center">
                      Please login to access your account features
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Mobile Sidebar Component */}
      <MobileSidebar isOpen={isMobileMenuOpen} onClose={closeMobileMenu} navigationData={navigationData} />
    </>
  );
};

export default Navbar;