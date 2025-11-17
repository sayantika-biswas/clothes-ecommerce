// pages/OrderSuccess.jsx or components/OrderSuccess.jsx
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Check, ShoppingBag, Truck, Clock, ArrowRight, Home, Package } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from '../utils/axios';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    const fetchOrderDetails = async () => {
        try {
            const response = await axios.get(`/orders/${orderId}`);
            if (response.data.success) {
                setOrder(response.data.order);
            } else {
                setError('Order not found');
            }
        } catch (error) {
            console.error('Error fetching order:', error);
            setError('Failed to load order details');
            toast.error('Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    const getOrderStatusColor = (status) => {
        switch (status) {
            case 'placed': return 'text-blue-600 bg-blue-100';
            case 'processing': return 'text-yellow-600 bg-yellow-100';
            case 'shipped': return 'text-purple-600 bg-purple-100';
            case 'delivered': return 'text-green-600 bg-green-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getOrderStatusText = (status) => {
        switch (status) {
            case 'placed': return 'Order Placed';
            case 'processing': return 'Processing';
            case 'shipped': return 'Shipped';
            case 'delivered': return 'Delivered';
            case 'cancelled': return 'Cancelled';
            default: return status;
        }
    };

    const getEstimatedDeliveryDate = () => {
        const date = new Date();
        date.setDate(date.getDate() + 10); // 7 days from now
        return date.toLocaleDateString('en-IN', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-cream-white flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Not Found</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream-white py-8">
            <ToastContainer />
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check className="w-10 h-10 text-green-600" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-serif mb-4">
                        Order Confirmed!
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        Thank you for your purchase, {order?.user?.name || 'Customer'}!
                    </p>
                    <p className="text-gray-500">
                        Order ID: <span className="font-mono font-medium">{orderId}</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-4 font-serif">Order Status</h2>
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getOrderStatusColor(order?.orderStatus)}`}>
                                        {getOrderStatusText(order?.orderStatus)}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Order Placed</p>
                                    <p className="text-sm font-medium">
                                        {order?.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        }) : 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Progress Steps */}
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-900">Order Confirmed</p>
                                        <p className="text-sm text-gray-600">Your order has been received</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        ['processing', 'shipped', 'delivered'].includes(order?.orderStatus) 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300'
                                    }`}>
                                        {['processing', 'shipped', 'delivered'].includes(order?.orderStatus) ? (
                                            <Check className="w-4 h-4 text-white" />
                                        ) : (
                                            <Clock className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-900">Processing</p>
                                        <p className="text-sm text-gray-600">We're preparing your order</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        ['shipped', 'delivered'].includes(order?.orderStatus) 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300'
                                    }`}>
                                        {['shipped', 'delivered'].includes(order?.orderStatus) ? (
                                            <Check className="w-4 h-4 text-white" />
                                        ) : (
                                            <Truck className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-900">Shipped</p>
                                        <p className="text-sm text-gray-600">Your order is on the way</p>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                        order?.orderStatus === 'delivered' 
                                            ? 'bg-green-500' 
                                            : 'bg-gray-300'
                                    }`}>
                                        {order?.orderStatus === 'delivered' ? (
                                            <Check className="w-4 h-4 text-white" />
                                        ) : (
                                            <Package className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                    <div className="ml-4">
                                        <p className="font-medium text-gray-900">Delivered</p>
                                        <p className="text-sm text-gray-600">Order delivered successfully</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold mb-4 font-serif">Order Items</h2>
                            <div className="space-y-4">
                                {order?.items?.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                                        <img
                                            src={item.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                                            alt={item.product?.productName}
                                            className="w-16 h-20 object-cover rounded-md"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-medium text-gray-900">{item.product?.productName}</h3>
                                            <p className="text-sm text-gray-600">Size: {item.size}</p>
                                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900">
                                                ₹{(item.product?.price * item.quantity).toLocaleString()}
                                            </p>
                                            {item.product?.originalPrice > item.product?.price && (
                                                <p className="text-sm text-gray-500 line-through">
                                                    ₹{(item.product?.originalPrice * item.quantity).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Shipping Address */}
                        {order?.shippingAddress && (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <h2 className="text-xl font-semibold mb-4 font-serif">Shipping Address</h2>
                                <div className="space-y-2">
                                    <p className="font-medium">{order.shippingAddress.fullName}</p>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.houseNumber}, {order.shippingAddress.street}
                                        {order.shippingAddress.landmark && `, ${order.shippingAddress.landmark}`}
                                    </p>
                                    <p className="text-gray-600">
                                        {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                    </p>
                                    <p className="text-gray-600">Phone: {order.shippingAddress.mobileNumber}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-4 font-serif">Order Summary</h2>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span>Items Total</span>
                                    <span>₹{order?.items?.reduce((sum, item) => sum + (item.product?.price * item.quantity), 0).toLocaleString()}</span>
                                </div>
                                
                                {order?.coupon?.discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{order?.coupon?.discount?.toLocaleString()}</span>
                                    </div>
                                )}
                                
                                <div className="flex justify-between text-sm text-green-600">
                                    <span>Delivery</span>
                                    <span>FREE</span>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total Amount</span>
                                        <span>₹{order?.totalAmount?.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="pt-3 border-t border-gray-200">
                                    <p className="text-sm text-gray-600">Payment Method</p>
                                    <p className="font-medium capitalize">
                                        {order?.paymentMethod === 'cod' ? 'Cash on Delivery' : 
                                         order?.paymentMethod === 'razorpay' ? 'Online Payment' : 
                                         order?.paymentMethod || 'N/A'}
                                    </p>
                                    <p className={`text-sm ${
                                        order?.paymentStatus === 'paid' ? 'text-green-600' : 
                                        order?.paymentStatus === 'pending' ? 'text-yellow-600' : 
                                        'text-gray-600'
                                    }`}>
                                        {order?.paymentStatus === 'paid' ? 'Paid' : 
                                         order?.paymentStatus === 'pending' ? 'Pending' : 
                                         'Payment Status Unknown'}
                                    </p>
                                </div>
                            </div>

                            {/* Delivery Estimate */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                <div className="flex items-center">
                                    <Truck className="w-5 h-5 text-orange-500 mr-2" />
                                    <div>
                                        <p className="font-medium text-orange-800">Estimated Delivery</p>
                                        <p className="text-sm text-orange-700">{getEstimatedDeliveryDate()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    to="/orders"
                                    className="w-full bg-orange-500 text-white py-3 px-4 rounded-md font-medium hover:bg-orange-600 transition-colors flex items-center justify-center"
                                >
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    View All Orders
                                </Link>
                                
                                <Link
                                    to="/"
                                    className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
                                >
                                    <Home className="w-4 h-4 mr-2" />
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* Support Info */}
                            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
                                <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-700">Email: support@macstorm.com</p>
                                    <p className="text-gray-700">Phone: +91 1800-123-4567</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;