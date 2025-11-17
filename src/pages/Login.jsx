import React, { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Facebook, Twitter } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from '../utils/axios'; // Adjust the import path as needed

export const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '' 
  });

  const navigate = useNavigate();
  const submitTimeoutRef = useRef(null);
  const isSubmittingRef = useRef(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmittingRef.current) {
      return;
    }

    if (submitTimeoutRef.current) {
      clearTimeout(submitTimeoutRef.current);
    }

    setIsLoading(true);
    setError('');
    setSuccess('');
    isSubmittingRef.current = true;

    try {
      if (localStorage.getItem('token')) {
        const isValid = true; // await validateToken();
        if (!isValid) {
          setError('Your session has expired. Please login again.');
          return;
        }
      }

      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      
      const payload = isLogin 
        ? {
            email: formData.email,
            password: formData.password
          }
        : {
            fullName: formData.fullName,
            email: formData.email,
            password: formData.password
          };

      const response = await axios.post(endpoint, payload);

      if (isLogin) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        login(response.data.token, response.data.user);
        setSuccess('Login successful! Redirecting...');
        toast.success('Login successful!');
        
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 2000);
      } else {
        setSuccess('Account created successfully! You can now login.');
        toast.success('Account created successfully!');
        
        setTimeout(() => {
          setIsLogin(true);
          setFormData({ email: '', password: '', fullName: '' });
          navigate('/', { replace: true });
        }, 3000);
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Failed to ${isLogin ? 'login' : 'sign up'}`;
      setError(errorMessage);
      console.error(`${isLogin ? 'Login' : 'Signup'} error:`, err);
      
      if (errorMessage.includes('Too many attempts')) {
        toast.error(errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
      
      submitTimeoutRef.current = setTimeout(() => {
        isSubmittingRef.current = false;
      }, 2000);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSocialLogin = (provider) => {
    if (isSubmittingRef.current) return;
    
    console.log(`Social login with ${provider}`);
    setError(`${provider} login is not implemented yet`);
    toast.info(`${provider} login is not implemented yet`);
  };

  const handleToggleForm = () => {
    if (isSubmittingRef.current) return;
    
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
    setFormData({ email: '', password: '', fullName: '' });
  };

  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img
                src="/ecomerccelogo.png"
                alt="Stylecart Logo"
                className="w-12 h-12 object-cover rounded-full border-2 border-white"
              />
              <h1 className="text-2xl font-bold text-white">Stylecart</h1>
            </div>
            <h2 className="text-xl font-semibold text-white">
              {isLogin ? 'Welcome Back!' : 'Join Stylecart Family'}
            </h2>
            <p className="text-amber-100 text-sm mt-2">
              {isLogin ? 'Sign in to your account' : 'Create your account and start shopping'}
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {success}
              </div>
            )}

            <div className="flex bg-amber-50 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => handleToggleForm()}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  isLogin 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled={isLoading}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => handleToggleForm()}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-300 ${
                  !isLogin 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                disabled={isLoading}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required={!isLogin}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              )}

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
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
              </div>

              {isLogin && (
                <div className="text-right">
                  <a 
                    href="/forgot-password" 
                    className="text-sm text-amber-600 hover:text-amber-700 transition-colors disabled:opacity-50"
                  >
                    Forgot your password?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin('facebook')}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Facebook className="w-5 h-5 text-blue-600 mr-2" />
                  Facebook
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin('twitter')}
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Twitter className="w-5 h-5 text-blue-400 mr-2" />
                  Twitter
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={handleToggleForm}
                  className="text-amber-600 hover:text-amber-700 font-semibold transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </div>

            {!isLogin && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  By creating an account, you agree to our{' '}
                  <a href="/terms" className="text-amber-600 hover:text-amber-700">Terms</a>
                  {' '}and{' '}
                  <a href="/privacy" className="text-amber-600 hover:text-amber-700">Privacy Policy</a>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>100% Secure</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Easy Returns</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

// Export as default as well for backward compatibility
export default LoginForm;