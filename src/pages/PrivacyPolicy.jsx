import React from "react";
import { FileText, Shield, CreditCard, Truck, User, AlertCircle } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <FileText className="w-8 h-8 text-orange-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Please read these terms carefully before using our website and services.
          </p>
        </div>

        {/* Quick Overview */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <p className="text-orange-800 font-semibold">Important Notice</p>
              <p className="text-orange-700 text-sm mt-1">
                By accessing and using Style Union's website, mobile application, or services, 
                you agree to be bound by these Terms and Conditions. If you disagree with any part, 
                please do not use our services.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              {/* Introduction */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p className="text-gray-700 mb-4">
                  Welcome to Style Union ("we," "our," "us"). These Terms and Conditions govern your use of 
                  our website <span className="font-semibold">www.styleunion.com</span> and our services. 
                  By accessing or using our platform, you agree to comply with these terms.
                </p>
              </section>

              {/* Account Registration */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <User className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">2. Account Registration</h2>
                </div>
                <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                  <li>You must be at least 18 years old to create an account</li>
                  <li>Provide accurate and complete information during registration</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>Notify us immediately of any unauthorized use of your account</li>
                  <li>We reserve the right to suspend or terminate accounts that violate these terms</li>
                </ul>
              </section>

              {/* Products and Pricing */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">3. Products and Pricing</h2>
                </div>
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Product Information</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>We strive to display accurate product colors, but monitor settings may vary</li>
                      <li>Product descriptions and images are for representation purposes</li>
                      <li>All prices are in Indian Rupees (₹) and inclusive of applicable taxes</li>
                      <li>We reserve the right to modify prices without prior notice</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Availability</h3>
                    <ul className="list-disc list-inside text-gray-700 space-y-1 ml-4">
                      <li>All products are subject to availability</li>
                      <li>We may limit quantities available for purchase</li>
                      <li>Out-of-stock items will be clearly marked</li>
                      <li>We reserve the right to discontinue any product at any time</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Orders and Payments */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <CreditCard className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">4. Orders and Payments</h2>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Order Acceptance</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Order confirmation does not constitute acceptance of your order</li>
                    <li>We reserve the right to accept or decline your order for any reason</li>
                    <li>Orders are considered accepted only when shipped</li>
                    <li>We may require additional verification for large orders</li>
                  </ul>

                  <h3 className="font-semibold text-gray-900 mt-4">Payment Methods</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>We accept credit cards, debit cards, net banking, UPI, and wallets</li>
                    <li>Cash on Delivery (COD) is available for eligible orders</li>
                    <li>Payment must be completed before order processing</li>
                    <li>Failed payments may result in order cancellation</li>
                  </ul>
                </div>
              </section>

              {/* Shipping and Delivery */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Truck className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">5. Shipping and Delivery</h2>
                </div>
                <div className="space-y-4">
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Delivery times are estimates and not guaranteed</li>
                    <li>Shipping costs are calculated based on delivery location</li>
                    <li>We ship to addresses within India only</li>
                    <li>Someone must be available at the delivery address to receive the package</li>
                    <li>Risk of loss passes to you upon delivery</li>
                    <li>We are not responsible for delays due to unforeseen circumstances</li>
                  </ul>
                </div>
              </section>

              {/* Returns and Refunds */}
              <section className="mb-8">
                <div className="flex items-center mb-4">
                  <Shield className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-bold text-gray-900">6. Returns and Refunds</h2>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Please refer to our detailed <a href="/return-policy" className="text-orange-500 hover:text-orange-600 underline">Return Policy</a> for complete information. Key points include:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>30-day return window from delivery date</li>
                    <li>Items must be unused, unwashed, and with original tags</li>
                    <li>Refunds processed to original payment method</li>
                    <li>Shipping charges non-refundable (except for defective items)</li>
                    <li>Certain items are non-returnable (innerwear, sale items, etc.)</li>
                  </ul>
                </div>
              </section>

              {/* Intellectual Property */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
                <div className="space-y-4">
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>All content on this website is owned by Style Union</li>
                    <li>You may not reproduce, distribute, or create derivative works</li>
                    <li>Style Union trademarks and logos are our property</li>
                    <li>User-generated content grants us license to use it for business purposes</li>
                  </ul>
                </div>
              </section>

              {/* User Conduct */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. User Conduct</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-2">Permitted Uses</h3>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>Personal, non-commercial use</li>
                      <li>Legal purchasing activities</li>
                      <li>Providing genuine feedback and reviews</li>
                      <li>Sharing content via social media links</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 mb-2">Prohibited Activities</h3>
                    <ul className="text-red-700 text-sm space-y-1">
                      <li>Fraudulent or illegal activities</li>
                      <li>Uploading malicious code or viruses</li>
                      <li>Attempting to gain unauthorized access</li>
                      <li>Posting false or misleading information</li>
                      <li>Harassing other users or staff</li>
                      <li>Commercial use without permission</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Limitation of Liability */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 mb-3">
                    To the fullest extent permitted by law, Style Union shall not be liable for:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                    <li>Indirect, incidental, or consequential damages</li>
                    <li>Loss of profits, data, or business opportunities</li>
                    <li>Delivery delays beyond our control</li>
                    <li>Product misuse or alteration by customers</li>
                    <li>Third-party actions or services</li>
                  </ul>
                  <p className="text-gray-700 mt-3">
                    Our total liability shall not exceed the purchase price of the products in question.
                  </p>
                </div>
              </section>

              {/* Privacy Policy */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy Policy</h2>
                <p className="text-gray-700 mb-4">
                  Your privacy is important to us. Please review our 
                  <a href="/privacy-policy" className="text-orange-500 hover:text-orange-600 underline mx-1">Privacy Policy</a>
                  to understand how we collect, use, and protect your personal information.
                </p>
              </section>

              {/* Changes to Terms */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to Terms</h2>
                <p className="text-gray-700">
                  We reserve the right to modify these Terms and Conditions at any time. 
                  Continued use of our services after changes constitutes acceptance of the modified terms. 
                  We will notify users of significant changes via email or website announcements.
                </p>
              </section>

              {/* Governing Law */}
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
                <p className="text-gray-700">
                  These Terms and Conditions are governed by and construed in accordance with the laws of India. 
                  Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <p className="text-gray-700 mb-4">
                    If you have any questions about these Terms and Conditions, please contact us:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold text-gray-900">Customer Care</p>
                      <p className="text-gray-700">919.929892721</p>
                      <p className="text-gray-600 text-sm">10:30 AM - 9:00 PM (Mon-Fri)</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Email</p>
                      <p className="text-gray-700">jharcwithual@stykeu.no</p>
                      <p className="text-gray-600 text-sm">Legal: candidate@newcommiverse.com</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Acceptance Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-700 mb-4">
            By using our website and services, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms and Conditions.
          </p>
          <p className="text-gray-500 text-sm">
            Last updated: January 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;