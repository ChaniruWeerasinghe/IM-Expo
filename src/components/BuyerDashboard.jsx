import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const BuyerDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [location, setLocation] = useState("All");
  const [transactions, setTransactions] = useState([]);

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.values(data);
        setProducts(productList);
        setFiltered(productList);
      }
    });

    const transRef = ref(db, "transactions");
    onValue(transRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setTransactions(Object.values(data));
      }
    });

    return () => unsubscribe();
  }, []);

  // Filter products
  useEffect(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    if (category !== "All") result = result.filter((p) => p.category === category);
    if (location !== "All") result = result.filter((p) => p.location === location);

    setFiltered(result);
  }, [search, category, location, products]);

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Buyer Dashboard</h1>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-8 items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="p-3 w-64 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 rounded-lg border border-gray-300"
        >
          <option>All</option>
          <option>Handmade</option>
          <option>Art</option>
          <option>Food</option>
          <option>Clothing</option>
        </select>
        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="p-3 rounded-lg border border-gray-300"
        >
          <option>All</option>
          <option>Colombo</option>
          <option>Kandy</option>
          <option>Galle</option>
        </select>
      </div>

      {/* Product List */}
      <h2 className="text-2xl font-semibold mb-4">Browse Products</h2>
      {filtered.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="rounded-xl shadow-md hover:shadow-lg transition">
                <img
                  src={p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded-t-xl"
                />
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-green-600">{p.name}</h3>
                  <p className="text-sm text-gray-600">{p.category} • {p.location}</p>
                  <p className="mt-2 font-semibold">${p.price}</p>
                  <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                    Contact Seller
                  </button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}

      {/* Transaction History */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Your Transactions</h2>
        <div className="bg-white p-6 rounded-xl shadow-md overflow-x-auto">
          {transactions.length > 0 ? (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-3 border-b">{t.product}</td>
                    <td className="p-3 border-b">${t.amount}</td>
                    <td className="p-3 border-b">{t.status}</td>
                    <td className="p-3 border-b">{t.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No transactions yet.</p>
          )}
        </div>
      </div>

      {/* Subscription Management */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4">Subscription & Verification</h2>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <p className="text-gray-700 mb-4">
            Upgrade your plan or verify your account for more features.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="bg-green-500 text-white px-5 py-3 rounded-full hover:bg-green-600">
              Upgrade Plan
            </button>
            <button className="bg-blue-500 text-white px-5 py-3 rounded-full hover:bg-blue-600">
              Verify Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;
