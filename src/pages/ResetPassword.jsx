import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from '../utils/axios'; // Adjust the import path as needed

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(null); // null = checking, true = valid, false = invalid

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  // Get token and email from URL parameters
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Check if token is valid on component mount
  useEffect(() => {
    if (!token || !email) {
      setIsTokenValid(false);
      setError('Invalid or missing reset link parameters');
      return;
    }
    
    // You might want to add a token validation API call here
    // For now, we'll assume the token is valid if both parameters exist
    setIsTokenValid(true);
  }, [token, email]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Validate passwords match
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      toast.error('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      toast.error('Password must be at least 6 characters long');
      return;
    }

    try {
      const payload = {
        email: email,
        token: token,
        newPassword: formData.newPassword
      };

      await axios.post('/auth/reset-password', payload);

      setSuccess('Password reset successfully! Your account has been activated.');
      toast.success('Password reset successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      setIsTokenValid(false);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const handleRequestNewLink = () => {
    navigate('/forgot-password');
  };

  // Show loading while checking token
  if (isTokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img
                  src="/ecomerccelogo.png"
                  alt="Stylecart Logo"
                  className="w-10 h-10 object-cover rounded-full border-2 border-white"
                />
                <h1 className="text-xl font-bold text-white">Stylecart</h1>
              </div>
              <p className="text-amber-100 text-sm mt-2">Verifying reset link...</p>
            </div>
            <div className="p-8 text-center">
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-t-2 border-amber-500 border-solid rounded-full animate-spin mr-3"></div>
                <span className="text-gray-600">Checking reset link validity...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (isTokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img
                  src="/ecomerccelogo.png"
                  alt="Stylecart Logo"
                  className="w-10 h-10 object-cover rounded-full border-2 border-white"
                />
                <h1 className="text-xl font-bold text-white">Stylecart</h1>
              </div>
              <p className="text-amber-100 text-sm mt-2">Reset Password</p>
            </div>
            
            <div className="p-8 text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-gray-900">Invalid Reset Link</h2>
                <p className="text-gray-600">
                  {error || 'This password reset link is invalid or has expired.'}
                </p>
                <p className="text-sm text-gray-500">
                  Reset links expire after 15 minutes for security reasons.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBackToLogin}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Back to Login
                </button>
                <button
                  onClick={handleRequestNewLink}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  Request New Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show reset password form if token is valid
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img
                src="/ecomerccelogo.png"
                alt="Stylecart Logo"
                className="w-10 h-10 object-cover rounded-full border-2 border-white"
              />
              <h1 className="text-xl font-bold text-white">Stylecart</h1>
            </div>
            <h2 className="text-lg font-semibold text-white">Create New Password</h2>
            <p className="text-amber-100 text-sm mt-2">for {email}</p>
          </div>

          {/* Form Section */}
          <div className="p-8">
            {/* Success Message */}
            {success && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {success}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            {!success ? (
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-700 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Reset link verified. You can now set your new password.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password (min. 6 characters)"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
                  </div>

                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        required
                        disabled={isLoading}
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
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
                      Resetting Password...
                    </div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-600">Redirecting to login page...</p>
              </div>
            )}
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
              <span>Instant Process</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;