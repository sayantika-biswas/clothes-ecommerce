import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen font-serif bg-cream-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            About Our Company
          </h1>
          <div className="w-24 h-1 bg-amber-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            We are committed to delivering exceptional quality and unparalleled service to our valued customers worldwide.
          </p>
        </div>

        {/* Mission & Vision Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🎯</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed">
              To provide high-quality products that enhance our customers' lives while maintaining sustainable practices and fostering meaningful relationships with our community and partners.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-amber-100 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-2xl">🔭</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Vision</h2>
            <p className="text-gray-600 leading-relaxed">
              To become the most trusted and innovative brand in our industry, setting new standards for quality, customer service, and environmental responsibility.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-16 border border-amber-50">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Story</h2>
          <div className="space-y-6 text-gray-600 leading-relaxed">
            <p className="text-lg">
              Founded with a simple yet powerful idea: to create products that make a difference. What started as a small venture has grown into a company that serves thousands of customers across the globe.
            </p>
            <p>
              Our journey began when our founders recognized a gap in the market for high-quality, affordable products that don't compromise on ethics or sustainability. Through dedication and a customer-first approach, we've built a brand that people trust and love.
            </p>
            <p>
              Today, we continue to innovate and expand our offerings while staying true to our core values. Every product we create is a testament to our commitment to excellence and our passion for serving our community.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Quality</h3>
              <p className="text-gray-600">
                We never compromise on quality. Every product undergoes rigorous testing to ensure it meets our high standards.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Integrity</h3>
              <p className="text-gray-600">
                We believe in transparency and honesty in all our dealings with customers, partners, and employees.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Sustainability</h3>
              <p className="text-gray-600">
                We are committed to environmentally responsible practices and reducing our ecological footprint.
              </p>
            </div>
          </div>
        </div>

        {/* Team Philosophy Section */}
        <div className="bg-amber-50 rounded-lg p-8 mb-16 border border-amber-200">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Philosophy</h2>
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-gray-700 mb-6 italic">
              "We believe that great businesses are built on great relationships – with our customers, our team, and our planet."
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our approach combines innovation with tradition, technology with human touch, and business growth with social responsibility. We measure our success not just by profits, but by the positive impact we create in the lives of our customers and the health of our planet.
            </p>
          </div>
        </div>

        {/* Commitment Section */}
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border border-amber-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Commitment to You</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Customer Satisfaction
              </h4>
              <p className="text-gray-600 text-sm">
                Your happiness is our priority. We stand behind every product with comprehensive support and easy returns.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Continuous Improvement
              </h4>
              <p className="text-gray-600 text-sm">
                We constantly seek feedback and innovate to bring you better products and services.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Community Support
              </h4>
              <p className="text-gray-600 text-sm">
                We give back to the communities that support us through various initiatives and partnerships.
              </p>
            </div>
            <div className="text-left">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                Ethical Practices
              </h4>
              <p className="text-gray-600 text-sm">
                We ensure fair treatment and safe working conditions throughout our supply chain.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 p-8 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Get in Touch</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Have questions or want to learn more about us? We'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-amber-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-colors duration-300 shadow-sm">
              Contact Us
            </button>
            <button className="border border-amber-600 text-amber-600 px-8 py-3 rounded-full font-semibold hover:bg-amber-50 transition-colors duration-300">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;