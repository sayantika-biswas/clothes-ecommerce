import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WishlistCard from '../components/WishlistCard';
import axios from '../utils/axios';

const WishlistPage = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await axios.get('/wishlist');
            console.log('Wishlist API Response:', response.data);
            if (response.data.success) {
                setWishlistItems(response.data.wishlist?.products || []);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
            toast.error('Failed to load wishlist');
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const response = await axios.post('/wishlist/remove', { productId });
            if (response.data.success) {
                setWishlistItems(prev => prev.filter(item => item._id !== productId));
                toast.success('Removed from wishlist');
            } else {
                toast.error('Failed to remove from wishlist');
            }
        } catch (error) {
            console.error('Error removing from wishlist:', error);
            toast.error('Failed to remove from wishlist');
        }
    };

    const addToBag = async (productId, selectedSizeObj) => {
        try {
            console.log(`Product ${productId} with size ${selectedSizeObj.size} added to bag`);
            
            // Make API call to add product to cart with selected size
            const response = await axios.post('/cart/add', {
                productId: productId,
                size: selectedSizeObj.size,
                sizeLabel: selectedSizeObj.sizeLabel,
                quantity: 1
            });

            if (response.data.success) {
                // Remove from wishlist after successful addition to cart
                removeFromWishlist(productId);
                
                // Show success message with size info
                const sizeDisplay = selectedSizeObj.sizeLabel || selectedSizeObj.size;
                toast.success(
                    <div>
                        <div className="font-semibold">Added to Bag!</div>
                        <div className="text-sm">Size: {sizeDisplay}</div>
                    </div>,
                    {
                        autoClose: 3000,
                        closeButton: true,
                    }
                );
            } else {
                toast.error('Failed to add product to bag');
            }
        } catch (error) {
            console.error('Error adding to bag:', error);
            
            // Check for specific error types
            if (error.response) {
                // Server responded with error status
                const message = error.response.data?.message || 'Failed to add product to bag';
                toast.error(message);
            } else if (error.request) {
                // Network error
                toast.error('Network error. Please check your connection.');
            } else {
                // Other errors
                toast.error('Failed to add product to bag');
            }
        }
    };

    if (loading) {
        return (
            <>
                <div className="min-h-screen flex items-center justify-center">Loading...</div>
                <ToastContainer />
            </>
        );
    }

    return (
        <div className="min-h-screen font-serif bg-cream-white py-6">
            {/* Toast Container */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                style={{
                    fontSize: '14px',
                }}
            />
            
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                        <Heart className="w-6 h-6 text-red-500 fill-current" />
                        <h1 className="text-xl md:text-2xl font-bold">My Wishlist</h1>
                    </div>
                    <span>{wishlistItems?.length || 0} items</span>
                </div>

                {wishlistItems && wishlistItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-600 mb-4">Your wishlist is empty</p>
                        <Link 
                            to="/" 
                            className="text-orange-500 hover:underline font-medium"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {wishlistItems.map((product) => (
                            <WishlistCard 
                                key={product._id} 
                                product={product} 
                                onRemoveFromWishlist={removeFromWishlist} 
                                onAddToBag={addToBag} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;