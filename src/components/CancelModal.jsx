import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

const CancelModal = ({ 
    isOpen, 
    onClose, 
    item, 
    onCancelSubmit, 
    loading = false 
}) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [customReason, setCustomReason] = useState('');

    const cancellationReasons = [
        "Changed my mind",
        "Found better price",
        "Shipping delay",
        "Wrong item/size",
        "Financial reasons",
        "Others"
    ];

    const handleSubmit = () => {
        // For "Others", we send both reason and description
        // For other reasons, we only send the reason
        const finalReason = selectedReason;
        const description = selectedReason === 'Others' ? customReason : '';
        
        if (!finalReason.trim()) {
            alert('Please provide a reason for cancellation');
            return;
        }

        if (selectedReason === 'Others' && !customReason.trim()) {
            alert('Please provide description for "Others" reason');
            return;
        }

        onCancelSubmit(finalReason, description);
    };

    const handleClose = () => {
        setSelectedReason('');
        setCustomReason('');
        onClose();
    };

    const handleReasonSelect = (reason) => {
        setSelectedReason(reason);
        if (reason !== 'Others') {
            setCustomReason('');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 transition-opacity flex items-center justify-center z-40 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold font-serif">
                        Request Item Cancellation
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl"
                        disabled={loading}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    {/* Item Details */}
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                        <img
                            src={item?.product?.images?.[0]?.url || '/placeholder-image.jpg'}
                            alt={item?.product?.productName}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                        />
                        <div className="flex-1">
                            <h5 className="font-medium text-gray-900 font-sans">
                                {item?.product?.productName}
                            </h5>
                            <p className="text-sm text-gray-500 font-sans">
                                Size: {item?.size} • Qty: {item?.quantity}
                            </p>
                            <p className="text-sm font-semibold text-gray-900 font-sans mt-1">
                                ₹{(item?.product?.price * item?.quantity)?.toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Cancellation Reasons */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3 font-sans">
                            Select reason for cancellation *
                        </label>
                        <div className="space-y-2">
                            {cancellationReasons.map((reason) => (
                                <div key={reason} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`reason-${reason}`}
                                        name="cancellationReason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={() => handleReasonSelect(reason)}
                                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300"
                                        disabled={loading}
                                    />
                                    <label
                                        htmlFor={`reason-${reason}`}
                                        className="ml-3 block text-sm font-medium text-gray-700 font-sans cursor-pointer"
                                    >
                                        {reason}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Reason Input - Only for "Others" */}
                    {selectedReason === 'Others' && (
                        <div className="mt-4">
                            <label htmlFor="customReason" className="block text-sm font-medium text-gray-700 mb-2 font-sans">
                                Please specify your reason *
                            </label>
                            <textarea
                                id="customReason"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                placeholder="Please describe your reason for cancellation..."
                                rows="3"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 font-sans"
                                disabled={loading}
                                required
                            />
                        </div>
                    )}

                    {/* Information Note */}
                    <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                        <p className="text-sm text-blue-800 font-sans">
                            <strong>Note:</strong> Your cancellation request will be reviewed by our team. 
                            You'll be notified once it's approved or rejected.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={handleClose}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200 font-sans"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !selectedReason || (selectedReason === 'Others' && !customReason.trim())}
                        className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-sans"
                    >
                        {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CancelModal;