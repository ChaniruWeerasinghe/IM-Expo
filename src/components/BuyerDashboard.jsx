import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";

const BuyerDashboard = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [transactions, setTransactions] = useState([]);

  // Fetch data once UID is available
  useEffect(() => {
    if (!uid) return;

    const productsRef = ref(db, "products");
    const transRef = ref(db, "transactions");

    const unsubProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data);
      setProducts(list);
      setFiltered(list);
    });

    const unsubTransactions = onValue(transRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter((t) => t.buyerId === uid);
      setTransactions(list);
    });

    setLoading(false);

    return () => {
      off(productsRef);
      off(transRef);
    };
  }, [uid]);

  // Filtering logic (always runs in same render)
  useEffect(() => {
    const result = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(search.toLowerCase()) &&
        (category === "All" || p.category === category)
    );
    setFiltered(result);
  }, [search, category, products]);

  if (loading) return <p className="p-6 text-gray-700">Loading dashboard...</p>;

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-green-600">Buyer Dashboard</h1>

      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-3 w-64 rounded-lg border border-gray-300"
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
      </div>

      {/* Product Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length > 0 ? (
          filtered.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden"
            >
              <img
                src={p.image || "https://via.placeholder.com/300"}
                alt={p.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-green-600">{p.name}</h3>
                <p className="text-sm text-gray-600">{p.category}</p>
                <p className="mt-2 font-semibold">${p.price}</p>
                <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition">
                  Contact Seller
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found.</p>
        )}
      </div>

      {/* Transactions */}
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
        ) : (
          <p className="text-gray-500">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
