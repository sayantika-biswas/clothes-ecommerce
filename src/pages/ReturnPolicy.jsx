import React from "react";
import { Shield, Truck, Clock, Phone, Mail } from "lucide-react";

const ReturnPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Return & Exchange Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We want you to love your Style Union purchase. If you don't, we're here to help.
          </p>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center mb-3">
              <Clock className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">14-Day Return Window</h3>
            <p className="text-gray-600 text-sm">Return within 30 days of delivery</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center mb-3">
              <Truck className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Easy Returns</h3>
            <p className="text-gray-600 text-sm">Free pick-up for returns & exchanges</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
            <div className="flex justify-center mb-3">
              <Shield className="w-6 h-6 text-orange-500" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Quality Checked</h3>
            <p className="text-gray-600 text-sm">Every item quality checked before dispatch</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Return Policy Details */}
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {/* Return Timeline */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Return Timeline</h2>
                <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mb-4">
                  <p className="text-orange-700 font-semibold">
                    You have 14 days from the date of delivery to return your items.
                  </p>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>Returns must be initiated within 14 days of delivery</li>
                  <li>Exchanges can be requested within 20 days of delivery</li>
                  <li>Refunds are processed within 5-7 business days after we receive the returned items</li>
                </ul>
              </section>

              {/* Conditions for Return */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Conditions for Return</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">✅ What Can Be Returned</h3>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>Items with manufacturing defects</li>
                      <li>Wrong size or color received</li>
                      <li>Damaged during shipping</li>
                      <li>Items in original condition with tags</li>
                      <li>Unwashed and unworn items</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">❌ What Cannot Be Returned</h3>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>Items without original tags</li>
                      <li>Washed or worn items</li>
                      <li>Personalized or customized products</li>
                      <li>Innerwear and socks (for hygiene reasons)</li>
                      <li>Sale/clearance items (unless defective)</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Return Process */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Return</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Initiate Return</h3>
                      <p className="text-gray-700">
                        Log in to your account, go to 'Order History' and select the item you want to return.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Pack Items</h3>
                      <p className="text-gray-700">
                        Pack the item in its original packaging with all tags attached. Include the original invoice.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Schedule Pickup</h3>
                      <p className="text-gray-700">
                        We offer free pickup service. Our delivery partner will collect the package from your address.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Receive Refund/Exchange</h3>
                      <p className="text-gray-700">
                        Once we receive and verify the return, your refund will be processed or exchange will be shipped.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Refund Information */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Information</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Refunds are processed to the original payment method</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Processing time: 5-7 business days after we receive the return</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Shipping charges are non-refundable (except for defective/wrong items)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>For cash on delivery orders, refund will be processed to your bank account</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Exchange Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Exchange Policy</h2>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    We understand that sometimes sizes or styles don't work out. Here's our exchange policy:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Exchanges are free of cost for size-related issues</li>
                    <li>You can exchange for a different size of the same product</li>
                    <li>Color exchanges are subject to availability</li>
                    <li>Exchange requests must be made within 45 days of delivery</li>
                    <li>The product must be in original condition with all tags attached</li>
                  </ul>
                </div>
              </section>

              {/* Defective Items */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Defective or Damaged Items</h2>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <p className="text-blue-700">
                    If you receive a defective or damaged item, please contact us within 48 hours of delivery. 
                    We will arrange a free pickup and provide a full refund or replacement.
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-semibold text-gray-900">Customer Care</p>
                        <p className="text-gray-700">919.929892721</p>
                        <p className="text-gray-600 text-sm">10:30 AM - 9:00 PM (Mon-Fri)</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="font-semibold text-gray-900">Email Support</p>
                        <p className="text-gray-700">jharcwithual@stykeu.no</p>
                        <p className="text-gray-600 text-sm">We respond within 24 hours</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        
        {/* Note */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Note: This return policy is subject to change. Please check this page periodically for updates.
            Last updated: January 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;