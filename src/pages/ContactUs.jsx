import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle, 
  ShoppingBag,
  Truck,
  Shield,
  Heart
} from 'lucide-react';

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    orderNumber: '',
    inquiryType: 'general'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically make an API call to your backend
      const response = await fetch('http://localhost:5100/api/inquiry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      setSuccess('Thank you for your message! We\'ll get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        orderNumber: '',
        inquiryType: 'general'
      });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      details: '+1 (555) 123-4567',
      description: 'Mon-Fri from 9am to 6pm EST',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Us',
      details: 'support@stylecart.com',
      description: 'We reply within 24 hours',
      color: 'bg-amber-50 text-amber-600'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Visit Us',
      details: '123 Fashion Street, Style District',
      description: 'New York, NY 10001',
      color: 'bg-green-50 text-green-600'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Store Hours',
      details: 'Mon-Sat: 10am-9pm',
      description: 'Sunday: 11am-7pm',
      color: 'bg-purple-50 text-purple-600'
    }
  ];

  const quickHelp = [
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: 'Order Issues',
      questions: ['Order tracking', 'Returns & exchanges', 'Payment problems']
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Shipping',
      questions: ['Delivery times', 'Shipping costs', 'International shipping']
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Product Help',
      questions: ['Size guide', 'Care instructions', 'Product availability']
    },
    {
      icon: <Heart className="w-5 h-5" />,
      title: 'Other Questions',
      questions: ['Loyalty program', 'Gift cards', 'Wholesale inquiries']
    }
  ];

  return (
    <div className="min-h-screen .bg-cream-white font-serif pt-20">
      {/* Header */}
      <div className=" ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
              <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're here to help you with any questions about your orders, products, or anything else Stylecart related.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2 ">
            <div className="bg-white border border-amber-100 rounded-2xl shadow-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <MessageCircle className="w-8 h-8 text-amber-600" />
                <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
              </div>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inquiry Type
                  </label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Support</option>
                    <option value="shipping">Shipping Question</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="product">Product Question</option>
                    <option value="wholesale">Wholesale Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {formData.inquiryType === 'order' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number (Optional)
                    </label>
                    <input
                      type="text"
                      name="orderNumber"
                      value={formData.orderNumber}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                      placeholder="e.g., STC-123456"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-lg font-semibold hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Information */}
            <div className="bg-white border border-amber-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title}</h4>
                      <p className="text-gray-900 font-medium">{item.details}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Help */}
            <div className="bg-white border border-amber-100 rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Help</h3>
              <div className="space-y-6">
                {quickHelp.map((section, index) => (
                  <div key={index}>
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="text-amber-600">
                        {section.icon}
                      </div>
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                    </div>
                    <ul className="space-y-2">
                      {section.questions.map((question, qIndex) => (
                        <li key={qIndex} className="text-sm text-gray-600 hover:text-amber-600 transition-colors cursor-pointer">
                          • {question}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ CTA */}
            <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl shadow-xl p-6 text-white">
              <h3 className="text-xl font-bold mb-3">Need Immediate Help?</h3>
              <p className="text-amber-100 mb-4">
                Check our FAQ section for quick answers to common questions.
              </p>
              <button 
                onClick={() => window.location.href = '/faq'}
                className="w-full bg-white text-amber-600 py-3 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Visit FAQ Center
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;