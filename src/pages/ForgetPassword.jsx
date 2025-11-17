import React, { useState } from 'react';
import { Mail, ArrowLeft, CheckCircle, Link } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '../utils/axios'; // Adjust the import path as needed

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: Reset Link Sent
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
  });

  const handleBackToLogin = () => {
    window.location.href = '/login';
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  // Step 1: Request Reset Link
  const handleSendResetLink = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/auth/request-reset-password', { 
        email: formData.email 
      });

      setSuccess('Password reset link sent to your email!');
      toast.success('Password reset link sent!');
      setStep(2);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send reset link';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendLink = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await axios.post('/auth/request-reset-password', { 
        email: formData.email 
      });

      setSuccess('Reset link resent to your email!');
      toast.success('Reset link resent successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to resend reset link';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: // Email Input
        return (
          <form onSubmit={handleSendResetLink} className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
              <p className="text-gray-600">
                Enter your email address and we'll send you a password reset link.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                  Sending Reset Link...
                </div>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        );

      case 2: // Reset Link Sent
        return (
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-gray-900">Check Your Email!</h2>
              <p className="text-gray-600">
                We've sent a password reset link to <span className="font-semibold text-amber-600">{formData.email}</span>
              </p>
              <p className="text-sm text-gray-500">
                The link will expire in 15 minutes. Check your spam folder if you don't see it.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-amber-800 mb-2 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                What's next?
              </h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Check your email inbox
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Click the reset password link
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  You'll be redirected to set a new password
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                  Sign in with your new password
                </li>
              </ul>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                disabled={isLoading}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Change Email
              </button>
              <button
                onClick={handleResendLink}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    Resending...
                  </div>
                ) : (
                  'Resend Link'
                )}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getProgressSteps = () => {
    const steps = [
      { number: 1, label: 'Email', active: step >= 1 },
      { number: 2, label: 'Link Sent', active: step >= 2 },
    ];

    return (
      <div className="flex items-center justify-between mb-8">
        {steps.map((stepItem, index) => (
          <React.Fragment key={stepItem.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  stepItem.active
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepItem.active ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  stepItem.number
                )}
              </div>
              <span
                className={`text-xs mt-2 font-medium ${
                  stepItem.active ? 'text-amber-600' : 'text-gray-400'
                }`}
              >
                {stepItem.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                  step > stepItem.number ? 'bg-amber-500' : 'bg-gray-200'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header with Back Button */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={handleBackToLogin}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-300 disabled:opacity-50"
                disabled={isLoading}
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </button>
              <div className="flex items-center space-x-3">
                <img
                  src="/ecomerccelogo.png"
                  alt="Stylecart Logo"
                  className="w-10 h-10 object-cover rounded-full border-2 border-white"
                />
                <h1 className="text-xl font-bold text-white">Stylecart</h1>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-white text-center">
              Reset Your Password
            </h2>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Progress Steps */}
            {step < 3 && getProgressSteps()}

            {/* Error and Success Messages */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            {/* Step Content */}
            {renderStepContent()}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>15-min Link</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;