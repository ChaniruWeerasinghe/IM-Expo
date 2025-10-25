// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { db, auth } from "./firebase"; // make sure auth is exported from firebase.js
import { ref, onValue, get } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { HashLink } from "react-router-hash-link";
import { useParams } from "react-router-dom";

// Pages & Components
import Transactions from "./components/Transactions";
import AddProducts from "./pages/AddProducts";
import Resources from "./pages/Resources/Resources";
import Portfolio from "./components/Portfolio";
import ProtectedRoute from "./components/ProtectedRoute";


// Login & Signup
import Login from "./components/Login";
import Signup from "./components/Signup";

// Header & Footer
import Header from "./components/Header";
import Footer from "./components/Footer";




// ---------------- Seller Dashboard ----------------
const SellerDashboard = () => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ credits: 0, products: 0, transactions: 0, verified: "Pending" });
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  // Always call hooks first
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const statsRef = ref(db, `stats/${user.uid}`);
    const productsRef = ref(db, "products");
    const transactionsRef = ref(db, "transactions");

    onValue(statsRef, (snapshot) => setStats(snapshot.val() || { credits: 0, products: 0, transactions: 0, verified: "Pending" }));

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data).filter((p) => p.sellerId === user.uid);
        setProducts(list);
      }
    });

    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const sellerTransactions = Object.values(data).filter((t) => t.sellerId === user.uid);
        setTransactions(sellerTransactions);
      }
    });
  }, [user]);

  // Now return UI after hooks
  if (user === null) return <p className="p-6 text-gray-700">Loading dashboard...</p>;
  if (!user) return <p className="p-6 text-gray-700">Please log in to view your dashboard.</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Credits</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.credits}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="text-3xl font-bold text-green-600">{stats.products}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.transactions}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Verified</h2>
          <p className={`text-2xl font-bold ${stats.verified === "Verified" ? "text-green-600" : "text-gray-500"}`}>
            {stats.verified}
          </p>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-end mb-4">
        <Link
          to="/add-products"
          className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition"
        >
          + Add New Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Published Products</h2>
        {products.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Name</th>
                <th className="py-2">Category</th>
                <th className="py-2">Status</th>
                <th className="py-2">Credits</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.category}</td>
                  <td className="py-2">{p.status}</td>
                  <td className="py-2">{p.creditsUsed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-gray-500">No products yet.</p>}
      </div>

      {/* Transactions Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        {transactions.length > 0 ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">Product</th>
                <th className="py-2">Amount</th>
                <th className="py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{t.product}</td>
                  <td className="py-2">${t.amount}</td>
                  <td className="py-2">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-gray-500">No transactions yet.</p>}
      </div>
    </div>
  );
};




// ---------------- Buyer Dashboard ----------------
const BuyerDashboard = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [transactions, setTransactions] = useState([]);

  // Always call hooks first
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const productsRef = ref(db, "products");
    const transRef = ref(db, "transactions");

    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setProducts(list);
        setFiltered(list);
      }
    });

    onValue(transRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const buyerTransactions = Object.values(data).filter((t) => t.buyerId === user.uid);
        setTransactions(buyerTransactions);
      }
    });
  }, [user]);

  useEffect(() => {
    let result = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter((p) => p.category === category);
    setFiltered(result);
  }, [search, category, products]);

  // Now safe to conditionally render
  if (user === null) return <p className="p-6 text-gray-700">Loading dashboard...</p>;
  if (!user) return <p className="p-6 text-gray-700">Please log in to view products and transactions.</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Buyer Dashboard</h1>

      {/* Search & Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 w-64 rounded-lg border border-gray-300"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-3 rounded-lg border border-gray-300">
          <option>All</option>
          <option>Handmade</option>
          <option>Art</option>
          <option>Food</option>
          <option>Clothing</option>
        </select>
      </div>

      {/* Products */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? filtered.map((p, i) => (
          <div key={i} className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden">
            <img src={p.image || "https://via.placeholder.com/300"} alt={p.name} className="w-full h-48 object-cover"/>
            <div className="p-4">
              <h3 className="text-lg font-bold text-green-600">{p.name}</h3>
              <p className="text-sm text-gray-600">{p.category}</p>
              <p className="mt-2 font-semibold">${p.price}</p>
              <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">Contact Seller</button>
            </div>
          </div>
        )) : <p className="text-gray-500">No products found.</p>}
      </div>

      {/* Transaction History */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Transactions</h2>
        {transactions.length > 0 ? (
          <table className="min-w-full bg-white rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-3 border-b">Product</th>
                <th className="p-3 border-b">Amount</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{t.product}</td>
                  <td className="p-3 border-b">${t.amount}</td>
                  <td className="p-3 border-b">{t.status}</td>
                  <td className="p-3 border-b">{t.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className="text-gray-500">No transactions yet.</p>}
      </div>
    </div>
  );
};




// ---------------- Home Page ----------------
const HomePage = () => {
  return (
    <div className="font-roboto bg-gray-50 text-gray-800">
      <Header />

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
          <Link to="/signup" className="bg-white text-green-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition">Get Started</Link>
          <Link to="/buyer" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition">Explore Products</Link>
          <Link to="#features" className="bg-white text-green-500 px-6 py-3 rounded-lg hover:bg-gray-100 transition">Learn More</Link>
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

      {/* 🌍 Why IM-Expo Section */}
      <section className="bg-white py-20 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
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

// ---------------- App ----------------
const App = () => {
  return (
    <Router>
 <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* UID-based dashboards */}
        <Route path="/seller/:uid" element={<SellerDashboard />} />
<Route path="/buyer/:uid" element={<BuyerDashboard />} />

        {/* Other pages */}
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/add-products" element={<AddProducts />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/portfolio" element={<Portfolio />} />
      </Routes>

</Router>

  );
};

export default App;
