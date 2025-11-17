import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
// import navigationData from "../data/navigationData.json";


const MobileSidebar = ({ isOpen, onClose ,navigationData }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const topLevel = navigationData?.navigation?.topLevel || [];
  const toggleSection = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
    setExpandedCategory(null); // Close any open category when section changes
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  return (
    <>
      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Menu */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 max-w-full bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <img
              src="/ecomerccelogo.png"
              alt="Logo"
              className="w-10 h-10 object-cover rounded-full"
            />
            <span className="text-lg font-bold text-gray-800">Menu</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            {/* Top Level Sections */}
            {topLevel.map((section) => (
              <div key={section.id} className="mb-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between py-3 px-2 text-left font-semibold text-gray-800 hover:text-orange-500 transition-colors"
                >
                  <span>{section.name}</span>
                  <ChevronDown 
                    className={`w-4 h-4 transition-transform ${
                      expandedSection === section.id ? 'rotate-180' : ''
                    }`} 
                  />
                </button>

                {/* Section Categories */}
                {expandedSection === section.id && section.categories && (
                  <div className="ml-4 border-l border-gray-200">
                    {section.categories.map((category) => (
                      <div key={category.id} className="mb-1">
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between py-2 px-3 text-left text-gray-700 hover:text-orange-500 transition-colors"
                        >
                          <span className="font-medium">{category.name}</span>
                          {category.subcategories && category.subcategories.length > 0 && (
                            <ChevronDown 
                              className={`w-4 h-4 transition-transform ${
                                expandedCategory === category.id ? 'rotate-180' : ''
                              }`} 
                            />
                          )}
                        </button>

                        {/* Subcategories */}
                        {expandedCategory === category.id && category.subcategories && (
                          <div className="ml-4 border-l border-gray-200">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.id}
                                to={`/${section.slug}/${category.slug}/${subcategory.slug}`}
                                className="block py-2 px-4 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                onClick={onClose}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{subcategory.name}</span>
                                  {subcategory.productCount && (
                                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                      {subcategory.productCount}
                                    </span>
                                  )}
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}

                        {/* Handle categories that have nested categories (like Kids) */}
                        {expandedCategory === category.id && category.categories && (
                          <div className="ml-4 border-l border-gray-200">
                            {category.categories.map((nestedCategory) => (
                              <div key={nestedCategory.id} className="mb-1">
                                {/* Nested Category Header */}
                                <div className="py-2 px-3 text-gray-700 font-medium">
                                  {nestedCategory.name}
                                </div>

                                {/* Nested Subcategories */}
                                {nestedCategory.subcategories && (
                                  <div className="ml-4 border-l border-gray-200">
                                    {nestedCategory.subcategories.map((subcategory) => (
                                      <Link
                                        key={subcategory.id}
                                        to={`/${section.slug}/${category.slug}/${nestedCategory.slug}/${subcategory.slug}`}
                                        className="block py-2 px-4 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                                        onClick={onClose}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span>{subcategory.name}</span>
                                          {subcategory.productCount && (
                                            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                              {subcategory.productCount}
                                            </span>
                                          )}
                                        </div>
                                      </Link>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-center text-xs text-gray-500">
            <p>© 2024 Your Store. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;