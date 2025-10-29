// /src/components/BuyerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { ref, onValue, off, push, set, update, remove, get } from "firebase/database";
import { signOut } from "firebase/auth";
import "./OrderButton.css";
import styles from "./ProductModal.module.css"; // reuse your modal style
import ProductReview from "./ProductReview";

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
  const [verification, setVerification] = useState({ status: "Not Verified", type: null });

  const [transactions, setTransactions] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [stats, setStats] = useState({ totalSpent: 0, totalOrders: 0, pending: 0 });
  const [placingOrder, setPlacingOrder] = useState(false);

  // Rating modal state
  const [ratingModalOpen, setRatingModalOpen] = useState(false);
  const [ratingProduct, setRatingProduct] = useState(null); // { productId, productName }

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
    const verifyRef = ref(db, `users/buyers/${uid}/verification`);

    onValue(verifyRef, (snap) => {
      const data = snap.val();
      if (data) setVerification(data);
    });

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

      const approvedTx = buyerTx.filter((t) => t.status === "Approved");
      const totalSpent = approvedTx.reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const totalOrders = buyerTx.length;
      const pending = buyerTx.filter((t) => t.status === "Pending").length;

      setStats({ totalSpent, totalOrders, pending });
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
      off(verifyRef);
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
      const productSnap = await new Promise((resolve) => {
        const productRef = ref(db, `products/${item.productId}`);
        onValue(productRef, (snap) => resolve(snap.val()), { onlyOnce: true });
      });

      if (!productSnap) continue;

      const sellerUID = productSnap.sellerUID;
      let sellerName = "Unknown Seller";
      let sellerEmail = "";

      if (sellerUID) {
        const sellerSnap = await new Promise((resolve) => {
          const sellerRef = ref(db, `users/sellers/${sellerUID}`);
          onValue(sellerRef, (snap) => resolve(snap.val()), { onlyOnce: true });
        });
        if (sellerSnap) {
          sellerName = sellerSnap.name || "Unknown Seller";
          sellerEmail = sellerSnap.email || "";
        }
      }

      const amount = (productSnap.price || 0) * (item.quantity || 1);

      const newTransRef = push(transRef);
      const transactionId = newTransRef.key;

      await set(newTransRef, {
        productId: item.productId,
        productName: productSnap.name || item.productName,
        productCategory: productSnap.category || "Uncategorized",
        price: productSnap.price || 0,
        quantity: item.quantity || 1,
        buyerUID: uid,
        buyerName: buyerInfo.name || "N/A",
        sellerUID: sellerUID || "",
        sellerName,
        sellerEmail,
        amount,
        status: "Pending",
        date: new Date().toISOString(),
        orderRequestId: transactionId,
      });

      const newReqRef = push(requestRef);
      await set(newReqRef, {
        buyerUID: uid,
        buyerName: buyerInfo.name || "N/A",
        sellerUID: sellerUID || "",
        sellerName,
        sellerEmail,
        productId: item.productId,
        productName: productSnap.name || item.productName,
        quantity: item.quantity || 1,
        amount,
        status: "Pending",
        date: new Date().toISOString(),
        transactionId,
      });

      const itemRef = ref(db, `carts/${uid}/${item.id}`);
      await remove(itemRef);
    }
  };

  // ---- Charts data ----
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

  // ---- Rating Modal helpers ----
  const openRatingModal = async (productId, productName) => {
    // Guard: ensure at least one approved transaction for this buyer + product
    const hasApproved = transactions.some(
      (t) => t.status === "Approved" && t.productId === productId && t.buyerUID === uid
    );
    if (!hasApproved) {
      alert("You can only rate products you have purchased (Approved orders).");
      return;
    }
    setRatingProduct({ productId, productName });
    setRatingModalOpen(true);
  };

  const closeRatingModal = () => {
    setRatingModalOpen(false);
    setRatingProduct(null);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen w-full overflow-hidden">
      {/* Sidebar */}
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
          <div className="flex items-center gap-2 mt-2">
            {verification.status === "Verified" ? (
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  verification.type === "free" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"
                }`}
              >
                {verification.type === "free" ? "Authorized Buyer (Free Verified)" : "IM-Expo Verified Buyer"}
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700">Not Verified</span>
            )}
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
            <h3 className="text-gray-600 font-semibold">Total Spent</h3>
            <p className="text-3xl font-bold text-green-600">
              ${stats.totalSpent?.toFixed(2) || "0.00"}
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

                {/* 🔹 Seller Replies Section */}
        <div className="mt-12 mb-12">
          <h2 className="text-2xl font-semibold mb-4">Seller Replies</h2>
          <BuyerMessages buyerUID={uid} />
        </div>


        {/* Transactions */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Pending Orders</h2>
          {transactions.filter((t) => t.status === "Pending").length > 0 ? (
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
                  .filter((t) => t.status === "Pending")
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
          {transactions.filter((t) => t.status === "Approved").length > 0 ? (
            <table className="min-w-full bg-white rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border-b">Product</th>
                  <th className="p-3 border-b">Amount</th>
                  <th className="p-3 border-b">Status</th>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Seller Name</th>
                  <th className="p-3 border-b">Seller Email</th>
                  <th className="p-3 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter((t) => t.status === "Approved")
                  .map((t, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="p-3 border-b">{t.productName}</td>
                      <td className="p-3 border-b">${Number(t.amount).toFixed(2)}</td>
                      <td className="p-3 border-b text-green-600 font-semibold">{t.status}</td>
                      <td className="p-3 border-b">{t.date}</td>
                      <td className="p-3 border-b">{t.sellerName || "N/A"}</td>
                      <td className="p-3 border-b">{t.sellerEmail || ""}</td>
                      <td className="p-3 border-b">
                        <button
                          onClick={() => openRatingModal(t.productId, t.productName)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                        >
                          Rate Product
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500">No approved orders yet.</p>
          )}
        </div>
      </div>

      {/* Rating Modal (enhanced with live Firebase product details, larger, gradient) */}
      {ratingModalOpen && ratingProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeRatingModal}
        >
          <div
            className={styles["modal-container"]}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "96%",
              maxWidth: "960px",
              minHeight: "520px",
              position: "relative",
              background: "linear-gradient(180deg, #ffffff 0%, #f0fff4 100%)",
              borderRadius: "16px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              padding: "1.25rem",
            }}
          >
            {/* Small X top-right */}
            <button
              className={styles["close-btn"]}
              onClick={closeRatingModal}
              style={{
                position: "absolute",
                top: "12px",
                right: "16px",
                fontSize: "1.25rem",
                color: "#4b5563",
                zIndex: 10,
                lineHeight: 1,
                width: "32px",
                height: "32px",
                borderRadius: "9999px",
                background: "rgba(0,0,0,0.04)",
                display: "grid",
                placeItems: "center",
              }}
              aria-label="Close"
              title="Close"
            >
              ×
            </button>

            {/* Modal Content */}
            <RatingModalContent
              productId={ratingProduct.productId}
              closeRatingModal={closeRatingModal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ---- Subcomponent: RatingModalContent ---- */
const RatingModalContent = ({ productId, closeRatingModal }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // helper: fetch seller by UID from /users/sellers
  const loadSellerByUid = async (sellerUID) => {
    if (!sellerUID) return {};
    // 1) direct path: /users/sellers/{sellerUID}
    const directSnap = await get(ref(db, `users/sellers/${sellerUID}`));
    if (directSnap.exists()) {
      const s = directSnap.val();
      return {
        sellerName: s.name || s.displayName || s.companyName || "Seller",
        sellerEmail: s.email || "",
      };
    }
    // 2) fallback: find child where .uid == sellerUID
    const allSnap = await get(ref(db, "users/sellers"));
    if (allSnap.exists()) {
      const all = allSnap.val();
      for (const key of Object.keys(all)) {
        const s = all[key];
        if (s?.uid === sellerUID) {
          return {
            sellerName: s.name || s.displayName || s.companyName || "Seller",
            sellerEmail: s.email || "",
          };
        }
      }
    }
    return {};
  };

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!productId) return;

      try {
        // load product once
        const prodSnap = await get(ref(db, `products/${productId}`));
        const data = prodSnap.val();
        if (!data) {
          if (isMounted) {
            setProduct(null);
            setLoading(false);
          }
          return;
        }

        // enrich with seller info when missing
        let enriched = { id: productId, ...data };
        const needsSellerLookup =
          !enriched.sellerName || enriched.sellerName === "Unknown Seller";

        if (needsSellerLookup && enriched.sellerUID) {
          const sellerInfo = await loadSellerByUid(enriched.sellerUID);
          enriched = { ...enriched, ...sellerInfo };
        }

        if (isMounted) {
          setProduct(enriched);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          console.error("Failed to load product/seller:", e);
          setProduct(null);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Product not found.
      </div>
    );
  }

  return (
    <div className={styles["modal-content"]}>
      {/* Left side: product details */}
      <div className={styles.left} style={{ flex: "1.2" }}>
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          className={styles["product-image"]}
          style={{ maxHeight: "220px", borderRadius: "12px" }}
        />
        <h3 className={styles["product-name"]} style={{ marginTop: "1rem", fontSize: "1.5rem" }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", gap: "10px", alignItems: "center", margin: "6px 0" }}>
          <span className={styles.category}>{product.category || "Uncategorized"}</span>
          <span className={styles.price}>${product.price || "N/A"}</span>
        </div>

        <p className={styles.description} style={{ marginTop: "0.75rem", fontSize: "0.95rem" }}>
          {product.description || "No description available for this product."}
        </p>

        <hr style={{ margin: "1rem 0", borderColor: "#e5e7eb" }} />

        <div style={{ fontSize: "0.9rem", color: "#555" }}>
          <p>
            <strong>Seller:</strong> {product.sellerName || "Unknown Seller"}
          </p>
          {product.sellerEmail && (
            <p>
              <strong>Email:</strong> {product.sellerEmail}
            </p>
          )}
        </div>
      </div>

      {/* Right side: rating */}
      <div
        className={styles.right}
        style={{ flex: "0.9", borderLeft: "1px solid #e5e7eb", paddingLeft: "1.5rem" }}
      >
        <div className={styles["info-block"]}>
          <h4 className={styles["rate-title"]} style={{ marginBottom: "1rem" }}>
            Your Rating
          </h4>
          <ProductReview productId={productId} mode="rate" onSubmitted={closeRatingModal} />
        </div>
        <p className={styles["action-desc"]} style={{ marginTop: "1.5rem" }}>
          Rate the product based on your experience. Your feedback helps other buyers and boosts
          trusted sellers on IM-Expo.
        </p>
      </div>

      {/* Buttons */}
      <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
        <button
          onClick={closeRatingModal}
          style={{
            flex: "1",
            border: "1px solid #e5e7eb",
            background: "#fff",
            color: "#374151",
            borderRadius: "10px",
            padding: "10px 12px",
            fontWeight: 600,
          }}
        >
          Close
        </button>
        <a
          href={`/portfolio#${product.id}`}
          style={{
            flex: "1",
            background: "#10b981",
            color: "white",
            borderRadius: "10px",
            padding: "10px 12px",
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          View in Portfolio
        </a>
      </div>
    </div>
  );
};

/* ---- 🔹 NEW SUBCOMPONENT: BuyerMessages ---- */
const BuyerMessages = ({ buyerUID }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!buyerUID) return;
    const msgRef = ref(db, `buyerMessages/${buyerUID}`);
    onValue(msgRef, (snap) => {
      const data = snap.val() || {};
      const msgs = Object.entries(data).map(([id, val]) => ({ id, ...val }));
      setMessages(msgs.reverse());
    });
    return () => off(msgRef);
  }, [buyerUID]);

  return (
    <div className="space-y-3">
      {messages.length > 0 ? (
        messages.map((m) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded-xl shadow border border-gray-100"
          >
            <p className="text-gray-700">{m.text}</p>
            <p className="text-xs text-gray-400 mt-1">
              {m.timestamp
                ? new Date(m.timestamp).toLocaleString()
                : "Unknown time"}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">No replies from sellers yet.</p>
      )}
    </div>
  );
};
export default BuyerDashboard;
