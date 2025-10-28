// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";

// Pages & Components
import Transactions from "./components/Transactions";
import AddProducts from "./pages/AddProducts";
import Resources from "./pages/Resources/Resources";
import Portfolio from "./components/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";
import ExploreProducts from "./components/ExploreProducts";
import Subscriptions from "./pages/Subscriptions";
import AdminDashboard from "./components/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
import InitSubscriptions from "./pages/InitSubscriptions";
import Payment from "./components/Payment";
import Discover from "./pages/Discover";
import SellerTransactions from "./components/SellerTransactions";
import PermitVerification from "./components/PermitVerification";

import ProtectedAdminRoute from "./components/ProtectedAdminRoute";



// import the new page
import SubscriptionsPay from "./components/SubscriptionsPay";

// Login & Signup
import Login from "./components/Login";
import Signup from "./components/Signup";

// Header & Footer
import Header from "./components/Header";
import Footer from "./components/Footer";

// Dashboards
import SellerDashboard from "./components/SellerDashboard";
import BuyerDashboard from "./components/BuyerDashboard";





// ---------------- App ----------------
const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-6 text-gray-700">Loading...</p>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage currentUser={currentUser} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Seller Dashboard */}
        <Route
          path="/seller/:uid"
          element={
            <ProtectedRoute role="seller">
              <SellerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Seller Transactions Page */}
        <Route
          path="/seller-transactions"
          element={
            <ProtectedRoute role="seller">
              <SellerTransactions />
            </ProtectedRoute>
          }
        />





        {/* Seller Add Products */}
        <Route
          path="/seller/:uid/add-products"
          element={
            <ProtectedRoute role="seller">
              <AddProducts />
            </ProtectedRoute>
          }
        />

        {/* Buyer Dashboard */}
        <Route path="/buyer/:uid" element={<BuyerDashboard />} />


        {/* Buyer Explore Products */}
        <Route
          path="/buyer/:uid/explore"
          element={<ExploreProductsWrapper />}
        />

        {/* Other pages */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/subscriptions/pay" element={<SubscriptionsPay />} />
        <Route path="/admin-login" element={<AdminLogin />} />


        <Route path="/init-subscriptions" element={<InitSubscriptions />} />



        {/* Protected Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <div className="w-screen h-screen m-0 p-0 bg-gray-50 overflow-x-hidden">
                <AdminDashboard />
              </div>
            </ProtectedAdminRoute>
          }
        />


        <Route path="/discover" element={<Discover />} />
        <Route path="/permit-verification" element={<PermitVerification />} />




      </Routes>
    </Router>
  );
};











// ---------------- Home Page ----------------
const HomePage = ({ currentUser }) => {
  return (
    <div className="font-roboto bg-gray-50 text-gray-800">
      <Header currentUser={currentUser} logout={() => signOut(auth)} />

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center py-24 px-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white">
        <h2 className="text-4xl md:text-5xl mb-4 font-bold">
          Showcase Your Talent. Connect With Verified Buyers.
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-xl">
          IM-Expo helps talented individuals and local sellers display their work while connecting with buyers and import/export partners.
        </p>

        {/* Hero Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          <HashLink
            smooth
            to={currentUser ? `/seller/${currentUser.uid}` : "/login"}
            className="bg-white text-green-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Get Started
          </HashLink>

          <HashLink
            smooth
            to={currentUser ? `/buyer/${currentUser.uid}` : "/login"}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition"
          >
            Explore Products
          </HashLink>

          <HashLink
            smooth
            to="#features"
            className="bg-white text-green-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            Learn More
          </HashLink>
        </div>
      </section>

      {/* Features Section */}
      <section className="grid gap-8 px-4 py-16 max-w-6xl mx-auto md:grid-cols-3" id="features">
        {/* Feature Cards */}
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

      {/* 🌍 Why IM-Expo Section */}
      <section className="bg-white py-20 px-6 border-t border-gray-200">
        <div className="w-full px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Why IM-Expo is Different
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto mb-12">
            We’re not just another trade platform. IM-Expo was built to remove middlemen, empower small producers,
            and create direct, verified connections that actually build trust — not just traffic.
          </p>
          {/* USP Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            <div className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-green-600 text-xl font-semibold mb-4">Verified Network</h3>
              <p>Every buyer and seller is verified. You trade with real, trusted partners — no fakes or ghost accounts.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-green-600 text-xl font-semibold mb-4">Direct Connections</h3>
              <p>No commissions, no agents. IM-Expo lets you communicate and trade directly, keeping profits in your hands.</p>
            </div>
            <div className="p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition">
              <h3 className="text-green-600 text-xl font-semibold mb-4">Smart Matchmaking</h3>
              <p>Our system connects local producers to importers actively seeking their type of products — intelligently and fairly.</p>
            </div>
          </div>

          {/* Discover How It Works Button */}
          <HashLink
            smooth
            to="/resources#how-it-works"
            scroll={el => {
              const yOffset = -80;
              const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }}
            className="mt-8 inline-block bg-green-500 text-white px-8 py-3 rounded-full font-medium hover:bg-green-600 transition"
          >
            Discover How It Works
          </HashLink>
        </div>
      </section>

      {/* Resources Section */}
      <section className="px-4 py-16 max-w-6xl mx-auto text-center">
        <h2 className="text-3xl text-gray-900 mb-8">Resources & Guides</h2>
        <p className="text-gray-600 mb-6">Export/import guides, seller tips, and buyer insights.</p>

        <HashLink
          smooth
          to="/resources#resource-grid"
          scroll={el => {
            const yOffset = -80;
            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
          className="inline-block bg-green-500 text-white px-8 py-3 rounded-full hover:bg-green-600 transition"
        >
          Explore Resources
        </HashLink>
      </section>

      <Footer />
    </div>
  );
};



// Wrapper to automatically pass buyerUID
const ExploreProductsWrapper = () => {
  const { uid } = useParams();
  return <ExploreProducts buyerUID={uid} />;
};

export default App;
