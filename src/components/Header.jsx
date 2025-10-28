// src/components/Header.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

import { ref, get } from "firebase/database";
import { db } from "../firebase";


const Header = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const [role, setRole] = useState(null);
  const [clickCount, setClickCount] = useState(0);


  React.useEffect(() => {
    const checkRole = async () => {
      if (!currentUser) return;
      const buyerSnap = await get(ref(db, `users/buyers/${currentUser.uid}`));
      const sellerSnap = await get(ref(db, `users/sellers/${currentUser.uid}`));
      if (buyerSnap.exists()) setRole("buyer");
      else if (sellerSnap.exists()) setRole("seller");
    };
    checkRole();
  }, [currentUser]);



  const handleLogout = async () => {
    await signOut(auth);
    navigate("/"); // Redirect to home after logout
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
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between h-16 items-center">

          {/* Logo with hidden admin trigger */}
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                setClickCount((prev) => {
                  const newCount = prev + 1;
                  if (newCount >= 5) {
                    navigate("/admin-login");
                    return 0;
                  }
                  clearTimeout(window.logoTapTimer);
                  window.logoTapTimer = setTimeout(() => setClickCount(0), 1000);
                  return newCount;
                });
              }}
              className="text-green-600 font-bold text-xl focus:outline-none select-none"
            >
              IM-Expo
            </button>
          </div>


          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/discover"
              className="text-gray-700 hover:text-green-500 transition"
            >
              Discover
            </Link>

            <Link
              to="/resources"
              className="text-gray-700 hover:text-green-500 transition"
            >
              Resources
            </Link>

            <Link
              to="/portfolio"
              className="text-gray-700 hover:text-green-500 transition"
            >
              Portfolio
            </Link>

            {/* ✅ Plans Button */}
            <button
              onClick={handlePlansClick}
              className="text-gray-700 hover:text-green-500 transition"
            >
              Plans
            </button>

            {/* Authentication Links */}
            {!currentUser ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-green-500 transition"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="text-gray-700 hover:text-green-500 transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {role === "seller" && (
                  <button
                    onClick={() => navigate(`/seller/${currentUser.uid}`)}
                    className="text-gray-700 hover:text-green-500 transition"
                  >
                    Seller
                  </button>
                )}

                {role === "buyer" && (
                  <button
                    onClick={() => navigate(`/buyer/${currentUser.uid}`)}
                    className="text-gray-700 hover:text-green-500 transition"
                  >
                    Buyer
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-red-500 transition"
                >
                  Logout
                </button>
              </>

            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-green-500 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
          <div className="px-4 pt-3 pb-4 space-y-2 flex flex-col">

            <Link
              to="/discover"
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

            {/* ✅ Plans Link for Mobile */}
            <button
              onClick={() => {
                handlePlansClick();
                setIsOpen(false);
              }}
              className="text-gray-700 hover:text-green-500 block text-left w-full"
            >
              Plans
            </button>

            {/* Authentication Links */}
            {!currentUser ? (
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
            ) : (
              <>
                {role === "seller" && (
                  <button
                    onClick={() => {
                      navigate(`/seller/${currentUser.uid}`);
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:text-green-500 block text-left w-full"
                  >
                    Seller
                  </button>
                )}

                {role === "buyer" && (
                  <button
                    onClick={() => {
                      navigate(`/buyer/${currentUser.uid}`);
                      setIsOpen(false);
                    }}
                    className="text-gray-700 hover:text-green-500 block text-left w-full"
                  >
                    Buyer
                  </button>
                )}

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
