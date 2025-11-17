import React, { useState, useEffect } from 'react';
import carousal1 from "../assets/carouselone.webp";
import carousal2 from "../assets/carouseltwo.webp";
// Import mobile-specific images if you have them

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Check if it's mobile view
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typically the breakpoint for md in Tailwind
    };

    // Check initially
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const carouselImages = [
    {
      id: 1,
      url: carousal1,
      mobileUrl: "/sc0.jpeg", // Use separate mobile image
      alt: "Summer Collection",
    },
    {
      id: 2,
      url: carousal2,
      mobileUrl: "/sc1.jpeg", // Use separate mobile image
      alt: "Casual Wear",
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselImages.length);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full lg:h-[500px] md:h-[300px] sm:h-[300px] overflow-hidden">
      <div
        className="flex h-full"
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: "transform 500ms ease-in-out",
        }}
      >
        {carouselImages.map((image) => (
          <div key={image.id} className="w-full h-full flex-shrink-0 flex items-start justify-center">
            <img
              src={isMobile ? image.mobileUrl : image.url}
              alt={image.alt}
              className="h-auto w-full pt-3 max-w-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Indicator Dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {carouselImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white' : 'bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;