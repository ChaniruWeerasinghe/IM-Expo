// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-700 mt-12 border-t border-gray-200">
      <div className="w-full px-6 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Logo & Description */}
          <div>
            <h2 className="text-green-600 font-bold text-2xl mb-3">IM-Expo</h2>
            <p className="text-gray-600 mb-4 max-w-xs">
              Showcase your talent, connect with verified buyers, and grow your business worldwide.
            </p>

            {/* Social Links */}
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              <a href="#" className="text-gray-500 hover:text-green-500 transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500 transition">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          {/* Company */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-green-500 transition">Home</Link></li>
              <li><Link to="#features" className="hover:text-green-500 transition">Features</Link></li>
              <li><Link to="/about" className="hover:text-green-500 transition">About Us</Link></li>
              <li><Link to="/signup" className="hover:text-green-500 transition">Join Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-green-500 transition">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-green-500 transition">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-green-500 transition">Terms & Policies</Link></li>
              <li><Link to="/help" className="hover:text-green-500 transition">Help Center</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-gray-800 mb-3">Stay Connected</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to receive updates and trade insights.
            </p>
            <form className="flex items-center justify-center md:justify-start">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 w-2/3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} IM-Expo. All rights reserved.</p>
          <div className="flex space-x-4 mt-3 md:mt-0">
            <Link to="/privacy" className="hover:text-green-500 transition">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-green-500 transition">Terms of Use</Link>
            <span className="text-gray-400">Made in Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
