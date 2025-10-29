// src/components/SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";

import { canActivateFreePlan } from "../utils/subscriptions";



import {
  ref,
  get,
  push,
  set,
  update,
  onValue,
  off,
  remove,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const SellerDashboard = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  // How many credits each plan gets per month
  const planMonthlyCredits = (plan, maxCredits) => {
    if (plan === "Free") return 1;
    if (plan === "Starter") return 5;
    if (plan === "Pro") {
      // Pro is adjustable 10–20; clamp just in case
      const n = Number(maxCredits) || 10;
      return Math.max(10, Math.min(n, 20));
    }
    return 1;
  };

  // Utility: whole days between two Date objects
  const daysBetween = (a, b) => Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));

  // If a paid plan hasn't been renewed within 30/37 days, update status.
  // Uses lastPaymentAt if present; otherwise falls back to lastReset (temporary proxy).
  const enforceSubscriptionStatus = async (uid, subRef, data) => {
    const now = new Date();
    // Free plan is always active in this model
    if (!data || data.plan === "Free") return;

    const anchorISO = data.lastPaymentAt || data.lastReset; // TODO: set lastPaymentAt in your Subscriptions flow
    if (!anchorISO) return;

    const anchor = new Date(anchorISO);
    const d = daysBetween(now, anchor);

    let newStatus = data.status || "active";
    if (d >= 37) newStatus = "deactivated";
    else if (d >= 30) newStatus = "suspended";
    else newStatus = "active";

    if (newStatus !== data.status) {
      await update(subRef, { status: newStatus, statusCheckedAt: now.toISOString() });
    }
  };


  const checkAndResetCredits = async (uid) => {
    const subRef = ref(db, `subscriptions/sellers/${uid}`);
    const snap = await get(subRef);
    if (!snap.exists()) return;

    const data = snap.val();
    const now = new Date();
    const last = data.lastReset ? new Date(data.lastReset) : null;

    const monthChanged =
      !last ||
      now.getFullYear() !== last.getFullYear() ||
      now.getMonth() !== last.getMonth();

    const normalizedMax = planMonthlyCredits(data.plan, data.maxCredits);

    if (monthChanged) {
      await update(subRef, {
        credits: normalizedMax,          // reset to plan amount (no carry)
        maxCredits: normalizedMax,       // keep max in sync with plan
        lastReset: now.toISOString(),
      });
    } else if (data.maxCredits !== normalizedMax) {
      // keep maxCredits synced even mid-cycle (no credit carry-up)
      await update(subRef, { maxCredits: normalizedMax });
    }
  };




  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [sellerInfo, setSellerInfo] = useState({ name: "Seller Name", email: "" });
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, pendingOrders: 0 });

  const [subscription, setSubscription] = useState(null);
  const [orderRequests, setOrderRequests] = useState([]);

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Try again.");
    }
  };



  // Main data fetch
  useEffect(() => {
    if (!uid) return;
    checkAndResetCredits(uid);


    const sellerRef = ref(db, `users/sellers/${uid}`);
    const subRef = ref(db, `subscriptions/sellers/${uid}`);
    const productsQuery = query(ref(db, "products"), orderByChild("sellerUID"), equalTo(uid));
    const transQuery = query(ref(db, "transactions"), orderByChild("sellerUID"), equalTo(uid));
    const ordersQuery = query(ref(db, "orderRequests"), orderByChild("sellerUID"), equalTo(uid));

    // Seller info
    onValue(sellerRef, (snapshot) => {
      const data = snapshot.val();
      if (data)
        setSellerInfo({
          name: data.name || "Seller Name",
          email: data.email || "",
          company: data.company || "",
        });
    });

    // Subscription
    onValue(subRef, async (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Clamp credits to the plan cap
        const planCap = planMonthlyCredits(data.plan, data.maxCredits);
        if (typeof data.credits === "number" && data.credits > planCap) {
          await update(subRef, { credits: planCap });
          // Use clamped data for status checks
          await enforceSubscriptionStatus(uid, subRef, { ...data, credits: planCap });
          setSubscription({ ...data, credits: planCap });
        } else {
          await enforceSubscriptionStatus(uid, subRef, data);
          setSubscription(data);
        }
      } else {
        // First-time seller: create Free plan
        const init = {
          plan: "Free",
          status: "active",
          maxCredits: 1,
          credits: 1,
          lastReset: new Date().toISOString(),
          // lastPaymentAt is not needed for Free; paid plans should set it on purchase/renewal
        };
        await set(subRef, init);
        setSubscription(init);
      }
    });






    // Products
    onValue(productsQuery, (snapshot) => {
      const data = snapshot.val() || {};
      const sellerProducts = Object.entries(data).map(([key, p]) => ({ ...p, id: key }));
      setProducts(sellerProducts);
      setStats((prev) => ({ ...prev, totalProducts: sellerProducts.length }));
    });

    // Transactions
    onValue(transQuery, (snapshot) => {
      const data = snapshot.val() || {};
      const sellerTx = Object.values(data);
      setTransactions(sellerTx);

      // ✅ Only count approved transactions, using quantity × price
      const approvedTx = sellerTx.filter((t) => t.status === "Approved");

      // Calculate total earnings based on approved items and quantity
      const totalSales = approvedTx.reduce(
        (sum, t) => sum + Number(t.price || 0) * Number(t.quantity || 1),
        0
      );

      const pendingOrders = sellerTx.filter((t) => t.status === "Pending").length;

      setStats((prev) => ({ ...prev, totalSales, pendingOrders }));


    });


    // Orders
    onValue(ordersQuery, (snapshot) => {
      const data = snapshot.val() || {};
      const requests = Object.entries(data).map(([id, req]) => ({ id, ...req }));
      setOrderRequests(requests);
    });

    // Cleanup
    return () => {
      off(sellerRef);
      off(subRef);
      off(productsQuery);
      off(transQuery);
      off(ordersQuery);
    };
  }, [uid]);

  // Chart data
  const salesData = transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((t) => ({ date: t.date, amount: Number(t.amount) }));

  const categoryCount = {};
  products.forEach((p) => {
    categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa"];

  // Edit modal handlers
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditData(product);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveChanges = async () => {
    if (!selectedProduct) return;
    try {
      const productRef = ref(db, `products/${selectedProduct.id}`);
      await update(productRef, editData);
      setSelectedProduct(null);
      alert("✅ Product updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update product.");
    }
  };
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const productRef = ref(db, `products/${selectedProduct.id}`);
        await remove(productRef);
        setSelectedProduct(null);
        alert("✅ Product deleted successfully!");
      } catch (error) {
        console.error(error);
        alert("❌ Failed to delete product.");
      }
    }
  };

  // Orders approve/reject
  const handleRequestUpdate = async (requestId, newStatus) => {
    try {
      const reqRef = ref(db, `orderRequests/${requestId}`);
      await update(reqRef, { status: newStatus });

      const request = orderRequests.find((r) => r.id === requestId);
      if (request) {
        const transQuery = query(
          ref(db, "transactions"),
          orderByChild("productId"),
          equalTo(request.productId)
        );
        onValue(
          transQuery,
          async (snapshot) => {
            const data = snapshot.val() || {};
            for (let [txId, tx] of Object.entries(data)) {
              if (tx.buyerUID === request.buyerUID && tx.status === "Pending") {
                await update(ref(db, `transactions/${txId}`), { status: newStatus });
              }
            }
          },
          { onlyOnce: true }
        );
      }

      alert(`Order ${newStatus}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update order status.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">


      {/* Sidebar (Same as Buyer Dashboard) */}
      <div className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col justify-between shadow-md">
        <div>
          {/* Header / Logo */}
          <div className="flex items-center justify-center py-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-green-600">IM-Expo</h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col mt-6 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <i className="fas fa-home text-green-500"></i>
              <span>Main Dashboard</span>
            </Link>

            <Link
              to={`/seller/${uid}`}
              className="flex items-center gap-3 px-6 py-3 bg-green-50 text-green-600 border-l-4 border-green-500 transition"
            >
              <i className="fas fa-chart-line text-green-500"></i>
              <span>Seller Dashboard</span>
            </Link>

            <Link
              to={`/seller/${uid}/add-products`}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <i className="fas fa-plus-circle text-green-500"></i>
              <span>Add Products</span>
            </Link>

            <button
              onClick={() => navigate("/seller-transactions")}
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition w-full text-left"
            >
              <i className="fas fa-receipt text-green-500"></i>
              <span>Transactions</span>
            </button>




            <Link
              to="/portfolio"
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
            >
              <i className="fas fa-briefcase text-green-500"></i>
              <span>Portfolio</span>
            </Link>
          </nav>
        </div>

        {/* Logout */}
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

        {/* Seller Info + Subscription */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {sellerInfo.name.charAt(0)}
          </div>

          <div className="flex flex-col gap-1 text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{sellerInfo.name}</h2>

            {sellerInfo.company && (
              <p className="text-gray-500 italic font-medium">{sellerInfo.company}</p>
            )}

            <p className="text-gray-600 font-normal">{sellerInfo.email}</p>

            {subscription && (
              <div className="mt-2 bg-green-50 border border-green-200 p-3 rounded-md text-sm">
                <p>
                  <strong>Plan:</strong> {subscription.plan}
                </p>
                <p>
                  <strong>Credits Left:</strong> {subscription.credits} / {subscription.maxCredits}

                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${subscription.status === "active"
                      ? "text-green-600"
                      : "text-red-500"
                      }`}
                  >
                    {subscription.status}
                  </span>
                </p>

                {/* 🔽 Added Upgrade Plan Button Here */}
                {subscription.credits <= 0 && (
                  <button
                    onClick={async () => {
                      const subSnap = await get(ref(db, `subscriptions/sellers/${uid}`));
                      const subData = subSnap.exists() ? subSnap.val() : {};
                      const lastActivated = subData?.lastFreePlanActivated;

                      // 🔒 Prevent reactivation if last Free plan was within 30 days
                      if (subscription.plan === "Free" && !canActivateFreePlan(lastActivated)) {
                        alert("⚠️ You can only activate the Free plan once every 30 days.");
                        return;
                      }

                      navigate(`/subscriptions?seller=${uid}`);
                    }}
                    className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow"
                  >
                    Upgrade Plan
                  </button>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          {subscription?.status === "suspended" && (
            <div className="mb-4 rounded-lg border border-yellow-300 bg-yellow-50 p-3 text-yellow-800">
              Your plan is <b>suspended</b>. Renew your subscription to resume publishing.
            </div>
          )}
          {subscription?.status === "deactivated" && (
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 p-3 text-red-800">
              Your plan is <b>deactivated</b>. Reactivate your subscription to regain access.
            </div>
          )}

          <button
            onClick={() => navigate(`/seller/${uid}/add-products`)}
            disabled={subscription?.credits <= 0 || subscription?.status !== "active"}
            className={`px-6 py-2 rounded-lg shadow font-semibold ${subscription?.credits <= 0 || subscription?.status !== "active"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
          >
            ➕ Add Product
          </button>



        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-gray-600 font-semibold">Total Products</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-gray-600 font-semibold">Total Sales</h3>
            <p className="text-3xl font-bold text-blue-600">${stats.totalSales.toFixed(2)}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow hover:shadow-md transition">
            <h3 className="text-gray-600 font-semibold">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-500">{stats.pendingOrders}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-700 font-semibold mb-2">Sales Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-700 font-semibold mb-2">Products by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={categoryData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Published Products</h2>
          {products.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((p) => (
                <div
                  key={p.id}
                  onClick={() => openEditModal(p)}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden cursor-pointer"
                >
                  <img
                    src={p.image || "https://via.placeholder.com/300"}
                    alt={p.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">{p.name}</h3>
                    <p className="text-sm text-gray-500">{p.category}</p>
                    <p className="mt-2 font-semibold text-gray-700">${p.price}</p>
                    <p className="text-sm text-gray-400 mt-1">Stock: {p.stock || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No products published yet.</p>
          )}
        </div>

        {/* Seller Order Requests */}
        {orderRequests.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Order Requests</h2>
            <div className="grid gap-4">
              {orderRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
                >
                  <div>
                    <p className="text-gray-800 font-semibold">Product: {req.productName}</p>
                    <p className="text-gray-600 text-sm">Buyer: {req.buyerName}</p>
                    <p className="text-gray-600 text-sm">Quantity: {req.quantity}</p>
                    <p className="text-gray-600 text-sm">Status: {req.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {req.status === "Pending" && (
                      <>
                        <button
                          onClick={() => handleRequestUpdate(req.id, "Approved")}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequestUpdate(req.id, "Rejected")}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {selectedProduct && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white rounded-xl p-6 w-96 shadow-lg relative">
              <h2 className="text-2xl font-semibold mb-4 text-green-600">Edit Product</h2>

              <label className="block mb-2 text-sm font-semibold text-gray-600">Name</label>
              <input
                name="name"
                value={editData.name || ""}
                onChange={handleEditChange}
                className="w-full border rounded-lg p-2 mb-3"
              />

              <label className="block mb-2 text-sm font-semibold text-gray-600">Price</label>
              <input
                name="price"
                type="number"
                value={editData.price || ""}
                onChange={handleEditChange}
                className="w-full border rounded-lg p-2 mb-3"
              />

              <label className="block mb-2 text-sm font-semibold text-gray-600">Category</label>
              <input
                name="category"
                value={editData.category || ""}
                onChange={handleEditChange}
                className="w-full border rounded-lg p-2 mb-3"
              />

              <label className="block mb-2 text-sm font-semibold text-gray-600">Stock</label>
              <input
                name="stock"
                type="number"
                value={editData.stock || ""}
                onChange={handleEditChange}
                className="w-full border rounded-lg p-2 mb-5"
              />

              <div className="flex justify-between gap-2">
                <button
                  onClick={handleSaveChanges}
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteProduct}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
