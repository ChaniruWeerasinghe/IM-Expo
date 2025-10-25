// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start space-y-6 md:space-y-0">
          
          {/* Logo & Description */}
          <div className="text-center md:text-left">
            <h2 className="text-green-600 font-bold text-2xl mb-2">IM-Expo</h2>
            <p className="text-gray-600 max-w-xs">
              Showcase your talent, connect with verified buyers, and grow your business worldwide.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-12">
            <div className="flex flex-col space-y-2 text-center md:text-left">
              <h3 className="font-semibold">Company</h3>
              <Link to="/" className="hover:text-green-500 transition">Home</Link>
              <Link to="#features" className="hover:text-green-500 transition">Features</Link>
              <Link to="/products" className="hover:text-green-500 transition">Products</Link>
              <Link to="/signup" className="hover:text-green-500 transition">Sign Up</Link>
            </div>

            <div className="flex flex-col space-y-2 text-center md:text-left">
              <h3 className="font-semibold">Dashboard</h3>
              <Link to="/seller" className="hover:text-green-500 transition">Seller</Link>
              <Link to="/buyer" className="hover:text-green-500 transition">Buyer</Link>
              <Link to="/transactions" className="hover:text-green-500 transition">Transactions</Link>
              <Link to="/portfolio" className="hover:text-green-500 transition">Portfolio</Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-gray-300 pt-6 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} IM-Expo. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
