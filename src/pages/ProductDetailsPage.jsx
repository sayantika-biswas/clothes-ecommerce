import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Truck, RotateCcw, Store, Star, Calendar, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../utils/axios';

const ProductDetailsPage = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [pincode, setPincode] = useState('');
    const [pincodeLoading, setPincodeLoading] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showAllReviews, setShowAllReviews] = useState(false);

    useEffect(() => {
        if (productId) {
            fetchProduct();
            fetchReviews();
        } else {
            setError('No product ID provided');
            setLoading(false);
        }
    }, [productId]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const response = await axios.get(`/products/${productId}`);
            
            if (response.data.success) {
                setProduct(response.data.product);
                
                // Set first available size
                if (response.data.product.sizes && response.data.product.sizes.length > 0) {
                    const availableSize = response.data.product.sizes.find(size => size.inStock);
                    if (availableSize) {
                        setSelectedSize(availableSize.size);
                    }
                }
            } else {
                setError(response.data.message || 'Failed to load product');
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            const errorMessage = error.response?.data?.message || 'Failed to load product details';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            setReviewsLoading(true);
            const response = await axios.get(`/reviews/${productId}`);
            setReviews(response.data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setReviewsLoading(false);
        }
    };

    // Calculate average rating from reviews
    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return total / reviews.length;
    };

    // Calculate rating distribution
    const getRatingDistribution = () => {
        const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        reviews.forEach(review => {
            distribution[review.rating]++;
        });
        return distribution;
    };

    const toggleWishlist = async () => {
        try {
            if (isWishlisted) {
                const response = await axios.post('/wishlist/remove', { productId });
                if (response.data.success) {
                    setIsWishlisted(false);
                    toast.success('Removed from wishlist');
                }
            } else {
                const response = await axios.post('/wishlist/add', { productId });
                if (response.data.success) {
                    setIsWishlisted(true);
                    toast.success('Added to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            toast.error('Failed to update wishlist');
        }
    };

    const addToCart = async () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }

        try {
            const response = await axios.post('/cart/add', {
                productId: product._id,
                size: selectedSize,
                sizeLabel: product.sizes.find(s => s.size === selectedSize)?.sizeLabel || selectedSize,
                quantity: quantity
            });

            if (response.data.success) {
                toast.success('Product added to cart successfully!');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to add product to cart');
            }
        }
    };

    const checkPincode = async () => {
        if (!pincode || pincode.length !== 6) {
            toast.error('Please enter a valid 6-digit pincode');
            return;
        }

        setPincodeLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`Delivery available to ${pincode}`);
        } catch (error) {
            toast.error('Delivery not available for this pincode');
        } finally {
            setPincodeLoading(false);
        }
    };

    const increaseQuantity = () => {
        const selectedSizeObj = product.sizes.find(s => s.size === selectedSize);
        const maxQuantity = selectedSizeObj?.count || 10;
        if (quantity < maxQuantity) {
            setQuantity(quantity + 1);
        } else {
            toast.error(`Maximum ${maxQuantity} items available for this size`);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Render star rating
    const renderRating = (rating, size = 'w-3 h-3') => {
        return (
            <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`${size} ${
                            star <= rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                        }`}
                    />
                ))}
            </div>
        );
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    // Simple Review Component (no card)
    const ReviewItem = ({ review }) => (
        <div className="border-b border-gray-100 pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-orange-600 font-medium text-xs">
                            {review.user?.fullName?.charAt(0) || 'U'}
                        </span>
                    </div>
                    <div className="min-w-0">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                            {review.user?.fullName || 'Anonymous User'}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            {renderRating(review.rating, 'w-3 h-3')}
                            <span className="text-xs text-gray-500">
                                {formatDate(review.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                {/* {review.isVerifiedPurchase && (
                    <div className="flex items-center gap-1 text-green-600 text-xs bg-green-50 px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3" />
                        <span>Verified</span>
                    </div>
                )} */}
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mb-2">
                {review.comment}
            </p>

            {review.images && review.images.length > 0 && (
                <div className="flex gap-1.5">
                    {review.images.slice(0, 3).map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Review ${index + 1}`}
                            className="w-24 h-24 object-cover  cursor-pointer hover:opacity-80 flex-shrink-0"
                            onClick={() => window.open(image, '_blank')}
                        />
                    ))}
                    {review.images.length > 3 && (
                        <div className="w-24 h-24 bg-gray-100  flex items-center justify-center text-xs text-gray-500">
                            +{review.images.length - 3}
                        </div>
                    )}
                </div>
            )}
        </div>
    );

    // Simple Rating Summary (no card)
    const RatingSummary = () => {
        const averageRating = calculateAverageRating();
        const distribution = getRatingDistribution();
        const totalReviews = reviews.length;
        
        return (
            <div className="mb-6">
                <div className="flex items-center w-80 gap-6">
                    {/* Overall Rating */}
                    <div className="text-center">
                        <div className="text-4xl font-bold font-sans text-gray-900 mb-1">
                            {averageRating.toFixed(1)}
                        </div>
                        {renderRating(averageRating, 'w-4 h-4')}
                        <div className="text-xs text-gray-600 mt-1">
                            {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                        </div>
                    </div>

                    {/* Rating Distribution */}
                    <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = distribution[rating];
                            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                            
                            return (
                                <div key={rating} className="flex items-center gap-2 text-xs">
                                    <div className="flex items-center gap-1 w-8">
                                        <span className="text-gray-600">{rating}</span>
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                        <div 
                                            className="bg-yellow-400 h-1.5 rounded-full" 
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-600 w-6 text-right">
                                        {count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-white">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-white">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Error Loading Product</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream-white">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product not found</h2>
                    <button
                        onClick={() => navigate('/')}
                        className="text-orange-500 hover:underline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const availableSizes = product.sizes?.filter(size => size.inStock) || [];
    const selectedSizeObj = product.sizes?.find(s => s.size === selectedSize);
    const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3);
    const averageRating = calculateAverageRating();
    const totalReviews = reviews.length;

    return (
        <div className="min-h-screen font-serif bg-cream-white">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                theme="light"
            />

            {/* Breadcrumb Navigation */}
            <div className="bg-cream-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="text-sm text-gray-500">
                        <span className="hover:text-orange-500 cursor-pointer">Home</span>
                        {product.category && (
                            <>
                                <span className="mx-2">/</span>
                                <span className="hover:text-orange-500 cursor-pointer">{product.category}</span>
                            </>
                        )}
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">{product.productName}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column - Product Images */}
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Thumbnail Images */}
                        <div className="flex lg:flex-col gap-2 order-2 lg:order-1">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveImage(index)}
                                    className={`bg-white rounded border overflow-hidden flex-shrink-0 ${
                                        activeImage === index ? 'border-orange-500' : 'border-gray-200'
                                    }`}
                                >
                                    <img
                                        src={image.url}
                                        alt={image.alt || `${product.productName} ${index + 1}`}
                                        className="w-16 h-16 lg:w-20 lg:h-20 object-cover hover:opacity-80"
                                    />
                                </button>
                            ))}
                        </div>
                        
                        {/* Main Image */}
                        <div className="flex-1 order-1 lg:order-2">
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
                                <img
                                    src={product.images[activeImage]?.url || '/placeholder-image.jpg'}
                                    alt={product.images[activeImage]?.alt || product.productName}
                                    className="w-full h-full lg:h-[600px] object-cover"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Product Details & Additional Sections */}
                    <div className="space-y-8">
                        {/* Product Basic Details */}
                        <div className="space-y-6">
                            {/* Product Title */}
                            <h1 className="text-3xl font-bold text-gray-900 font-serif">
                                {product.productName}
                            </h1>

                            {/* Rating */}
                            <div className="flex items-center gap-3">
                                {renderRating(averageRating, 'w-4 h-4')}
                                <span className="text-sm text-gray-600">
                                    ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
                                </span>
                            </div>

                            {/* Price */}
                            <div className="flex items-center gap-4">
                                <span className="text-3xl font-bold text-gray-900 font-sans">₹{product.price}</span>
                                {product.originalPrice > product.price && (
                                    <>
                                        <span className="text-xl text-gray-500 line-through font-sans">
                                            ₹{product.originalPrice}
                                        </span>
                                        <span className="text-lg text-orange-500 font-medium font-sans">
                                            {product.discount}% OFF
                                        </span>
                                    </>
                                )}
                            </div>

                            {/* SKU */}
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">SKU:MNOP</span>{product._id}
                            </div>

                            {/* Size Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-900">Size Chart</span>
                                    <button className="text-sm text-orange-500 hover:underline">
                                        Size Guide
                                    </button>
                                </div>
                                <div className="grid grid-cols-6 gap-2">
                                    {availableSizes.map((size) => (
                                        <button
                                            key={size.size}
                                            onClick={() => setSelectedSize(size.size)}
                                            className={`py-3 px-2 border rounded text-sm font-medium transition-all duration-200 ${
                                                selectedSize === size.size
                                                    ? 'border-orange-500 text-orange-500 bg-orange-50'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                        >
                                            {size.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Display */}
                            {product.color && (
                                <div className="space-y-3">
                                    <span className="text-sm font-medium text-gray-900">Color: {product.color}</span>
                                    <div className="flex gap-2">
                                        <div 
                                            className="w-8 h-8 rounded-full border-2 border-orange-500"
                                            style={{ 
                                                backgroundColor: product.color.toLowerCase() === 'white' ? '#ffffff' : 
                                                               product.color.toLowerCase() === 'black' ? '#000000' : 
                                                               product.color.toLowerCase() === 'blue' ? '#0000ff' :
                                                               product.color.toLowerCase() === 'red' ? '#ff0000' :
                                                               '#f0f0f0'
                                            }}
                                            title={product.color}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Quantity */}
                            <div className="space-y-3">
                                <span className="text-sm font-medium text-gray-900">Quantity</span>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={decreaseQuantity}
                                        disabled={quantity <= 1}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-medium text-lg">{quantity}</span>
                                    <button
                                        onClick={increaseQuantity}
                                        disabled={quantity >= (selectedSizeObj?.count || 10)}
                                        className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        +
                                    </button>
                                </div>
                                {selectedSizeObj && (
                                    <p className="text-sm text-gray-600">
                                        {selectedSizeObj.count} items available in {selectedSize.size}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button
                                    onClick={addToCart}
                                    className="flex-1 bg-orange-500 text-white py-4 px-6 rounded font-medium hover:bg-orange-600 transition-colors duration-200 font-sans"
                                >
                                    Add to cart
                                </button>
                                <button
                                    onClick={toggleWishlist}
                                    className={`p-4 border rounded transition-colors duration-200 ${
                                        isWishlisted
                                            ? 'border-red-500 text-red-500 bg-red-50'
                                            : 'border-gray-300 text-gray-600 hover:border-gray-400'
                                    }`}
                                >
                                    <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
                                <div className="flex items-center gap-3">
                                    <Truck className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="font-medium text-sm">FREE SHIPPING</p>
                                        <p className="text-xs text-gray-600">Free shipping on orders above ₹1699</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RotateCcw className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="font-medium text-sm">EASY RETURNS</p>
                                        <p className="text-xs text-gray-600">Hassle-Free Returns Within 15 Days</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Store className="w-6 h-6 text-gray-600" />
                                    <div>
                                        <p className="font-medium text-sm">EASY EXCHANGE</p>
                                        <p className="text-xs text-gray-600">Exchange available at your nearest store</p>
                                    </div>
                                </div>
                            </div>

                            {/* Pincode Check */}
                            <div className="pt-6">
                                <p className="text-sm font-medium text-gray-900 mb-3">
                                    Check Your pincode for delivery
                                </p>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="Enter Pincode"
                                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-orange-500"
                                    />
                                    <button
                                        onClick={checkPincode}
                                        disabled={pincodeLoading || pincode.length !== 6}
                                        className="bg-gray-900 text-white px-6 py-2 rounded text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {pincodeLoading ? 'Checking...' : 'Check'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Additional Sections - Stacked vertically */}
                        <div className="space-y-8 border-t border-gray-200 pt-8">
                            {/* Product Description */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Product Description</h3>
                                <p className="text-gray-600 leading-relaxed text-sm">
                                    {product.productDescription}
                                </p>
                            </div>

                            {/* Features */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3">Features</h3>
                                <div className="space-y-1.5">
                                    {product.features && product.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                            <span className="text-gray-600 text-sm">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Product Details */}
                            {product.productDetails && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3">Product Details</h3>
                                    <div className="space-y-1.5 text-sm text-gray-600">
                                        {Object.entries(product.productDetails).map(([key, value]) => (
                                            <div key={key} className="flex gap-2">
                                                <span className="font-medium capitalize min-w-0 flex-1">{key}:</span>
                                                <span className="flex-1">{value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Rating Summary & Reviews */}
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Customer Reviews</h2>

                                {reviewsLoading ? (
                                    <div className="text-center py-6">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mx-auto mb-2"></div>
                                        <p className="text-gray-600 text-sm">Loading reviews...</p>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    <div className="space-y-6">
                                        {/* Rating Summary */}
                                        <RatingSummary />

                                        {/* Reviews List */}
                                        <div className="space-y-0">
                                            {displayedReviews.map((review) => (
                                                <ReviewItem key={review._id} review={review} />
                                            ))}
                                        </div>

                                        {/* Show More/Less Button */}
                                        {reviews.length > 3 && (
                                            <div className="text-center pt-4">
                                                <button
                                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                                    className="inline-flex items-center gap-1 text-orange-500 hover:text-orange-700 font-medium text-sm transition-colors duration-200"
                                                >
                                                    {showAllReviews ? (
                                                        <>
                                                            <ChevronUp className="w-4 h-4" />
                                                            Show Less
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ChevronDown className="w-4 h-4" />
                                                            Show All {reviews.length} Reviews
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No Reviews Yet</h3>
                                        <p className="text-gray-600 text-sm">Be the first to review this product!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage;