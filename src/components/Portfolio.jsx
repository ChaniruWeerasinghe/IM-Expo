// /src/components/Portfolio.jsx
import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue, push, update, get, set } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";
import ProductReview from "./ProductReview";
import styles from "./ProductModal.module.css"; // ✅ Import external modal CSS

const Portfolio = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // 🔹 Increment product view count
  const incrementViews = async (productId) => {
    try {
      const productRef = ref(db, `products/${productId}`);
      onValue(
        productRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            update(productRef, { views: (data.views || 0) + 1 });
          }
        },
        { onlyOnce: true }
      );
    } catch (err) {
      console.error("Error updating views:", err);
    }
  };

  // 🔹 Fetch products
  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.entries(data).map(([id, product]) => ({
          id,
          ...product,
        }));
        setProducts(list);
        setFiltered(list);
      }
    });
    return () => unsubscribe();
  }, []);

  // 🔹 Filter products
  useEffect(() => {
    let result = products.filter((p) =>
      (p.name || "").toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "All")
      result = result.filter((p) => p.category === category);
    setFiltered(result);
  }, [search, category, products]);

  // 🔹 Contact Seller
  const contactSeller = async (product) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please log in as a buyer to contact the seller.");
    return;
  }

  try {
    // Ensure messages and buyerMessages nodes exist
    const ensurePathExists = async (path) => {
      const node = ref(db, path);
      const snap = await get(node);
      if (!snap.exists()) {
        await set(node, { _init: true });
      }
    };
    await ensurePathExists("messages");
    await ensurePathExists("buyerMessages");

    // Fetch buyer info
    const buyerSnap = await get(ref(db, `users/buyers/${user.uid}`));
    const buyerData = buyerSnap.exists() ? buyerSnap.val() : {};
    const buyerName =
      buyerData.name || user.displayName || user.email.split("@")[0];
    const buyerEmail = buyerData.email || user.email;

    // Validate product
    if (!product?.id) {
      alert("Cannot send message: product ID missing.");
      return;
    }

    // Fetch product again to ensure sellerUID is valid
    const productSnap = await get(ref(db, `products/${product.id}`));
    const productData = productSnap.exists() ? productSnap.val() : product;
    const sellerUID =
      productData.sellerUID || product.sellerUID || product.seller?.uid;

    if (!sellerUID) {
      alert("Cannot send message: product or seller info missing.");
      return;
    }

    // Fetch seller info
    const sellerSnap = await get(ref(db, `users/sellers/${sellerUID}`));
    const sellerData = sellerSnap.exists() ? sellerSnap.val() : {};
    const sellerName =
      sellerData.name || product.sellerName || "Seller";
    const sellerEmail = sellerData.email || product.sellerEmail || "";

    // Auto-generated message
    const messageText = `Hello ${sellerName}, I’m ${buyerName} (${buyerEmail}). I’m interested in your product "${productData.name ||
      "Unnamed Product"}". Please share more details.`;

    // Save message for seller
    const msgRef = push(ref(db, `messages/${sellerUID}`));
    const safeValue = (val, fallback = "") =>
  val === undefined || val === null ? fallback : val;

const messageObj = {
  buyerUID: safeValue(user.uid),
  buyerName: safeValue(buyerName),
  buyerEmail: safeValue(buyerEmail),
  productId: safeValue(productData.id || product.id || product.productId, "unknown"),
  productName: safeValue(productData.name || product.name, "Unnamed Product"),
  message: safeValue(messageText),
  timestamp: new Date().toISOString(),
  status: "unread",
};

await set(msgRef, messageObj);

    // Mirror to buyerMessages
    const buyerMsgRef = push(ref(db, `buyerMessages/${user.uid}`));
    await set(buyerMsgRef, {
      ...messageObj,
      fromSeller: sellerName,
    });

    alert("✅ Your message has been sent to the seller!");
  } catch (error) {
  console.error("Error sending message:", error.code, error.message);
  alert(`❌ Failed to send message: ${error.message}`);
}

};


  // 🔹 Request Import Permission
  const requestPermission = (product) => {
    if (!product.id) {
      alert("Cannot request permission: product ID missing.");
      return;
    }

    const requestRef = ref(db, "importRequests");
    push(requestRef, {
      productId: product.id,
      productName: product.name,
      date: new Date().toISOString(),
    });
    alert(`Import permission request sent for: ${product.name}`);
  };

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Portfolio / Products
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option>All</option>
          <option>Beverages</option>
          <option>Home Goods</option>
          <option>Apparel</option>
          <option>Snacks</option>
          <option>Spices</option>
          <option>Industrial Goods</option>
          <option>Eco Products</option>
          <option>Food & Beverages</option>
          <option>Handicrafts</option>
          <option>Industrial Supplies</option>
          <option>Food & Beauty</option>
          <option>Industrial & Health</option>
          <option>Decor</option>
          <option>Food Products</option>
          <option>Home & Garden</option>
          <option>Beauty & Wellness</option>
          <option>Aromatherapy</option>
        </select>
      </div>

      {/* Products Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div
                onClick={() => {
                  incrementViews(p.id);
                  setSelectedProduct(p);
                }}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col h-full"
              >
                <img
                  src={p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1 justify-between h-52">
                  <div>
                    <h3 className="text-lg font-bold text-green-600">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-600">{p.category}</p>
                  </div>
                  <div className="mt-2">
                    <p className="font-semibold text-gray-700">${p.price}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found.</p>
      )}

      {/* Product Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className={styles["modal-container"]}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className={styles["close-btn"]}
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>

              <div className={styles["modal-content"]}>
                <div className={styles.left}>
                  <img
                    src={
                      selectedProduct.image || "https://via.placeholder.com/300"
                    }
                    alt={selectedProduct.name}
                    className={styles["product-image"]}
                  />
                  <h3 className={styles["product-name"]}>
                    {selectedProduct.name}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <p className={styles.category}>{selectedProduct.category}</p>
                    <p className={styles.price}>${selectedProduct.price}</p>
                  </div>

                  <p className={styles.description}>
                    {selectedProduct.description || "No description provided."}
                  </p>
                </div>

                <div className={styles.right}>
                  {/* Multiple Info Sections */}
                  <div className={styles["info-group"]}>
                    <div className={styles["info-block"]}>
                      <h4 className={styles["rate-title"]}>Product Actions & Feedback</h4>
                      <p className={styles["action-desc"]}>
                        You can <strong>contact the seller</strong> to discuss your order or
                        <strong> request import permission</strong> if you wish to proceed with
                        official trade.
                      </p>
                    </div>

                    <div className={styles["info-block"]}>
                      <h4 className={styles["rate-title"]}>Safety & Compliance</h4>
                      <p className={styles["action-desc"]}>
                        All products listed here meet basic import and export compliance
                        requirements. Sellers are encouraged to provide relevant certificates
                        upon request.
                      </p>
                    </div>

                    <div className={styles["info-block"]}>
                      <h4 className={styles["rate-title"]}>Quality Assurance</h4>
                      <p className={styles["action-desc"]}>
                        Buyers who purchased these products can provide ratings. Below is
                        the current rating based on verified buyer feedback.
                      </p>
                    </div>
                  </div>

                  <hr className={styles["divider"]} />

                  {/* Read-only Ratings Section (avg + count) */}
                  <div className={styles["rate-section"]}>
                    <h4 className={styles["rate-title-custom"]}>Product Rating</h4>
                    <ProductReview productId={selectedProduct.id} mode="read" />
                  </div>
                </div>
              </div>

              <div className={styles["bottom-buttons"]}>
                <button
                  className={styles["contact-btn"]}
                  onClick={() => contactSeller(selectedProduct)}
                >
                  Contact Seller
                </button>

                <button
                  className={styles["import-btn"]}
                  onClick={() => requestPermission(selectedProduct)}
                  style={{ marginTop: "0.5rem" }}
                >
                  Request Import Permission
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Portfolio;
