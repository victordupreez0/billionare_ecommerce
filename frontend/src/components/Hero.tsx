// Hero section for the homepage. Displays a prominent call-to-action, branding, and a featured image.
// Handles navigation based on authentication status (to products or login page).

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Bitcoin from '../assets/Bitcoin.png';
import BrowseProducts from '@/pages/browseProducts';  // (Unused import, can be removed)

const Hero: React.FC = () => {
  // Check if user is authenticated by checking for a JWT token in localStorage
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const navigate = useNavigate(); // React Router navigation hook
  return (
    <div className="bg-gradient-to-b from-luxury-brown-light/50 to-luxury-primaryGold flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Text section */}
          <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
            <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-luxury-black sm:mt-5 sm:text-5xl lg:mt-6">
              <span className="block">Exclusive Acquisitions</span>
              <span className="block text-luxury-gold-dark">For The Discerning Few</span>
            </h1>
            <p className="mt-3 text-base text-offwhite sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
              {/* Description of the marketplace and a warning about misrepresentation */}
              There are many variations of exclusive items available, but the majority have been curated in some form, by selected vendors, or meticulously authenticated. If you are going to use this marketplace, make sure there isn't anything misrepresented in the listing.
            </p>
            <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start">
                {/* Button navigates to products if authenticated, otherwise to login */}
                <button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/BrowseProducts'); // Go to products page if logged in
                    } else {
                      navigate('/login'); // Otherwise, go to login page
                    }
                  }}
                  className="bg-black text-luxury-primaryGold border border-luxury-brown-light hover:bg-luxury-brown-light hover:text-luxury-black px-6 py-3 rounded-md text-base font-medium transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            </div>
          </div>
          {/* Image section */}
          <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 flex justify-center items-center">
            <div>
              {/* Animated Bitcoin image for visual appeal */}
              <img src={Bitcoin} alt='Bitcoin' className='max-h-80 w-auto animate-bob'></img>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;