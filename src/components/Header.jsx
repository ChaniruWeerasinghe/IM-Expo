// src/components/Header.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-green-600 font-bold text-xl">
              IM-Expo
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="#features" className="text-gray-700 hover:text-green-500 transition">Features</Link>
            <Link to="/products" className="text-gray-700 hover:text-green-500 transition">Products</Link>
            <Link to="/signup" className="text-gray-700 hover:text-green-500 transition">Sign Up</Link>
            <Link to="#contact" className="text-gray-700 hover:text-green-500 transition">Contact</Link>
            <Link to="/seller" className="text-gray-700 hover:text-green-500 transition">Seller</Link>
            <Link to="/buyer" className="text-gray-700 hover:text-green-500 transition">Buyer</Link>
            <Link to="/transactions" className="text-gray-700 hover:text-green-500 transition">Transactions</Link>
            <Link to="/portfolio" className="text-gray-700 hover:text-green-500 transition">Portfolio</Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
            <Link to="#features" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Features</Link>
            <Link to="/products" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Products</Link>
            <Link to="/signup" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Sign Up</Link>
            <Link to="#contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Contact</Link>
            <Link to="/seller" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Seller</Link>
            <Link to="/buyer" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Buyer</Link>
            <Link to="/transactions" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Transactions</Link>
            <Link to="/portfolio" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-green-500 block">Portfolio</Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
