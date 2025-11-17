import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Carousel from '../components/Carousel';
import axios from '../utils/axios';

const Home = () => {
  const [categorySections, setCategorySections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategorySections = async () => {
      try {
        const response = await axios.get('/category-sections');
        
        if (response.data.success) {
          setCategorySections(response.data.categorySections);
        } else {
          throw new Error('Failed to fetch category sections');
        }
      } catch (err) {
        console.error('Error fetching category sections:', err);
        setError(err.response?.data?.message || err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategorySections();
  }, []);

  if (loading) {
    return (
      <div className="m-0 bg-cream-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-0 bg-cream-white min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>Error loading categories: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="m-0 bg-cream-white">
      {/* Carousel Section */}
      <Carousel />
      
      {/* Category Sections */}
      <section className="font-serif bg-cream-white">
        <div className="container mx-auto px-4">
          
          {/* Main Shop By Category Heading */}
          <div className="text-center mb-5">
            <h2 className="md:text-3xl font-bold text-gray-800 pt-4 pb-2 sm:text-sm">
              SHOP BY CATEGORY
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto"></div>
          </div>
          
          {/* Render each category section */}
          {categorySections.map((section) => (
            <div key={section._id}>
              {/* Section Sub-heading */}
              <div className="text-center mb-8">
                <h3 className="md:text-2xl font-semibold text-gray-700 mb-1 sm:text-sm">
                  {section.name.toUpperCase()}
                </h3>
                {/* <div className="w-20 h-1 bg-amber-400 mx-auto "></div> */}
              </div>

              {/* Categories Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                {section.categories.map((category) => (
                  <Link
                    key={category._id}
                    to={`/products/${section.slug}/${category.slug}`}
                    className="block overflow-hidden  hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/fallback-image.jpg'; // Add a fallback image
                      }}
                    />
                  </Link>
                ))}
              </div>
            </div>
          ))}

        </div>
      </section>
    </div>
  );
};

export default Home;