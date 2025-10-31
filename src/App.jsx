// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";
import Lottie from "lottie-react";
import { db } from "./firebase";
import { ref, get } from "firebase/database";



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
import ChatBot from "./components/ChatBot";




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


const StatsSection = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    sellers: 0,
    buyers: 0,
    verified: 0,
    products: 0,
    transactions: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const sellersSnap = await get(ref(db, "users/sellers"));
        const buyersSnap = await get(ref(db, "users/buyers"));
        const productsSnap = await get(ref(db, "products"));
        const transactionsSnap = await get(ref(db, "transactions"));

        let sellers = 0,
          buyers = 0,
          verified = 0,
          products = 0,
          transactions = 0;

        if (sellersSnap.exists()) {
          const sellersData = sellersSnap.val();
          sellers = Object.keys(sellersData).length;
          verified += Object.values(sellersData).filter((u) => u.verified === true).length;
        }

        if (buyersSnap.exists()) {
          const buyersData = buyersSnap.val();
          buyers = Object.keys(buyersData).length;
          verified += Object.values(buyersData).filter((u) => u.verified === true).length;
        }

        if (productsSnap.exists()) {
          const productsData = productsSnap.val();
          products = Object.keys(productsData).length;
        }

        if (transactionsSnap.exists()) {
          const transactionsData = transactionsSnap.val();
          transactions = Object.keys(transactionsData).length;
        }

        const totalUsers = sellers + buyers;

        setStats({
          totalUsers,
          sellers,
          buyers,
          verified,
          products,
          transactions,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex flex-col justify-center items-center px-6 py-24 relative overflow-hidden">
      <div className="max-w-6xl w-full text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
          IM-Expo in <span className="text-green-400">Numbers</span>
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Our growing verified network of exporters, buyers, and sellers reflects real success through trusted trade connections.
        </p>
      </div>

      {/* Stats Grid (Updated Compact Metric Style) */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto w-full">
        {/* Active Users */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300 shadow-lg text-left flex flex-col justify-between">
          <div>
            <h3 className="text-5xl font-extrabold text-green-400 mb-2">{stats.totalUsers}</h3>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Active Users</p>
          </div>
        </div>

        {/* Sellers */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300 shadow-lg text-left flex flex-col justify-between">
          <div>
            <h3 className="text-5xl font-extrabold text-green-400 mb-2">{stats.sellers}</h3>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Sellers</p>
          </div>
        </div>

        {/* Buyers */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300 shadow-lg text-left flex flex-col justify-between">
          <div>
            <h3 className="text-5xl font-extrabold text-green-400 mb-2">{stats.buyers}</h3>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Buyers</p>
          </div>
        </div>

        {/* Verified Members */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300 shadow-lg text-left flex flex-col justify-between">
          <div>
            <h3 className="text-5xl font-extrabold text-green-400 mb-2">{stats.verified}</h3>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Verified Members</p>
          </div>
        </div>

        {/* Products Published */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300 shadow-lg text-left flex flex-col justify-between">
          <div>
            <h3 className="text-5xl font-extrabold text-green-400 mb-2">{stats.products}</h3>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Products Published</p>
          </div>
        </div>

        {/* Completed Transactions */}
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 hover:border-green-500 transition duration-300 shadow-lg text-left flex flex-col justify-between">
          <div>
            <h3 className="text-5xl font-extrabold text-green-400 mb-2">{stats.transactions}</h3>
            <p className="text-gray-400 text-sm tracking-wide uppercase">Completed Transactions</p>
          </div>
        </div>
      </div>


      {/* CTA */}
      <div className="text-center mt-16">
        <HashLink
          smooth
          to="/resources#resource-grid"
          className="inline-block bg-green-500 text-white px-10 py-3 rounded-full font-semibold hover:bg-green-600 shadow-lg transition"
        >
          Explore Resources
        </HashLink>
      </div>
    </section>
  );
};


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
      {/* ✅ Global Chatbot Component (floating bottom-right) */}
      <ChatBot />
    </Router>
  );
};





// ---------------- Home Page ----------------
const HomePage = ({ currentUser }) => {
  return (
    <div className="font-roboto bg-gray-50 text-gray-800">
      <Header currentUser={currentUser} logout={() => signOut(auth)} />

      {/* Hero Section */}
      {/* Hero Section - Redesigned Professional Layout */}
      <section className="min-h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-16 py-24 bg-gradient-to-r from-green-500 to-cyan-500 text-white relative overflow-hidden">
        {/* Left: Content */}
        <div className="md:w-1/2 text-center md:text-left z-10 mt-[-50px]">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-7 drop-shadow-md">
            Showcase Your Talent. <br className="hidden md:block" />
            Connect With Verified Buyers.
          </h1>

          <p className="text-lg md:text-xl max-w-lg mb-10 text-gray-100">
            IM-Expo empowers skilled individuals and local sellers to reach
            global buyers — simplifying import/export connections through verified partnerships.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center md:justify-start mt-20">

            <HashLink
              smooth
              to={currentUser ? `/seller/${currentUser.uid}` : "/login"}
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-md transition"
            >
              Join as Seller
            </HashLink>

            <HashLink
              smooth
              to={currentUser ? `/buyer/${currentUser.uid}` : "/login"}
              className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 shadow-md transition"
            >
              Explore Products
            </HashLink>

            <HashLink
              smooth
              to="#features"
              className="border border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 shadow-md transition"
            >
              Learn More
            </HashLink>
          </div>
        </div>


        {/* Right: Animated Visual (Customizable) */}
        <div
          className="hidden md:flex md:w-1/2 justify-center relative"
          style={{
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* Animation 1 */}
          <Lottie
            animationData={require("./assets/animations/homegoods.json")}
            loop={true}
            className="absolute w-[720px] top-[-230px] right-[-20px]"
          />

          {/* Animation 2 */}
          <Lottie
            animationData={require("./assets/animations/spices.json")}
            loop={true}
            className="absolute w-[350px] bottom-[-320px] right-[480px]"
          />

          {/* Animation 3 */}
          <Lottie
            animationData={require("./assets/animations/eco.json")}
            loop={true}
            className="absolute w-[400px] bottom-[-360px] right-[200px]"
          />
        </div>



        {/* Decorative Circles */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
      </section>


      {/* Verified Member Section */}
      <section className="bg-white py-20 px-8 text-center border-t border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Want to Become an <span className="text-green-600">IM-Expo Verified</span> Member?
          </h2>

          <p className="text-gray-600 mb-10 max-w-3xl mx-auto">
            Join our verified network of trusted buyers and sellers. Earn your badge by completing successful transactions,
            building credibility, and unlocking premium benefits on IM-Expo.
          </p>

          {/* Verification Card */}
          <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white py-16 px-10 rounded-3xl shadow-lg hover:shadow-xl transition max-w-2xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Text */}
            <div className="md:w-2/3 text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-4">Show Your Verified Badge</h3>
              <p className="mb-6 text-white/90">
                Verified members stand out across the platform — enjoy more visibility, trusted connections, and exclusive opportunities.
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <HashLink
                  smooth
                  to="/subscriptions"
                  className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition"
                >
                  View Plans
                </HashLink>

                <HashLink
                  smooth
                  to="/resources#verification"
                  className="border border-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition"
                >
                  Learn More
                </HashLink>
              </div>
            </div>

            {/* Right: Badge Image */}
            <div className="flex justify-center md:justify-end md:w-1/3">
              <img
                src="/assets/badges/imexpo-verified-badge.png"
                alt="IM-Expo Verified Badge"
                className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-lg"

              />
            </div>
          </div>

        </div>
      </section>



      {/* 🌍 Why IM-Expo Section (Refined Alignment) */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why IM-Expo is <span className="text-green-400">Different</span>
          </h2>
          <p className="text-gray-400 max-w-3xl">
            We’re not just another trade platform — IM-Expo was built to empower small producers and create verified,
            trustworthy trade connections that actually build relationships — not just transactions.
          </p>
        </div>

        {/* Main Content Row */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Feature Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
              <h3 className="text-green-400 text-lg font-semibold mb-2">Verified Network</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every buyer and seller is verified. Trade only with real, trusted partners — no fakes or ghost accounts.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
              <h3 className="text-green-400 text-lg font-semibold mb-2">Direct Connections</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                No commissions, no agents. IM-Expo lets you communicate and trade directly — keeping profits in your hands.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
              <h3 className="text-green-400 text-lg font-semibold mb-2">Smart Matchmaking</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Our system connects local producers with importers actively seeking their type of products — intelligently and fairly.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition duration-300 shadow-lg hover:shadow-green-500/10">
              <h3 className="text-green-400 text-lg font-semibold mb-2">Empowered Trade</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We remove middlemen, simplify exports, and give local talent a fair platform to grow globally.
              </p>
            </div>
          </div>

          {/* Right: Lottie Animation */}
          <div className="relative flex justify-center items-center">
            <div className="bg-gradient-to-r from-green-500/20 to-cyan-500/20 absolute inset-0 rounded-3xl blur-3xl"></div>
            <Lottie
              animationData={null}
              path="/assets/animations/Earth-Connection.json"
              loop={true}
              autoplay={true}
              className="relative w-full max-w-md"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <HashLink
            smooth
            to="/resources#how-it-works"
            className="inline-block bg-green-500 text-white px-10 py-3 rounded-full font-semibold hover:bg-green-600 shadow-lg transition"
          >
            Discover How It Works
          </HashLink>
        </div>
      </section>


      <StatsSection />


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
