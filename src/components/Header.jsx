// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { HashLink } from "react-router-hash-link";

const Header = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // redirect to home after logout
  };

  // ✅ Navigate to Plans (with seller UID if logged in)
  const handlePlansClick = () => {
    if (currentUser) {
      navigate(`/subscriptions?seller=${currentUser.uid}`);
    } else {
      navigate("/subscriptions");
    }
  };

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
            <Link to="#features" className="text-gray-700 hover:text-green-500 transition">
              Discover
            </Link>
            <Link to="/resources" className="text-gray-700 hover:text-green-500 transition">
              Resources
            </Link>
            <Link to="/portfolio" className="text-gray-700 hover:text-green-500 transition">
              Portfolio
            </Link>

            {/* ✅ Updated Plans Link */}
            <button
              onClick={handlePlansClick}
              className="text-gray-700 hover:text-green-500 transition"
            >
              Plans
            </button>

            {!currentUser && (
              <>
                <Link to="/login" className="text-gray-700 hover:text-green-500 transition">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-700 hover:text-green-500 transition">
                  Sign Up
                </Link>
              </>
            )}

            {currentUser && (
              <>
                <button
                  onClick={() => navigate(`/seller/${currentUser.uid}`)}
                  className="text-gray-700 hover:text-green-500 transition"
                >
                  Seller
                </button>
                <button
                  onClick={() => navigate(`/buyer/${currentUser.uid}`)}
                  className="text-gray-700 hover:text-green-500 transition"
                >
                  Buyer
                </button>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
            <Link
              to="#features"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-green-500 block"
            >
              Discover
            </Link>
            <Link
              to="/resources"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-green-500 block"
            >
              Resources
            </Link>
            <Link
              to="/portfolio"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-green-500 block"
            >
              Portfolio
            </Link>

            {/* ✅ Updated Plans Link for Mobile */}
            <button
              onClick={() => {
                handlePlansClick();
                setIsOpen(false);
              }}
              className="text-gray-700 hover:text-green-500 block text-left w-full"
            >
              Plans
            </button>

            {!currentUser && (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-green-500 block"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="text-gray-700 hover:text-green-500 block"
                >
                  Sign Up
                </Link>
              </>
            )}

            {currentUser && (
              <>
                <button
                  onClick={() => {
                    navigate(`/seller/${currentUser.uid}`);
                    setIsOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-500 block text-left w-full"
                >
                  Seller
                </button>
                <button
                  onClick={() => {
                    navigate(`/buyer/${currentUser.uid}`);
                    setIsOpen(false);
                  }}
                  className="text-gray-700 hover:text-green-500 block text-left w-full"
                >
                  Buyer
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-gray-700 hover:text-red-500 block text-left w-full"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
