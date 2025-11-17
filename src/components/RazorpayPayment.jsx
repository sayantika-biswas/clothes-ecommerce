// components/RazorpayPayment.jsx
import React, { useState } from 'react';
import { CreditCard, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '../utils/axios';

const RazorpayPayment = ({ 
  orderData, 
  finalTotal, 
  selectedAddress,
  appliedCoupon,
  onSuccess,
  onFailure,
  onClose 
}) => {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('razorpay');

  const createDeposit = async (orderId, paymentMethod) => {
    try {
      const depositData = {
        orderId,
        paymentMethod: mapPaymentMethod(paymentMethod)
      };

      const response = await axios.post('/deposit', depositData);
      console.log('Deposit created:', response.data);
      return response.data;
    } catch (error) {
      console.log('Deposit creation note:', error.response?.data?.message || 'Deposit API call completed');
      throw error;
    }
  };

  const updateDepositTransaction = async (depositId, razorpayResponse) => {
    try {
      // Create structured transaction object
      const transactionData = {
        gateway: "Razorpay",
        paymentTime: new Date().toISOString(),
        reference: `razorpay_ref_${Math.random().toString(36).substr(2, 9)}`,
        razorpayPaymentId: razorpayResponse.razorpay_payment_id,
        razorpayOrderId: razorpayResponse.razorpay_order_id,
        razorpaySignature: razorpayResponse.razorpay_signature,
        amount: finalTotal,
        currency: "INR"
      };

      const response = await axios.put(`/deposit/${depositId}/transaction`, {
        transactionId: razorpayResponse.razorpay_payment_id,
        transaction: transactionData,
        status: true
      });
      console.log('Deposit transaction updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Deposit update error:', error);
      throw error;
    }
  };

  const mapPaymentMethod = (method) => {
    const methodMap = {
      'razorpay': 'upi_app',
      'cod': 'cod'
    };
    return methodMap[method] || 'upi_app';
  };

  const initiateRazorpayPayment = async () => {
    if (!window.Razorpay) {
      toast.error('Razorpay SDK failed to load. Please refresh the page.');
      return;
    }

    setPaymentLoading(true);

    try {
      // Create order directly with your existing API
      const orderResponse = await axios.post('/orders/create', orderData);

      if (!orderResponse.data.success) {
        throw new Error('Order creation failed');
      }

      const order = orderResponse.data.order;

      // Create initial deposit record and get deposit ID
      const depositResponse = await createDeposit(order._id, 'razorpay');
      const depositId = depositResponse.deposit._id;

      const options = {
        key: 'rzp_test_KcCkybYsHeBXrV',
        amount: finalTotal * 100, // Convert to paise
        currency: 'INR',
        name: 'MacStorm',
        description: 'Clothing Order Payment',
        prefill: {
          email: 'customer@example.com',
          contact: selectedAddress?.mobileNumber || '8188997272',
          name: selectedAddress?.fullName || 'MacStorm Customer',
        },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            console.log('Payment successful:', response);
            
            // Update deposit with structured transaction details
            await updateDepositTransaction(depositId, response);
            
            toast.success('Payment successful! Order confirmed.');
            onSuccess({
              success: true,
              order: order,
              deposit: depositResponse.deposit,
              message: 'Order placed successfully with payment'
            });
          } catch (error) {
            console.error('Deposit update error:', error);
            toast.error('Payment successful but deposit update failed.');
            onFailure(error);
          }
        },
        modal: {
          ondismiss: () => {
            toast.info('Payment cancelled');
            setPaymentLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initialization error:', error);
      
      // Handle specific errors
      if (error.response?.data?.errorType === 'COUPON_ALREADY_USED' || 
          error.response?.data?.message?.includes('already used')) {
        toast.error('This coupon has already been used. Please remove it and try again.');
      } else if (error.response?.data?.errorType === 'COUPON_ERROR') {
        toast.error(error.response.data.message || 'Coupon is no longer valid.');
      } else {
        toast.error('Failed to create order. Please try again.');
      }
      
      setPaymentLoading(false);
      onFailure(error);
    }
  };

  const handleCashOnDelivery = async () => {
    setPaymentLoading(true);
    try {
      // Create order for COD using your existing API
      const orderResponse = await axios.post('/orders/create', orderData);

      if (orderResponse.data.success) {
        const order = orderResponse.data.order;
        
        // Create deposit record for COD (no transaction update needed for COD)
        const depositResponse = await createDeposit(order._id, 'cod');
        
        toast.success('Order placed successfully! Pay when your order arrives.');
        onSuccess({
          ...orderResponse.data,
          deposit: depositResponse.deposit
        });
      } else {
        throw new Error('Order creation failed');
      }
    } catch (error) {
      console.error('COD order error:', error);
      
      // Handle specific coupon errors
      if (error.response?.data?.errorType === 'COUPON_ALREADY_USED' || 
          error.response?.data?.message?.includes('already used')) {
        toast.error('This coupon has already been used. Please remove it and try again.');
      } else if (error.response?.data?.errorType === 'COUPON_ERROR') {
        toast.error(error.response.data.message || 'Coupon is no longer valid.');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
      
      onFailure(error);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    try {
      if (selectedPaymentMethod === 'razorpay') {
        await initiateRazorpayPayment();
      } else if (selectedPaymentMethod === 'cod') {
        await handleCashOnDelivery();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 justify-center items-center flex transition-opacity p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Select Payment Method</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={paymentLoading}
          >
            ✕
          </button>
        </div>
        
        <div className="p-6">
          {/* Order Summary */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-3">Order Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-semibold">₹{finalTotal.toLocaleString()}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span>Coupon Applied:</span>
                  <span>{appliedCoupon.code}</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Delivery:</span>
                <span>FREE</span>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <h4 className="font-semibold">Choose Payment Method</h4>
            
            {/* Razorpay Option */}
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={selectedPaymentMethod === 'razorpay'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="text-orange-500 focus:ring-orange-500"
                disabled={paymentLoading}
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Credit/Debit Card, UPI, Net Banking</span>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Secure payment with Razorpay
                </p>
              </div>
            </label>

            {/* Cash on Delivery Option */}
            <label className="flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 transition-colors">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={selectedPaymentMethod === 'cod'}
                onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                className="text-orange-500 focus:ring-orange-500"
                disabled={paymentLoading}
              />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cash on Delivery</span>
                  <Shield className="w-5 h-5 text-gray-400" />
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Pay when you receive your order
                </p>
              </div>
            </label>
          </div>

          {/* Security Info */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                {selectedPaymentMethod === 'razorpay' 
                  ? 'Your payment details are secure and encrypted. We never store your card information.'
                  : 'You can pay cash when your order is delivered to your address.'
                }
              </p>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={paymentLoading || !selectedPaymentMethod}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors duration-200 ${
              selectedPaymentMethod && !paymentLoading
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {paymentLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {selectedPaymentMethod === 'razorpay' ? 'Opening Payment...' : 'Placing Order...'}
              </div>
            ) : (
              `Pay ₹${finalTotal.toLocaleString()}`
            )}
          </button>

          {/* Security Note */}
          <div className="mt-4 text-center">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Shield className="w-4 h-4 mr-2" />
              Your {selectedPaymentMethod === 'razorpay' ? 'payment' : 'order'} is secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;