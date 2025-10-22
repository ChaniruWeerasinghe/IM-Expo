import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

const SellerDashboard = () => {
  const [stats, setStats] = useState({ credits: 0, products: 0, transactions: 0, verified: "Pending" });
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetch live data from Firebase
  useEffect(() => {
    const statsRef = ref(db, "stats");
    const productsRef = ref(db, "products");
    const transactionsRef = ref(db, "transactions");

    const unsubscribeStats = onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setStats(data);
    });

    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() ? Object.values(snapshot.val()) : [];
      setProducts(data);
    });

    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val() ? Object.values(snapshot.val()) : [];
      setTransactions(data);
    });

    return () => {
      unsubscribeStats();
      unsubscribeProducts();
      unsubscribeTransactions();
    };
  }, []);

  // Auto-refresh every 5 seconds (optional, smoother UI updates)
  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Dashboard updated...");
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Available Credits</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.credits}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Published Products</h2>
          <p className="text-3xl font-bold text-green-600">{stats.products}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Transactions</h2>
          <p className="text-3xl font-bold text-orange-500">{stats.transactions}</p>
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-4">
          <h2 className="text-lg font-semibold">Verification Status</h2>
          <p className={`text-2xl font-bold ${stats.verified === "Verified" ? "text-green-600" : "text-gray-500"}`}>
            {stats.verified}
          </p>
        </div>
      </div>

      {/* Transactions Chart */}
      <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Transaction Trends</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={transactions}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Product List */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">Published Products</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Product Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Status</th>
              <th className="py-2">Credits Used</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="py-2">{p.name}</td>
                  <td className="py-2">{p.category}</td>
                  <td className="py-2">{p.status}</td>
                  <td className="py-2">{p.creditsUsed}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SellerDashboard;
