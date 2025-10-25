import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { ref, onValue, off } from "firebase/database";

const SellerDashboard = () => {
  const { uid } = useParams();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    credits: 0,
    products: 0,
    transactions: 0,
    verified: "Pending",
  });
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const statsRef = ref(db, `stats/${uid}`);
    const productsRef = ref(db, "products");
    const transactionsRef = ref(db, "transactions");

    const unsubStats = onValue(statsRef, (snapshot) => {
      setStats(snapshot.val() || {
        credits: 0,
        products: 0,
        transactions: 0,
        verified: "Pending",
      });
    });

    const unsubProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter((p) => p.sellerId === uid);
      setProducts(list);
    });

    const unsubTransactions = onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.values(data).filter((t) => t.sellerId === uid);
      setTransactions(list);
    });

    setLoading(false);

    // Cleanup
    return () => {
      off(statsRef);
      off(productsRef);
      off(transactionsRef);
    };
  }, [uid]);

  if (loading) return <p className="p-6 text-gray-700">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Dashboard</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Credits", value: stats.credits, color: "text-blue-600" },
          { label: "Products", value: stats.products, color: "text-green-600" },
          { label: "Transactions", value: stats.transactions, color: "text-orange-500" },
          {
            label: "Verified",
            value: stats.verified,
            color: stats.verified === "Verified" ? "text-green-600" : "text-gray-500",
          },
        ].map((item, i) => (
          <div key={i} className="bg-white shadow-lg rounded-2xl p-4">
            <h2 className="text-lg font-semibold">{item.label}</h2>
            <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Add Product */}
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
        ) : (
          <p className="text-gray-500">No products yet.</p>
        )}
      </div>

      {/* Transactions */}
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
        ) : (
          <p className="text-gray-500">No transactions yet.</p>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
