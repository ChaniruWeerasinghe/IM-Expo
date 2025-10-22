// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import Portfolio from "./components/Portfolio";
import Transactions from "./components/Transactions";



// ---------------- Seller Dashboard ----------------
const SellerDashboard = () => {
  const [stats, setStats] = useState({ credits: 0, products: 0, transactions: 0, verified: "Pending" });
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const statsRef = ref(db, "stats");
    const productsRef = ref(db, "products");
    const transactionsRef = ref(db, "transactions");

    onValue(statsRef, (snapshot) => setStats(snapshot.val() || stats));
    onValue(productsRef, (snapshot) => setProducts(snapshot.val() ? Object.values(snapshot.val()) : []));
    onValue(transactionsRef, (snapshot) => setTransactions(snapshot.val() ? Object.values(snapshot.val()) : []));
  }, []);

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
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
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
      if (data) setTransactions(Object.values(data));
    });
  }, []);

  useEffect(() => {
    let result = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== "All") result = result.filter((p) => p.category === category);
    setFiltered(result);
  }, [search, category, products]);

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

      {/* Subscription */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Subscription & Verification</h2>
        <p className="text-gray-700 mb-4">Upgrade your plan or verify your account for more features.</p>
        <div className="flex flex-wrap gap-4">
          <button className="bg-green-500 text-white px-5 py-3 rounded-full hover:bg-green-600">Upgrade Plan</button>
          <button className="bg-blue-500 text-white px-5 py-3 rounded-full hover:bg-blue-600">Verify Account</button>
        </div>
      </div>
    </div>
  );
};

// ---------------- Home Page ----------------
const HomePage = () => {
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
          <Link to="/seller" className="ml-6 font-medium hover:text-purple-500">Seller</Link>
          <Link to="/buyer" className="ml-6 font-medium hover:text-indigo-500">Buyer</Link>

          
        </nav>
      </header>

    <section className="flex flex-col items-center text-center py-24 px-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white">
  <h2 className="text-4xl md:text-5xl mb-4 font-bold">
    Showcase Your Talent. Connect With Verified Buyers.
  </h2>
  <p className="text-lg md:text-xl mb-8 max-w-xl">
    IM-Expo helps talented individuals and local sellers display their work while connecting with buyers and import/export partners.
  </p>


    {/* Hero Section */}

  <div className="flex flex-wrap gap-4 justify-center">
    <a href="#signup" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
      Get Started
    </a>
    <a href="#products" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
      Explore Products
    </a>
    <a href="#features" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
      Learn More
    </a>
    <Link to="/seller" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
      Seller Dashboard
    </Link>
    <Link to="/buyer" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
      Buyer Dashboard
    </Link>
    <Link to="/portfolio" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
      Portfolio
    </Link>
    <Link to="/transactions" className="bg-white text-green-500 font-semibold px-8 py-3 rounded-full hover:bg-green-500 hover:text-white transition">
  Transactions
</Link>

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
          {/* Product Cards */}
          <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition">
            <img src="https://via.placeholder.com/300x180" alt="Product 1" className="w-full h-44 object-cover"/>
            <div className="p-4">
              <h4 className="text-green-500 mb-1">Handmade Jewelry</h4>
              <p className="text-gray-600 text-sm">By talented local seller</p>
            </div>
          </div>
          {/* Add more products as needed */}
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


// ---------------- App ----------------
const App = () => {
  return (
    <Router>
<Routes>
  <Route path="/" element={<HomePage />} />
  <Route path="/seller" element={<SellerDashboard />} />
  <Route path="/buyer" element={<BuyerDashboard />} />
  <Route path="/portfolio" element={<Portfolio />} />
<Route path="/transactions" element={<Transactions />} />
</Routes>
    </Router>
  );
};

export default App;
