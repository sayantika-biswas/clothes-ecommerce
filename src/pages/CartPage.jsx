// CartPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, MapPin, Plus as PlusIcon, Check, Tag } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../utils/axios';
import RazorpayPayment from '../components/RazorpayPayment';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingItems, setUpdatingItems] = useState(new Set());
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showAddressList, setShowAddressList] = useState(false);
    const [addressForm, setAddressForm] = useState({
        fullName: '',
        mobileNumber: '',
        pincode: '',
        state: '',
        city: '',
        houseNumber: '',
        street: '',
        landmark: '',
        country: 'India'
    });
    
    // Coupon states
    const [coupons, setCoupons] = useState([]);
    const [showCouponSection, setShowCouponSection] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [applyingCoupon, setApplyingCoupon] = useState(false);
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [couponDetails, setCouponDetails] = useState(null);

    // Payment states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [validatingOrder, setValidatingOrder] = useState(false);

    useEffect(() => {
        fetchCart();
        fetchAddresses();
        fetchActiveCoupons();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await axios.get('/cart');
            if (response.data.success) {
                console.log('Cart API Response:', response.data);
                
                // Filter out items with null products
                const filteredCart = {
                    ...response.data.cart,
                    items: response.data.cart.items.filter(item => item.product !== null)
                };
                
                setCart(filteredCart);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
            toast.error('Failed to load cart');
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        try {
            const response = await axios.get('/address');
            if (response.data.success) {
                setAddresses(response.data.addresses);
                // Set default address if available
                const defaultAddress = response.data.addresses.find(addr => addr.isDefault);
                if (defaultAddress) {
                    setSelectedAddress(defaultAddress);
                } else if (response.data.addresses.length > 0) {
                    // If no default address, select the first one
                    setSelectedAddress(response.data.addresses[0]);
                }
            }
        } catch (error) {
            console.error('Error fetching addresses:', error);
        }
    };

    const fetchActiveCoupons = async () => {
        try {
            const response = await axios.get('/coupon/active');
            if (response.data.success) {
                setCoupons(response.data.coupons);
            }
        } catch (error) {
            console.error('Error fetching coupons:', error);
        }
    };

    const applyCoupon = async () => {
        if (!couponCode.trim()) {
            toast.error('Please enter a coupon code');
            return;
        }

        if (!cart || cart.items.length === 0) {
            toast.error('Cart is empty');
            return;
        }

        setApplyingCoupon(true);
        try {
            const response = await axios.post('/coupon/apply', {
                couponCode: couponCode.trim()
            });

            console.log('Coupon apply response:', response.data);

            if (response.data.success) {
                setAppliedCoupon({
                    code: response.data.couponApplied,
                    discount: response.data.discount
                });
                setCouponDiscount(response.data.discount);
                setCouponDetails(response.data.couponDetails);
                toast.success(`Coupon applied successfully! Discount: ₹${response.data.discount}`);
                setCouponCode('');
                setShowCouponSection(false);
            }
        } catch (error) {
            console.error('Error applying coupon:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to apply coupon');
            }
        } finally {
            setApplyingCoupon(false);
        }
    };

    const removeCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponDetails(null);
        toast.success('Coupon removed successfully');
    };

    const validateCouponBeforeOrder = async () => {
        if (!appliedCoupon) return { isValid: true };
        
        try {
            const response = await axios.post('/coupon/apply', {
                couponCode: appliedCoupon.code
            });
            
            return { 
                isValid: response.data.success,
                data: response.data 
            };
        } catch (error) {
            return { 
                isValid: false,
                error: error.response?.data?.message || 'Coupon validation failed'
            };
        }
    };

    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;

        setUpdatingItems(prev => new Set(prev).add(itemId));
        
        try {
            const response = await axios.put(`/cart/update/${itemId}`, {
                quantity: newQuantity
            });

            if (response.data.success) {
                const filteredCart = {
                    ...response.data.cart,
                    items: response.data.cart.items.filter(item => item.product !== null)
                };
                setCart(filteredCart);
                toast.success('Cart updated');
                
                // Remove coupon if cart changes
                if (appliedCoupon) {
                    removeCoupon();
                }
            }
        } catch (error) {
            console.error('Error updating quantity:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to update quantity');
            }
        } finally {
            setUpdatingItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        }
    };

    const removeItem = async (itemId) => {
        try {
            const itemToRemove = cart.items.find(item => item._id === itemId);
            if (!itemToRemove) return;
            
            if (!itemToRemove.product || !itemToRemove.product._id) {
                console.error('Product not found in cart item');
                toast.error('Product information is missing');
                return;
            }

            const response = await axios.post('/cart/remove', {
                productId: itemToRemove._id,
            });

            if (response.data.success) {
                const filteredCart = {
                    ...response.data.cart,
                };
                setCart(filteredCart);
                toast.success('Item removed from cart');
                
                // Remove coupon if cart changes
                if (appliedCoupon) {
                    removeCoupon();
                }
            }
        } catch (error) {
            console.error('Error removing item:', error);
            toast.error('Failed to remove item');
        }
    };

    const clearCart = async () => {
        try {
            const response = await axios.delete('/cart/clear');
            if (response.data.success) {
                setCart(response.data.cart);
                toast.success('Cart cleared');
                
                if (appliedCoupon) {
                    removeCoupon();
                }
            }
        } catch (error) {
            console.error('Error clearing cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/address', addressForm);
            if (response.data.success) {
                toast.success('Address added successfully');
                setShowAddressForm(false);
                setAddressForm({
                    fullName: '',
                    mobileNumber: '',
                    pincode: '',
                    state: '',
                    city: '',
                    houseNumber: '',
                    street: '',
                    landmark: '',
                    country: 'India'
                });
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error adding address:', error);
            toast.error('Failed to add address');
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const response = await axios.put(`/address/set-default/${addressId}`);
            if (response.data.success) {
                toast.success('Default address updated');
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error setting default address:', error);
            toast.error('Failed to set default address');
        }
    };

    const deleteAddress = async (addressId) => {
        if (!window.confirm('Are you sure you want to delete this address?')) return;
        
        try {
            const response = await axios.delete(`/address/${addressId}`);
            if (response.data.success) {
                toast.success('Address deleted successfully');
                if (selectedAddress && selectedAddress._id === addressId) {
                    setSelectedAddress(null);
                }
                fetchAddresses();
            }
        } catch (error) {
            console.error('Error deleting address:', error);
            toast.error('Failed to delete address');
        }
    };

    const handleProceedToCheckout = async () => {
        if (!selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }

        if (!cart || !cart.items || cart.items.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        setValidatingOrder(true);
        
        try {
            // Validate coupon before proceeding
            if (appliedCoupon) {
                const validation = await validateCouponBeforeOrder();
                if (!validation.isValid) {
                    toast.error(validation.error || 'Coupon is no longer valid. Please remove it and try again.');
                    removeCoupon();
                    return;
                }
            }

            // All validations passed, show payment modal
            setShowPaymentModal(true);
        } catch (error) {
            console.error('Error during checkout validation:', error);
            toast.error('Failed to validate order. Please try again.');
        } finally {
            setValidatingOrder(false);
        }
    };

    const handlePaymentSuccess = async (response) => {
        // Clear cart and reset states
        await clearCart();
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponDetails(null);
        setShowPaymentModal(false);
        
        // Redirect to order success page
        window.location.href = `/orders/${response.order._id}`;
    };

    const handlePaymentFailure = (error) => {
        console.error('Payment failed:', error);
        
        // Handle specific coupon errors from order creation
        if (error.response?.data?.errorType === 'COUPON_ALREADY_USED' || 
            error.response?.data?.message?.includes('already used')) {
            
            toast.error('This coupon has already been used. Please remove it and try again.');
            removeCoupon();
        } else if (error.response?.data?.errorType === 'COUPON_ERROR') {
            toast.error(error.response.data.message || 'Coupon is no longer valid.');
            removeCoupon();
        } else {
            toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
        }
    };

    const handlePaymentClose = () => {
        setShowPaymentModal(false);
    };

    // Calculate totals from cart items
    const calculateTotals = (items) => {
        let subtotal = 0;
        let totalProductDiscount = 0;
        let totalItems = 0;

        items.forEach(item => {
            const itemPrice = item.product?.price || 0;
            const itemOriginalPrice = item.product?.originalPrice || itemPrice;
            const quantity = item.quantity || 1;

            subtotal += itemOriginalPrice * quantity;
            totalProductDiscount += (itemOriginalPrice - itemPrice) * quantity;
            totalItems += quantity;
        });

        const totalAfterProductDiscount = subtotal - totalProductDiscount;

        return {
            subtotal: Math.round(subtotal),
            totalProductDiscount: Math.round(totalProductDiscount),
            totalAfterProductDiscount: Math.round(totalAfterProductDiscount),
            totalItems
        };
    };

    // Prepare order data for payment component
    const getOrderData = () => {
        return {
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
                size: item.size,
                price: item.product.price // Include price for backend calculation
            })),
            shippingAddress: selectedAddress._id,
            totalAmount: totalAfterProductDiscount, // Send amount before coupon
            couponCode: appliedCoupon ? appliedCoupon.code : undefined
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const cartItems = cart?.items || [];
    const { subtotal, totalProductDiscount, totalAfterProductDiscount, totalItems } = calculateTotals(cartItems);
    const finalTotal = Math.max(0, totalAfterProductDiscount - couponDiscount);
    const totalSavings = totalProductDiscount + couponDiscount;

    return (
        <div className="min-h-screen bg-cream-white py-8">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                theme="light"
            />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 font-serif">Shopping Bag</h1>
                    <p className="text-gray-600 mt-2 font-sans">
                        {totalItems} {totalItems === 1 ? 'item' : 'items'} in your bag
                    </p>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4 font-serif">Your bag is empty</h2>
                        <p className="text-gray-600 mb-8 font-sans">Start shopping to add items to your bag</p>
                        <Link
                            to="/"
                            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-md hover:bg-orange-600 transition-colors duration-200 font-sans"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items & Address Section */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Delivery Address Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold font-serif flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-orange-500" />
                                        Delivery Address
                                    </h2>
                                </div>
                                
                                <div className="p-6">
                                    {selectedAddress ? (
                                        <div className="space-y-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900">{selectedAddress.fullName}</p>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {selectedAddress.houseNumber}, {selectedAddress.street}, {selectedAddress.landmark && `${selectedAddress.landmark}, `}
                                                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                                                    </p>
                                                    <p className="text-sm text-gray-600">Phone: {selectedAddress.mobileNumber}</p>
                                                    <p className="text-sm text-gray-600">Country: {selectedAddress.country}</p>
                                                    {selectedAddress.isDefault && (
                                                        <span className="inline-block mt-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                            Default Address
                                                        </span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => setShowAddressList(true)}
                                                    className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-gray-600 mb-4">No delivery address selected</p>
                                            <button
                                                onClick={() => setShowAddressForm(true)}
                                                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors duration-200"
                                            >
                                                <PlusIcon className="w-4 h-4 mr-2" />
                                                Add Address
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Cart Items - RESTORED SECTION */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                                {/* Cart Header */}
                                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                    <h2 className="text-lg font-semibold font-serif">Items in your bag</h2>
                                    <button
                                        onClick={clearCart}
                                        className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors duration-200 font-sans"
                                    >
                                        Clear All
                                    </button>
                                </div>

                                {/* Cart Items List */}
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => {
                                        const itemPrice = item.product?.price || 0;
                                        const itemOriginalPrice = item.product?.originalPrice || itemPrice;
                                        const itemDiscount = itemOriginalPrice > itemPrice ? 
                                            Math.round(((itemOriginalPrice - itemPrice) / itemOriginalPrice) * 100) : 0;
                                        
                                        return (
                                            <div key={item._id} className="p-6">
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    {/* Product Image */}
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={item.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                                                            alt={item.product?.images?.[0]?.alt || item.product?.productName}
                                                            className="w-24 h-32 object-cover rounded-md"
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-image.jpg';
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Product Details */}
                                                    <div className="flex-1 flex flex-col">
                                                        <div className="flex justify-between">
                                                            <div className="flex-1">
                                                                <h3 className="text-lg font-medium text-gray-900 font-serif">
                                                                    {item.product?.productName}
                                                                </h3>
                                                                <p className="text-sm text-gray-500 uppercase mt-1 font-sans">
                                                                    {item.product?.brand}
                                                                </p>
                                                                <p className="text-sm text-gray-700 mt-1 font-sans">
                                                                    Size: <span className="font-medium">{item.size}</span>
                                                                    {item.sizeLabel && item.sizeLabel !== item.size && (
                                                                        <span className="text-gray-500 ml-1">({item.sizeLabel})</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-sm text-gray-700 mt-1 font-sans">
                                                                    Quantity: <span className="font-medium">{item.quantity}</span>
                                                                </p>
                                                            </div>

                                                            {/* Price */}
                                                            <div className="text-right">
                                                                <p className="text-lg font-bold text-gray-900 font-sans">
                                                                    ₹{(itemPrice * item.quantity).toLocaleString()}
                                                                </p>
                                                                {itemOriginalPrice > itemPrice && (
                                                                    <div className="flex items-center gap-2 justify-end mt-1">
                                                                        <p className="text-sm text-gray-500 line-through font-sans">
                                                                            ₹{(itemOriginalPrice * item.quantity).toLocaleString()}
                                                                        </p>
                                                                        <span className="text-xs text-orange-500 font-medium font-sans">
                                                                            {itemDiscount}% OFF
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <p className="text-sm text-gray-600 mt-1 font-sans">
                                                                    ₹{itemPrice.toLocaleString()} per item
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Quantity Controls and Remove */}
                                                        <div className="flex justify-between items-center mt-4">
                                                            <div className="flex items-center space-x-3">
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                    disabled={updatingItems.has(item._id) || item.quantity <= 1}
                                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                                                                >
                                                                    <Minus className="w-4 h-4" />
                                                                </button>
                                                                
                                                                <span className="w-8 text-center font-medium font-sans">
                                                                    {updatingItems.has(item._id) ? (
                                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500 mx-auto"></div>
                                                                    ) : (
                                                                        item.quantity
                                                                    )}
                                                                </span>
                                                                
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                    disabled={updatingItems.has(item._id)}
                                                                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors duration-200"
                                                                >
                                                                    <Plus className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <button
                                                                onClick={() => removeItem(item._id)}
                                                                className="text-red-500 hover:text-red-700 p-2 transition-colors duration-200"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            {/* Coupon Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <h2 className="text-lg font-semibold mb-4 font-serif">Apply Coupon</h2>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <div>
                                            <p className="font-medium text-green-800">
                                                Coupon Applied: {appliedCoupon.code}
                                            </p>
                                            <p className="text-sm text-green-600 mt-1">
                                                Discount: ₹{couponDiscount.toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            onClick={removeCoupon}
                                            className="text-red-500 hover:text-red-700 text-sm font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex gap-3">
                                            <input
                                                type="text"
                                                placeholder="Enter coupon code"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                            />
                                            <button
                                                onClick={applyCoupon}
                                                disabled={applyingCoupon || !couponCode.trim()}
                                                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                                                    applyingCoupon || !couponCode.trim()
                                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                        : 'bg-orange-500 text-white hover:bg-orange-600'
                                                }`}
                                            >
                                                {applyingCoupon ? 'Applying...' : 'Apply'}
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => setShowCouponSection(!showCouponSection)}
                                            className="text-orange-500 hover:text-orange-700 text-sm font-medium flex items-center gap-1"
                                        >
                                            {showCouponSection ? 'Hide' : 'Show'} available coupons
                                            <ArrowRight className={`w-4 h-4 transition-transform ${showCouponSection ? 'rotate-90' : ''}`} />
                                        </button>
                                        {showCouponSection && (
                                            <div className="mt-4 space-y-3">
                                                <p className="text-sm font-medium text-gray-700">Available Coupons:</p>
                                                {coupons.map((coupon) => (
                                                    <div
                                                        key={coupon._id}
                                                        className="p-3 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-gray-900">{coupon.code}</p>
                                                                <p className="text-sm text-gray-600">
                                                                    {coupon.discountType === 'percentage' 
                                                                        ? `${coupon.discountValue}% OFF` 
                                                                        : `₹${coupon.discountValue} OFF`}
                                                                </p>
                                                                <p className="text-xs text-gray-500 mt-1">
                                                                    Min. order: ₹{coupon.minOrderAmount}
                                                                    {coupon.maxDiscountAmount && coupon.discountType === 'percentage' && 
                                                                        ` • Max discount: ₹${coupon.maxDiscountAmount}`
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Valid until: {new Date(coupon.expiryDate).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => {
                                                                    setCouponCode(coupon.code);
                                                                    setShowCouponSection(false);
                                                                }}
                                                                className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                                                            >
                                                                Apply
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {coupons.length === 0 && (
                                                    <p className="text-sm text-gray-500 text-center py-4">
                                                        No coupons available at the moment
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Order Summary Section */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                                <h2 className="text-lg font-semibold mb-4 font-serif">Order Summary</h2>
                                <div className="space-y-3 mb-6">
                                    {/* Subtotal (Original Prices) */}
                                    <div className="flex justify-between text-sm font-sans">
                                        <span>Subtotal ({totalItems} items)</span>
                                        <span>₹{subtotal.toLocaleString()}</span>
                                    </div>
                                    
                                    {/* Product Discount */}
                                    {totalProductDiscount > 0 && (
                                        <div className="flex justify-between text-sm font-sans">
                                            <span>Product Discount</span>
                                            <span className="text-green-600">-₹{totalProductDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    
                                    {/* Amount after product discount */}
                                    <div className="flex justify-between text-base font-medium font-sans border-b border-gray-200 pb-2">
                                        <span>Amount after Discount</span>
                                        <span>₹{totalAfterProductDiscount.toLocaleString()}</span>
                                    </div>
                                    
                                    {/* Coupon Discount */}
                                    {appliedCoupon && (
                                        <div className="flex justify-between text-sm font-sans">
                                            <span>Coupon Discount ({appliedCoupon.code})</span>
                                            <span className="text-green-600">-₹{couponDiscount.toLocaleString()}</span>
                                        </div>
                                    )}
                                    
                                    {/* Delivery */}
                                    <div className="flex justify-between text-sm font-sans">
                                        <span>Delivery</span>
                                        <span className="text-green-600">FREE</span>
                                    </div>
                                    
                                    {/* Final Total */}
                                    <div className="border-t border-gray-200 pt-3">
                                        <div className="flex justify-between text-lg font-bold font-sans">
                                            <span>Total Amount</span>
                                            <span>₹{finalTotal.toLocaleString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 font-sans">Inclusive of all taxes</p>
                                        {totalSavings > 0 && (
                                            <p className="text-xs text-green-600 mt-1 font-sans">
                                                You saved ₹{totalSavings.toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleProceedToCheckout}
                                    disabled={!selectedAddress}
                                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 mb-4 font-sans ${
                                        selectedAddress
                                            ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    {selectedAddress ? (
                                        'Proceed to Checkout'
                                    ) : (
                                        'Select Address First'
                                    )}
                                </button>

                                <Link
                                    to="/"
                                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium text-center block hover:bg-gray-50 transition-colors duration-200 font-sans"
                                >
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Modal */}
            {showPaymentModal && (
                <RazorpayPayment
                    orderData={getOrderData()}
                    finalTotal={finalTotal}
                    selectedAddress={selectedAddress}
                    appliedCoupon={appliedCoupon}
                    onSuccess={handlePaymentSuccess}
                    onFailure={handlePaymentFailure}
                    onClose={handlePaymentClose}
                />
            )}

            {/* Add Address Modal */}
            {showAddressForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Add New Address</h3>
                            <button
                                onClick={() => setShowAddressForm(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
                            {/* Address form fields remain the same */}
                            {/* ... */}
                        </form>
                    </div>
                </div>
            )}

            {/* Address List Modal */}
            {showAddressList && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Select Delivery Address</h3>
                            <button
                                onClick={() => setShowAddressList(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <div
                                        key={address._id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedAddress?._id === address._id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => {
                                            setSelectedAddress(address);
                                            setShowAddressList(false);
                                        }}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <p className="font-medium text-gray-900">{address.fullName}</p>
                                                    {address.isDefault && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">
                                                    {address.houseNumber}, {address.street}, {address.landmark && `${address.landmark}, `}
                                                    {address.city}, {address.state} - {address.pincode}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">Phone: {address.mobileNumber}</p>
                                                <p className="text-sm text-gray-600">Country: {address.country}</p>
                                            </div>
                                            {selectedAddress?._id === address._id && (
                                                <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                            )}
                                        </div>
                                        <div className="flex gap-2 mt-3">
                                            {!address.isDefault && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDefaultAddress(address._id);
                                                    }}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    Set as Default
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteAddress(address._id);
                                                }}
                                                className="text-sm text-red-600 hover:text-red-800 ml-4"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {addresses.length === 0 && (
                                    <div className="text-center py-8">
                                        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-600">No addresses found</p>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setShowAddressList(false);
                                    setShowAddressForm(true);
                                }}
                                className="w-full mt-6 border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 text-gray-600 hover:border-orange-500 hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <PlusIcon className="w-5 h-5" />
                                Add New Address
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;