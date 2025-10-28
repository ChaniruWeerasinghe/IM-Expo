// src/components/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { ref, onValue, off, push, set, update, remove } from "firebase/database";
import { signOut } from "firebase/auth";
import "./OrderButton.css";

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

const BuyerDashboard = () => {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [buyerInfo, setBuyerInfo] = useState({ name: "Buyer Name", email: "", company: "" });
  const [transactions, setTransactions] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, totalOrders: 0, pending: 0 });
  const [collapsed, setCollapsed] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // 🔹 Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Failed to log out. Try again.");
    }
  };

  // 🔹 Fetch buyer info, transactions, and cart items
  useEffect(() => {
    if (!uid) return;

    const buyerRef = ref(db, `users/buyers/${uid}`);
    const transRef = ref(db, "transactions");
    const cartRef = ref(db, `carts/${uid}`);

    // ✅ Fetch Buyer Info
    onValue(buyerRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setBuyerInfo({
          name: data.name || "Buyer Name",
          email: data.email || "",
          company: data.company || "",
        });
      }
    });

    // ✅ Fetch Transactions
    onValue(transRef, (snapshot) => {
      const data = snapshot.val() || {};
      const buyerTx = Object.values(data).filter((t) => t.buyerUID === uid);
      setTransactions(buyerTx);

      const approvedTx = buyerTx.filter(t => t.status === "Approved");
      const totalApprovedValue = approvedTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const totalOrders = buyerTx.length;
      const pending = buyerTx.filter(t => t.status === "Pending").length;

      setStats({ totalApprovedValue, totalOrders, pending });

    });

    // ✅ Fetch Cart + Seller Info
    onValue(cartRef, async (snapshot) => {
      const data = snapshot.val() || {};
      const items = Object.entries(data).map(([id, item]) => ({ id, ...item }));

      // Fetch each seller’s info
      const sellerPromises = items.map(async (item) => {
        if (!item.sellerUID) return item;

        const sellerRef = ref(db, `users/sellers/${item.sellerUID}`);
        return new Promise((resolve) => {
          onValue(
            sellerRef,
            (snap) => {
              const sellerData = snap.val();
              resolve({
                ...item,
                sellerName: sellerData?.name || "Unknown Seller",
                sellerEmail: sellerData?.email || "",
                productCategory: item.productCategory || sellerData?.category || "Uncategorized",
              });
            },
            { onlyOnce: true }
          );
        });
      });

      const itemsWithSellers = await Promise.all(sellerPromises);
      setCartItems(itemsWithSellers);
    });

    // ✅ Cleanup listeners
    return () => {
      off(buyerRef);
      off(transRef);
      off(cartRef);
    };
  }, [uid]);

  // 🔹 Change quantity
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    const itemRef = ref(db, `carts/${uid}/${itemId}`);
    update(itemRef, { quantity: newQuantity });
  };

  // 🔹 Remove item
  const handleRemoveItem = (itemId) => {
    const itemRef = ref(db, `carts/${uid}/${itemId}`);
    remove(itemRef);
  };

  // 🔹 Place Order
  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const transRef = ref(db, "transactions");
    const requestRef = ref(db, "orderRequests");

    for (let item of cartItems) {
      // 🔹 Fetch product info
      const productSnap = await new Promise((resolve) => {
        const productRef = ref(db, `products/${item.productId}`);
        onValue(productRef, (snap) => resolve(snap.val()), { onlyOnce: true });
      });

      if (!productSnap) continue;

      const sellerUID = productSnap.sellerUID;
      let sellerName = "Unknown Seller";

      if (sellerUID) {
        const sellerSnap = await new Promise((resolve) => {
          const sellerRef = ref(db, `users/sellers/${sellerUID}`);
          onValue(sellerRef, (snap) => resolve(snap.val()), { onlyOnce: true });
        });
        if (sellerSnap) sellerName = sellerSnap.name || "Unknown Seller";
      }

      const amount = (productSnap.price || 0) * (item.quantity || 1);

      // 🔹 Create a single transaction per cart item
      const newTransRef = push(transRef);
      const transactionId = newTransRef.key;

      await set(newTransRef, {
        productId: item.productId,
        productName: productSnap.name || item.productName,
        productCategory: productSnap.category || "Uncategorized",
        price: productSnap.price || 0,
        quantity: item.quantity || 1,
        buyerUID: uid,
        buyerName: buyerInfo.name || "N/A", // <-- add buyer name here
        sellerUID: sellerUID || "",
        sellerName,
        sellerEmail: productSnap.sellerEmail || "",
        amount,
        status: "Pending",
        date: new Date().toISOString(),
        orderRequestId: transactionId, // link order request to this transaction
      });

      // 🔹 Create order request (linked to transaction)
      const newReqRef = push(requestRef);
      await set(newReqRef, {
        buyerUID: uid,
        buyerName: buyerInfo.name || "N/A", // <-- add buyer name here too
        sellerUID: sellerUID || "",
        productId: item.productId,
        productName: productSnap.name || item.productName,
        quantity: item.quantity || 1,
        amount,
        status: "Pending",
        date: new Date().toISOString(),
        transactionId, // store the linked transaction
      });

      // 🔹 Remove cart item
      const itemRef = ref(db, `carts/${uid}/${item.id}`);
      await remove(itemRef);
    }


  };


  // 🔹 Charts data
  const spendData = transactions
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((t) => ({ date: t.date, amount: Number(t.amount) }));

  const categoryCount = {};
  transactions.forEach((t) => {
    const category = t.productCategory || "Uncategorized";
    categoryCount[category] = (categoryCount[category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({ name, value }));

  const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171", "#a78bfa", "#34d399", "#f472b6"];

  return (
    <div className="flex bg-gray-50 min-h-screen w-full overflow-hidden">




      {/* Sidebar */}
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
              to="/transactions"
              className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition"
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



      {/* Main */}
      <div className="flex-1 p-6 md:p-10 ml-64">

        {/* Buyer Info */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6 flex flex-col md:flex-row items-center gap-6 border border-gray-100">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            {buyerInfo.name.charAt(0)}
          </div>
          <div className="flex flex-col gap-1 text-left">
            <h2 className="text-2xl font-semibold text-gray-800">{buyerInfo.name}</h2>
            {buyerInfo.company && <p className="text-gray-500 italic font-medium">{buyerInfo.company}</p>}
            <p className="text-gray-600 font-normal">{buyerInfo.email}</p>
          </div>
        </div>

        {/* Explore */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/buyer/${uid}/explore`)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-4 rounded-2xl shadow text-lg"
          >
            🔎 Explore Products
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-600 font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalApprovedValue?.toFixed(2) || "0.00"}
            </p>

          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-600 font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-600 font-semibold">Pending Orders</h3>
            <p className="text-3xl font-bold text-orange-500">{stats.pending}</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-700 font-semibold mb-2">Spending Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={spendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#4ade80" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-gray-700 font-semibold mb-2">Orders by Category</h3>
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

        {/* Cart */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
          {cartItems.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-xl overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3 border-b">Product</th>
                      <th className="p-3 border-b">Price</th>
                      <th className="p-3 border-b">Quantity</th>
                      <th className="p-3 border-b">Total</th>
                      <th className="p-3 border-b">Seller Name</th>
                      <th className="p-3 border-b">Seller Email</th>
                      <th className="p-3 border-b">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="p-3 border-b">{item.productName || item.productId}</td>
                        <td className="p-3 border-b">${Number(item.price || 0).toFixed(2)}</td>
                        <td className="p-3 border-b">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                            className="w-16 p-1 border rounded text-center"
                          />
                        </td>
                        <td className="p-3 border-b">
                          ${((item.price || 0) * item.quantity).toFixed(2)}
                        </td>
                        <td className="p-3 border-b">{item.sellerName || "N/A"}</td>
                        <td className="p-3 border-b">{item.sellerEmail || ""}</td>
                        <td className="p-3 border-b">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Animated Order Button */}
                <div className="mt-4 text-center">
                  <button
                    className="order"
                    disabled={placingOrder}
                    onClick={async (e) => {
                      e.preventDefault();
                      const button = e.currentTarget;
                      if (!button.classList.contains("animate") && !placingOrder) {
                        setPlacingOrder(true);
                        button.classList.add("animate");
                        await new Promise((r) => setTimeout(r, 8000));
                        await handlePlaceOrder();
                        await new Promise((r) => setTimeout(r, 3000));
                        button.classList.remove("animate");
                        setPlacingOrder(false);
                      }
                    }}
                  >
                    <span className="default">Complete Order</span>
                    <span className="success">
                      Order Placed
                      <svg viewBox="0 0 12 10">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                      </svg>
                    </span>
                    <div className="box"></div>
                    <div className="truck">
                      <div className="back"></div>
                      <div className="front">
                        <div className="window"></div>
                      </div>
                      <div className="light top"></div>
                      <div className="light bottom"></div>
                    </div>
                    <div className="lines"></div>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </div>

        {/* Transactions */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Pending Orders</h2>
          {transactions.filter(t => t.status === "Pending").length > 0 ? (
            <table className="min-w-full bg-white rounded-xl overflow-hidden mb-10">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Seller Name</th>
                  <th className="p-3 border-b">Seller Email</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(t => t.status === "Pending")
                  .map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{t.productName}</td>
                      <td className="p-3 border-b">${Number(t.amount).toFixed(2)}</td>
                      <td className="p-3 border-b text-orange-500 font-semibold">{t.status}</td>
                      <td className="p-3 border-b">{t.date}</td>
                      <td className="p-3 border-b">{t.sellerName || "N/A"}</td>
                      <td className="p-3 border-b">{t.sellerEmail || ""}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 mb-8">No pending orders.</p>
          )}

          <h2 className="text-2xl font-semibold mb-4">Approved Orders</h2>
          {transactions.filter(t => t.status === "Approved").length > 0 ? (
            <table className="min-w-full bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Seller Name</th>
                  <th className="p-3 border-b">Seller Email</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter(t => t.status === "Approved")
                  .map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{t.productName}</td>
                      <td className="p-3 border-b">${Number(t.amount).toFixed(2)}</td>
                      <td className="p-3 border-b text-green-600 font-semibold">{t.status}</td>
                      <td className="p-3 border-b">{t.date}</td>
                      <td className="p-3 border-b">{t.sellerName || "N/A"}</td>
                      <td className="p-3 border-b">{t.sellerEmail || ""}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No approved orders yet.</p>
          )}
        </div>





      </div>
    </div>
  );
};

export default BuyerDashboard;
