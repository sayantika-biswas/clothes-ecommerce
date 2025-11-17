import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Heart, Shield, Clock } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-cream-white font-serif">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Shield className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">100% ORIGINAL Products</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">14 Days Return Policy</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full shadow-sm">
                <Heart className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-gray-800">Customer First Approach</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img
                  src="/ecomerccelogo.png"
                  alt="Stylecart Logo"
                  className="w-14 h-14 object-cover rounded-full border-2 border-amber-200 shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-amber-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Stylecart</span>
                <p className="text-xs text-gray-500">Fashion Redefined</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed text-sm">
              Your premier destination for curated fashion. We blend style with affordability, bringing you the latest trends with uncompromised quality.
            </p>
            
            {/* Newsletter Subscription */}
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-700 mb-3">Stay Updated</p>
              <div className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent bg-amber-50"
                />
                <button className="px-4 py-2 bg-amber-500 text-white text-sm font-medium rounded-lg hover:bg-amber-600 transition-colors shadow-sm">
                  Join
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-5 w-1/2 h-0.5 bg-amber-400"></span>
            </h3>
            <ul className="space-y-3">
              {['About Us', 'Contact Us', 'FAQ', 'Shipping Info'].map((link) => (
                <li key={link}>
                  <a 
                    href={`/${link.toLowerCase().replace(' ', '-')}`}
                    className="text-gray-600 hover:text-amber-600 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 relative inline-block">
              Customer Care
              <span className="absolute bottom-0 left-5 w-1/2 h-0.5 bg-amber-400"></span>
            </h3>
            <ul className="space-y-3">
              {[
                'Return Policy',
                'Terms&Conditions', 
                'Privacy Policy',
                'Size Guide',
                'Track Order',
                'Payment Security'
              ].map((link) => (
                <li key={link}>
                  <a 
                    href={`/${link.toLowerCase().replace(' ', '-').replace('&', 'and')}`}
                    className="text-gray-600 hover:text-amber-600 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-1.5 h-1.5 bg-amber-300 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-gray-800 relative inline-block">
              Connect With Us
              <span className="absolute bottom-0 left-5 w-1/2 h-0.5 bg-amber-400"></span>
            </h3>
            
            {/* Contact Info */}
            <div className="space-y-4 mb-6">
              {[
                { icon: Mail, text: 'support@stylecart.com' },
                { icon: Phone, text: '+1 (555) 123-4567' },
                { icon: MapPin, text: '123 Fashion Street, Style City' }
              ].map((item, index) => (
                <div key={index} className="flex items-center space-x-3 text-gray-600 group">
                  <div className="p-2 bg-amber-50 rounded-lg group-hover:bg-amber-100 transition-colors">
                    <item.icon className="w-4 h-4 text-amber-600" />
                  </div>
                  <span className="text-sm group-hover:text-gray-800 transition-colors">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-md font-medium mb-4 text-gray-700">Follow Our Journey</h4>
              <div className="flex space-x-3">
                {[
                  { icon: Facebook, color: 'hover:bg-blue-500' },
                  { icon: Twitter, color: 'hover:bg-blue-400' },
                  { icon: Instagram, color: 'hover:bg-pink-500' },
                  { icon: Youtube, color: 'hover:bg-red-500' }
                ].map((social, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`p-3 bg-amber-50 rounded-xl text-gray-600 ${social.color} hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-sm hover:shadow-md`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-100 bg-amber-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <p className="text-gray-600 text-sm">
                © 2024 Stylecart. Crafted with 
              </p>
              <Heart className="w-4 h-4 text-amber-500 fill-amber-500" />
              <p className="text-gray-600 text-sm">
                for fashion lovers.
              </p>
            </div>
            <div className="flex space-x-6 text-sm">
              {['Sitemap', 'Accessibility', 'Cookies'].map((link) => (
                <a
                  key={link}
                  href={`/${link.toLowerCase()}`}
                  className="text-gray-500 hover:text-amber-600 transition-colors relative group"
                >
                  {link}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-400 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;