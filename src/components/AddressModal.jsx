import React, { useState, useEffect } from "react";
import { X, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from '../utils/axios'; // Adjust the import path as needed

const AddressModal = ({ isOpen, onClose, onSave, editAddress }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    houseNumber: "",
    street: "",
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India"
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Indian cities and states data
  const citiesByState = {
    "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
    "Delhi": ["New Delhi", "Delhi Cantonment"],
    "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
    "West Bengal": ["Kolkata", "Howrah", "Durgapur", "Siliguri"],
    "Uttar Pradesh": ["Lucknow", "Kanpur", "Varanasi", "Agra"]
  };

  const states = Object.keys(citiesByState);

  useEffect(() => {
    if (editAddress) {
      setFormData(editAddress);
    } else {
      setFormData({
        fullName: "",
        mobileNumber: "",
        houseNumber: "",
        street: "",
        landmark: "",
        city: "",
        state: "",
        pincode: "",
        country: "India"
      });
    }
    setErrors({});
  }, [editAddress, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    // Reset city when state changes
    if (name === "state") {
      setFormData(prev => ({
        ...prev,
        city: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile Number is required";
    } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }

    if (!formData.houseNumber.trim()) {
      newErrors.houseNumber = "House/Flat No is required";
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street/Area is required";
    }

    if (!formData.city) {
      newErrors.city = "Please select a city";
    }

    if (!formData.state) {
      newErrors.state = "Please select a state";
    }

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const url = editAddress ? `/address/${editAddress._id}` : "/address";
      const method = editAddress ? "put" : "post";

      const response = await axios[method](url, formData);

      console.log("Address saved successfully:", response.data);
      toast.success(editAddress ? "Address updated successfully!" : "Address saved successfully!");
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error saving address:", error);
      const errorMessage = error.response?.data?.message || "Failed to save address. Please try again.";
      setErrors({ api: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything if modal is not open
  if (!isOpen) return null;

  return (
    <>
      {/* Dark Overlay Background */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-cream-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <MapPin className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {editAddress ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-sm text-gray-600">Save your delivery address</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              disabled={isLoading}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              {errors.fullName && (
                <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.mobileNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="10-digit mobile number"
                maxLength="10"
                disabled={isLoading}
              />
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>
              )}
            </div>

            {/* House No */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                House No / Flat No *
              </label>
              <input
                type="text"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.houseNumber ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="House/Flat number"
                disabled={isLoading}
              />
              {errors.houseNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.houseNumber}</p>
              )}
            </div>

            {/* Street */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street / Area *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                  errors.street ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Street name, area, colony"
                disabled={isLoading}
              />
              {errors.street && (
                <p className="text-red-500 text-xs mt-1">{errors.street}</p>
              )}
            </div>

            {/* Landmark */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landmark (Optional)
              </label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                placeholder="Nearby landmark"
                disabled={isLoading}
              />
            </div>

            {/* State and City */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={isLoading}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select City *
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.state || isLoading}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  } ${!formData.state ? 'bg-gray-100 text-gray-500' : ''}`}
                >
                  <option value="">Select City</option>
                  {formData.state && citiesByState[formData.state]?.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>
            </div>

            {/* Pincode and Country */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent ${
                    errors.pincode ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  disabled={isLoading}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-gray-100"
                  disabled
                />
              </div>
            </div>

            {/* API Error */}
            {errors.api && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.api}</p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {editAddress ? "Updating..." : "Saving..."}
                  </>
                ) : (
                  editAddress ? "Update Address" : "Save Address"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddressModal;