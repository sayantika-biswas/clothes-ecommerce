import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import  { Link } from 'react-router-dom';

const WishlistCard = ({ product, onRemoveFromWishlist, onAddToBag }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [availableSizes, setAvailableSizes] = useState([]);

    // Initialize available sizes when product changes
    useEffect(() => {
        if (product.sizes && Array.isArray(product.sizes)) {
            // Filter only sizes that are in stock
            const inStockSizes = product.sizes.filter(size => size.inStock);
            setAvailableSizes(inStockSizes);
        } else {
            // Fallback sizes if product doesn't have sizes array
            setAvailableSizes([]);
        }
    }, [product]);

    const handleMoveToBag = () => {
        if (availableSizes.length === 0) {
            alert('No sizes available for this product');
            return;
        }
        setShowSizeModal(true);
    };

    const handleSizeSelect = (sizeObj) => {
        setSelectedSize(sizeObj);
    };

    const handleAddToBag = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        
        // Call the parent function with product ID and selected size object
        onAddToBag(product._id, selectedSize);
        setShowSizeModal(false);
        setSelectedSize('');
    };

    const handleCloseModal = () => {
        setShowSizeModal(false);
        setSelectedSize('');
    };

    // Function to get display text for size
    const getSizeDisplayText = (sizeObj) => {
        return sizeObj.sizeLabel || sizeObj.size || 'Size';
    };

    // Function to check if a size is selected
    const isSizeSelected = (sizeObj) => {
        return selectedSize && selectedSize.size === sizeObj.size;
    };

    return (
        <>
            <div className="bg-cream-white font-serif overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
                {/* Product Image */}
                <div 
                    className="relative overflow-hidden group"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <button 
                        onClick={() => onRemoveFromWishlist(product._id)} 
                        className="text-red-500 hover:text-red-700 absolute top-2 right-2 z-10 p-2 rounded-full bg-gray-50 border border-gray-200 transition-all duration-300"
                    >
                        <X className="w-3 h-3" />
                    </button>
                    
                    {/* First Image */}
                    <img
                        src={product.images[0]?.url || '/placeholder-image.jpg'}
                        alt={product.images[0]?.alt || product.productName}
                        className={`w-full h-60 md:h-72 object-cover absolute transition-opacity duration-500 ${
                            isHovered ? 'opacity-0' : 'opacity-100'
                        }`}
                    />
                    
                    {/* Second Image (on hover) */}
                    {product.images[1] && (
                        <img
                            src={product.images[1].url}
                            alt={product.images[1].alt || product.productName}
                            className={`w-full h-60 md:h-72 object-cover transition-opacity duration-500 ${
                                isHovered ? 'opacity-100' : 'opacity-0'
                            }`}
                        />
                    )}
                    
                    {/* Fallback if only one image */}
                    {!product.images[1] && (
                        <img
                            src={product.images[0]?.url || '/placeholder-image.jpg'}
                            alt={product.images[0]?.alt || product.productName}
                            className="w-full h-60 md:h-72 object-cover"
                        />
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4 pb-0">
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
                        <span className="text-xs md:text-xl font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice > product.price && (
                            <>
                                <span className="text-xs md:text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                <span className="text-xs md:text-sm text-orange-500 font-medium">
                                    {product.discount}% OFF
                                </span>
                            </>
                        )}
                    </div>

                    {/* Available Sizes Preview */}
                    {/* {availableSizes.length > 0 && (
                        <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Available Sizes:</p>
                            <div className="flex flex-wrap gap-1">
                                {availableSizes.slice(0, 3).map((sizeObj, index) => (
                                    <span 
                                        key={`${product._id}-${sizeObj.size}-${index}`}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded border"
                                    >
                                        {sizeObj.size}
                                    </span>
                                ))}
                                {availableSizes.length > 3 && (
                                    <span className="text-xs text-gray-500">+{availableSizes.length - 3} more</span>
                                )}
                            </div>
                        </div>
                    )} */}
                </div>
                
                <div className="flex items-center justify-center border-t border-gray-200">
                    <button 
                        onClick={handleMoveToBag} 
                        disabled={availableSizes.length === 0}
                        className={`text-sm px-3 py-3 w-full transition-colors duration-200 ${
                            availableSizes.length === 0 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-orange-500 hover:text-orange-600'
                        }`}
                    >
                        {availableSizes.length === 0 ? 'OUT OF STOCK' : 'MOVE TO BAG'}
                    </button>
                </div>
            </div>

            {/* Size Selection Modal */}
            {showSizeModal && (
                <div className="fixed inset-0  bg-black/25  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold">Select Size</h3>
                            <button 
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {/* Product Preview */}
                            <div className="flex items-center space-x-4 mb-6">
                                <img 
                                    src={product.images[0]?.url || '/placeholder-image.jpg'} 
                                    alt={product.images[0]?.alt || product.productName}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500 uppercase">{product.brand}</p>
                                    <h4 className="font-light text-gray-900 text-sm line-clamp-2">{product.productName}</h4>
                                    <p className="text-sm font-bold text-gray-900">₹{product.price}</p>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-700 mb-3">SELECT SIZE</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {availableSizes.map((sizeObj, index) => (
                                        <button
                                            key={`${product._id}-${sizeObj.size}-${index}`}
                                            onClick={() => handleSizeSelect(sizeObj)}
                                            className={`py-0.5 px-0.5 border rounded-full text-sm font-medium transition-all duration-200 ${
                                                isSizeSelected(sizeObj)
                                                    ? 'border-orange-500 text-orange-500 bg-orange-50'
                                                    : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                            }`}
                                        >
                                            { sizeObj.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Selected Size Info */}
                            {selectedSize && (
                                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                                    <p className="text-sm text-green-800">
                                        Selected: <strong>{getSizeDisplayText(selectedSize)}</strong>
                                        {selectedSize.count && (
                                            <span className="text-green-600 ml-2">
                                                ({selectedSize.count} available)
                                            </span>
                                        )}
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex space-x-3">
                                <button
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors duration-200 text-sm font-medium"
                                >
                                    CANCEL
                                </button>
                                <button
                                    onClick={handleAddToBag}
                                    disabled={!selectedSize}
                                    className={`flex-1 py-3 px-4 rounded transition-colors duration-200 text-sm font-medium ${
                                        selectedSize
                                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                                >
                                    DONE
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default WishlistCard;