// src/components/SellerTransactions.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import { jsPDF } from "jspdf";
import { signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";

const SellerTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [user, setUser] = useState(null);
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 🔐 Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // 👤 Listen for Auth State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u || null);
    });
    return () => unsubscribe();
  }, []);

  // 📦 Fetch Seller Transactions
  useEffect(() => {
    if (!user) return;
    const transRef = ref(db, "transactions");
    onValue(transRef, (snapshot) => {
      const data = snapshot.val() || {};
      const sellerTx = Object.values(data).filter(
        (t) => t.sellerUID === user.uid
      );
      setTransactions(sellerTx);
      setLoading(false);
    });
  }, [user]);

  // 🎯 Filter Transactions
  useEffect(() => {
    if (filter === "All") setFilteredTransactions(transactions);
    else setFilteredTransactions(transactions.filter((t) => t.status === filter));
  }, [filter, transactions]);

  // 🧾 Generate Invoice
  const downloadInvoice = (t) => {
    const doc = new jsPDF();
    const left = 20;
    let y = 20;

    doc.setFontSize(18);
    doc.text("IM-Expo", left, y);
    doc.setFontSize(14);
    doc.text("Seller Transaction Invoice", 130, y);
    y += 10;

    doc.line(20, y, 190, y);
    y += 10;

    doc.setFontSize(12);
    doc.text(`Seller Name: ${t.sellerName || "N/A"}`, left, y);
    doc.text(`Buyer: ${t.buyerName || "N/A"}`, 150, y);
    y += 10;

    doc.text(`Product: ${t.productName}`, left, y);
    doc.text(`Category: ${t.productCategory || "Uncategorized"}`, 150, y);
    y += 10;

    doc.text(`Price: $${t.price.toFixed(2)}`, left, y);
    doc.text(`Quantity: ${t.quantity}`, 150, y);
    y += 10;

    doc.text(`Total Earned: $${t.amount.toFixed(2)}`, left, y);
    y += 10;

    doc.text(`Status: ${t.status}`, left, y);
    doc.text(`Date: ${new Date(t.date).toLocaleString()}`, 150, y);
    y += 15;

    doc.text("Thank you for using IM-Expo!", left, y);
    doc.save(`IM-Expo_SellerInvoice_${t.productName}_${t.date}.pdf`);
  };

  // 📊 Stats
  const approvedTx = transactions.filter((t) => t.status === "Approved");
  const totalEarnings = approvedTx.reduce(
    (sum, t) => sum + Number(t.amount || 0),
    0
  );
  const pendingCount = transactions.filter((t) => t.status === "Pending").length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading seller transactions...
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen w-full overflow-hidden">
      {/* Sidebar (Seller Navigation) */}
      <div className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col justify-between shadow-md">
        <div>
          <div className="flex items-center justify-center py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-green-600">IM-Expo</h2>
          </div>

          <nav className="flex flex-col mt-6 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <i className="fas fa-home text-green-500"></i>
              <span>Main Dashboard</span>
            </Link>

            <Link
              to={`/seller/${user?.uid || ""}`}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <i className="fas fa-user-tie text-green-500"></i>
              <span>Seller Dashboard</span>
            </Link>

            <Link
              to="/seller-transactions"
              className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-600 border-l-4 border-green-500 transition"
            >
              <i className="fas fa-receipt text-green-500"></i>
              <span>Transactions</span>
            </Link>

            <Link
              to="/portfolio"
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <i className="fas fa-briefcase text-green-500"></i>
              <span>Portfolio</span>
            </Link>
          </nav>
        </div>

        <div className="border-t border-gray-200 py-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-6 py-3 w-full text-red-500 hover:bg-red-50 transition"
          >
            <i className="fas fa-sign-out-alt"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 ml-64">
        <h2 className="text-4xl font-bold text-gray-800 mb-2 text-center">
          Seller Transactions / Sales History
        </h2>
        <p className="text-gray-500 text-center mb-10">
          {transactions.length} total — {approvedTx.length} completed, {pendingCount} pending
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <div className="bg-white shadow-md rounded-2xl p-6 border-t-4 border-green-500 text-center">
            <h3 className="text-gray-600 text-sm font-semibold">Total Earnings</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">
              ${totalEarnings.toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border-t-4 border-blue-500 text-center">
            <h3 className="text-gray-600 text-sm font-semibold">Total Sales</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">{transactions.length}</p>
          </div>

          <div className="bg-white shadow-md rounded-2xl p-6 border-t-4 border-orange-500 text-center">
            <h3 className="text-gray-600 text-sm font-semibold">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-500 mt-2">{pendingCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between mb-6">
          <div className="flex gap-3 mb-3 sm:mb-0">
            {["All", "Approved", "Pending", "Rejected"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${filter === type
                    ? "bg-green-600 text-white shadow"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        {filteredTransactions.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-2xl shadow-lg">
            <table className="min-w-full text-left border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-gray-700">Product</th>
                  <th className="p-4 font-semibold text-gray-700">Buyer</th>
                  <th className="p-4 font-semibold text-gray-700">Quantity</th>
                  <th className="p-4 font-semibold text-gray-700">Amount</th>
                  <th className="p-4 font-semibold text-gray-700">Status</th>
                  <th className="p-4 font-semibold text-gray-700">Date</th>
                  <th className="p-4 font-semibold text-gray-700">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map((t, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelected(t)}
                  >
                    <td className="p-4 font-medium text-gray-800">{t.productName}</td>
                    <td className="p-4 text-gray-600">{t.buyerName || "N/A"}</td>
                    <td className="p-4 text-gray-600">{t.quantity || 1}</td>
                    <td className="p-4 text-gray-600">${t.amount.toFixed(2)}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${t.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : t.status === "Pending"
                              ? "bg-orange-100 text-orange-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(t.date).toLocaleString()}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadInvoice(t);
                        }}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm"
                      >
                        View / Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            No seller transactions found.
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerTransactions;
