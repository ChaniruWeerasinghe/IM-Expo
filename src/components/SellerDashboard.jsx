// src/components/SellerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import {
  ref,
  onValue,
  off,
  update,
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

  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editData, setEditData] = useState({});
  const [sellerInfo, setSellerInfo] = useState({ name: "Seller Name", email: "" });
  const [stats, setStats] = useState({ totalProducts: 0, totalSales: 0, pendingOrders: 0 });
  const [collapsed, setCollapsed] = useState(false);
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
    onValue(subRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSubscription(data);
      } else {
        setSubscription({
          plan: "Free",
          credits: 0,
          maxFreeCredits: 5,
          status: "inactive",
        });
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

      const totalSales = sellerTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
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
      {/* Sidebar */}
      <div
        className={`bg-white shadow-md h-screen fixed right-0 top-0 flex flex-col justify-start transition-all duration-300 ${
          collapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="flex flex-col items-center mt-2">
          <button
            className="p-3 text-gray-700 hover:text-green-500"
            onClick={() => navigate("/")}
            title="Home"
          >
            🏠
          </button>
          <button
            className="mt-2 p-3 text-gray-700 hover:text-green-500"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? "☰" : "✕"}
          </button>
        </div>

        <nav className="flex flex-col mt-6 space-y-2 items-center flex-1">
          {[
            { icon: "📊", name: "Dashboard", link: `/seller/${uid}` },
            { icon: "➕", name: "Add Products", link: `/seller/${uid}/add-products` },
            { icon: "💰", name: "Transactions", link: "/transactions" },
            { icon: "🗂", name: "Portfolio", link: "/portfolio" },
          ].map((item) => (
            <Link
              key={item.name}
              to={item.link}
              className="group relative flex items-center w-full px-4 py-3 text-gray-700 hover:bg-green-100 rounded transition"
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="ml-3 font-medium">{item.name}</span>}
            </Link>
          ))}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-red-100 rounded mt-auto"
          >
            <span className="text-xl">🚪</span>
            {!collapsed && <span className="ml-3 font-medium text-red-600">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 mr-0 md:mr-64">
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
          <strong>Credits Left:</strong> {subscription.credits} /{" "}
          {subscription.maxFreeCredits}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`font-semibold ${
              subscription.status === "active"
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
            onClick={() => navigate(`/subscriptions?seller=${uid}`)}
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
          <button
            onClick={() => navigate(`/seller/${uid}/add-products`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg shadow"
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
