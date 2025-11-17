import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductCard = ({ product }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isWishlisted, setIsWishlisted] = useState(false);

    useEffect(() => {
        const checkWishlistStatus = async () => {
            try {
                const response = await axios.get(`/wishlist/check/${product._id}`);
                if (response.data.success) {
                    setIsWishlisted(response.data.isWishlisted);
                }
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            }
        };

        checkWishlistStatus();
    }, [product._id]);

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        try {
            if (isWishlisted) {
                // Remove from wishlist
                const response = await axios.post('/wishlist/remove', { productId: product._id });
                if (response.data.success) {
                    setIsWishlisted(false);
                    toast.success('Removed from wishlist');
                }
            } else {
                // Add to wishlist
                const response = await axios.post('/wishlist/add', { productId: product._id });
                if (response.data.success) {
                    setIsWishlisted(true);
                    toast.success('Added to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    return (
        <div className="bg-cream-white font-serif  overflow-hidden hover:shadow-xl transition-all duration-300 " >
         <Link to={`/product/${product._id}`}>
            {/* Product Image */}
            <div className="relative overflow-hidden group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Wishlist Icon */}
                <button
                    onClick={toggleWishlist}
                    className={`absolute top-2 right-2 z-10 p-2 transition-all duration-300 ${
                        isWishlisted 
                            ? ' text-red-700' 
                            : ' text-gray-600'
                    }`}
                >
                    <Heart 
                        className={`w-4 h-4  ${isWishlisted ? 'fill-current' : ''}`} 
                    />
                </button>

                {/* First Image */}
                <img
                    src={product.images[0].url}
                    alt={product.images[0].alt}
                    className={`w-full h-60 md:h-72 object-cover  absolute transition-opacity duration-500 ${
                        isHovered ? 'opacity-0' : 'opacity-100'
                    }`}
                />
                
                {/* Second Image (on hover) */}
                {product.images[1] && (
                    <img
                        src={product.images[1].url}
                        alt={product.images[1].alt}
                        className={`w-full h-60 md:h-72 object-cover transition-opacity duration-500 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                )}
                
                {/* Fallback if only one image */}
                {!product.images[1] && (
                    <img
                        src={product.images[0].url}
                        alt={product.images[0].alt}
                        className="w-full h-60 md:h-72 object-cover"
                    />
                )}
                
            </div>
            </Link>

            {/* Product Info */}
            <div className="p-4">
                {/* Brand */}
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                    {product.brand}
                </p>
                
                {/* Product Name */}
                <h3 className="font-extralight text-gray-900 text-xs md:text-lg mb-2 line-clamp-2">
                    {product.productName}
                </h3>
                
                {/* Price */}
                <div className="flex items-center font-sans gap-2 mb-4">
                    <span className="  text-xs md:text-xl font-bold text-gray-900">₹{product.price}</span>
                    {product.originalPrice > product.price && (
                        <>
                            <span className=" text-xs md:text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                            <span className="text-xs md:text-sm text-orange-500 font-medium">{product.discount}% OFF</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;