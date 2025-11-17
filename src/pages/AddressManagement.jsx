import React, { useState, useEffect } from "react";
import { Plus, MapPin } from "lucide-react";
import { toast } from "react-toastify";
import AddressModal from "../components/AddressModal";
import AddressCard from "../components/AddressCard";
import axios from '../utils/axios'; // Adjust the import path as needed

const AddressManagement = () => {
  const [addresses, setAddresses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("/address");
      setAddresses(response.data.addresses || []);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch addresses";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveAddress = (addressData) => {
    // Refresh addresses after save
    fetchAddresses();
    setEditingAddress(null);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        await axios.delete(`/address/${addressId}`);

        // Remove address from local state
        setAddresses(prev => {
          const filtered = prev.filter(addr => addr._id !== addressId);
          // If we deleted the default address, make the first one default
          if (filtered.length > 0 && !filtered.some(addr => addr.isDefault)) {
            filtered[0].isDefault = true;
          }
          return filtered;
        });

        toast.success("Address deleted successfully!");

      } catch (error) {
        console.error("Error deleting address:", error);
        const errorMessage = error.response?.data?.message || "Failed to delete address";
        toast.error(errorMessage);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.put(`/address/set-default/${addressId}`);

      // Update local state
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr._id === addressId
        }))
      );

      toast.success("Default address updated successfully!");

    } catch (error) {
      console.error("Error setting default address:", error);
      const errorMessage = error.response?.data?.message || "Failed to set default address";
      toast.error(errorMessage);
    }
  };

  const openAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAddress(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-orange-100 rounded-full">
            <MapPin className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Addresses</h1>
            <p className="text-gray-600">Manage your delivery addresses</p>
          </div>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50"
          disabled={isLoading}
        >
          <Plus className="w-4 h-4" />
          <span>Add New Address</span>
        </button>
      </div>

      {/* Loading State */}
      {isLoading && addresses.length === 0 && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading addresses...</p>
        </div>
      )}

      {/* Addresses Grid */}
      {!isLoading && addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No addresses saved</h3>
          <p className="text-gray-500 mb-4">Add your first address to get started</p>
          <button
            onClick={openAddModal}
            className="px-6 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map(address => (
            <div key={address._id} className="relative">
              <AddressCard
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isDefault={address.isDefault}
              />
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address._id)}
                  className="mt-2 text-sm text-orange-400 hover:text-orange-500 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Set as Default
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AddressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSaveAddress}
        editAddress={editingAddress}
      />
    </div>
  );
};

export default AddressManagement;