// src/App.jsx
import React from "react";

const App = () => {
  return (
    <div className="font-roboto bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-gray-800 text-white p-4 md:p-6 flex justify-between items-center shadow-md">
        <h1 className="font-bold text-2xl tracking-wide">IM-Expo</h1>
        <nav>
          <a href="#features" className="ml-6 font-medium hover:text-green-500">Features</a>
          <a href="#products" className="ml-6 font-medium hover:text-green-500">Products</a>
          <a href="#signup" className="ml-6 font-medium hover:text-green-500">Sign Up</a>
          <a href="#contact" className="ml-6 font-medium hover:text-green-500">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white">
        <h2 className="text-4xl md:text-5xl mb-4 font-bold">Showcase Your Talent. Connect With Verified Buyers.</h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          IM-Expo helps talented individuals and local sellers display their work while connecting with buyers and import/export partners.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="#signup" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">Get Started</a>
          <a href="#products" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">Explore Products</a>
          <a href="#features" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">Learn More</a>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 px-4 py-16 max-w-6xl mx-auto md:grid-cols-3" id="features">
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-green-500 text-xl mb-4">Talent Showcase</h3>
          <p>Upload your products or work and get discovered by buyers and importers worldwide.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-green-500 text-xl mb-4">Verified Buyers</h3>
          <p>Connect with trusted, verified buyers and import/export partners for secure transactions.</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-md text-center hover:shadow-lg transform hover:-translate-y-1 transition">
          <h3 className="text-green-500 text-xl mb-4">Subscription Plans</h3>
          <p>Flexible plans to suit everyone—from newcomers to established sellers—maximize your reach.</p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto" id="products">
        <h2 className="text-3xl text-center mb-8 text-gray-900">Featured Products</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Product 1 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
            <img src="https://via.placeholder.com/300x180" alt="Product 1" className="w-full h-44 object-cover"/>
            <div className="p-4">
              <h4 className="text-green-500 mb-1">Handmade Jewelry</h4>
              <p className="text-gray-600 text-sm">By talented local seller</p>
            </div>
          </div>
          {/* Product 2 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
            <img src="https://via.placeholder.com/300x180" alt="Product 2" className="w-full h-44 object-cover"/>
            <div className="p-4">
              <h4 className="text-green-500 mb-1">Organic Tea</h4>
              <p className="text-gray-600 text-sm">Freshly grown in Sri Lanka</p>
            </div>
          </div>
          {/* Product 3 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
            <img src="https://via.placeholder.com/300x180" alt="Product 3" className="w-full h-44 object-cover"/>
            <div className="p-4">
              <h4 className="text-green-500 mb-1">Woodcrafts</h4>
              <p className="text-gray-600 text-sm">Unique handmade items</p>
            </div>
          </div>
          {/* Product 4 */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
            <img src="https://via.placeholder.com/300x180" alt="Product 4" className="w-full h-44 object-cover"/>
            <div className="p-4">
              <h4 className="text-green-500 mb-1">Art & Paintings</h4>
              <p className="text-gray-600 text-sm">Local artist collection</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-8 text-center" id="contact">
        <p>&copy; 2025 IM-Expo | Connect, Showcase, Grow</p>
        <p>
          <a href="#" className="text-green-500">Contact Us</a> | 
          <a href="#" className="text-green-500 ml-2">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
};

export default App;
