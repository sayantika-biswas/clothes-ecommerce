import React from "react";
import { MapPin, Edit2, Trash2, Home, Building2 } from "lucide-react";

const AddressCard = ({ address, onEdit, onDelete, isDefault }) => {
  const getAddressIcon = () => {
    if (address.addressType === "work") return <Building2 className="w-4 h-4" />;
    return <Home className="w-4 h-4" />;
  };

  return (
    <div className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${
      isDefault ? 'border-orange-400 bg-orange-50' : 'border-gray-200'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-1 rounded-full ${
            isDefault ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'
          }`}>
            {getAddressIcon()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{address.fullName}</h3>
            {isDefault && (
              <span className="inline-block px-2 py-1 bg-orange-400 text-white text-xs rounded-full">
                Default
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(address)}
            className="p-1 text-gray-400 hover:text-orange-400 transition-colors"
            title="Edit address"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(address._id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Delete address"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Address Details */}
      <div className="space-y-1 text-sm text-gray-600">
        <p>{address.houseNo}, {address.street}</p>
        {address.landmark && <p>Near {address.landmark}</p>}
        <p>{address.city}, {address.state} - {address.pincode}</p>
        <p>{address.country}</p>
        <p className="flex items-center space-x-1 mt-2">
          <MapPin className="w-3 h-3" />
          <span>Mobile: {address.mobileNumber}</span>
        </p>
      </div>
    </div>
  );
};

export default AddressCard;