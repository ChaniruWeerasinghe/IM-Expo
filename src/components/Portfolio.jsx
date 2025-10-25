// src/components/Portfolio.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue, push } from "firebase/database";
import { motion, AnimatePresence } from "framer-motion";

const Portfolio = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch products from Firebase
  useEffect(() => {
    const productsRef = ref(db, "products");
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Map products to include id to avoid Firebase undefined error
        const list = Object.entries(data).map(([id, product]) => ({ id, ...product }));
        setProducts(list);
        setFiltered(list);
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
    setFiltered(result);
  }, [search, category, products]);

  // Contact seller function
  const contactSeller = (product) => {
    if (!product.id || !product.seller) {
      alert("Cannot send message: product or seller info missing.");
      return;
    }

    const message = prompt(
      `Send a message to ${product.seller}:`,
      "Hello, I am interested in your product."
    );
    if (message) {
      const messagesRef = ref(db, "messages");
      push(messagesRef, {
        productId: product.id,
        seller: product.seller,
        message,
        date: new Date().toISOString(),
      });
      alert("Message sent successfully!");
    }
  };

  // Request import permission function
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
          <option>Handmade</option>
          <option>Art</option>
          <option>Food</option>
          <option>Clothing</option>
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
                onClick={() => setSelectedProduct(p)}
                className="cursor-pointer bg-white rounded-xl shadow-md hover:shadow-2xl transition-transform transform hover:-translate-y-1 overflow-hidden flex flex-col h-full"
              >
                <img
                  src={p.image || "https://via.placeholder.com/300"}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex flex-col flex-1 justify-between h-52">
                  <div>
                    <h3 className="text-lg font-bold text-green-600">{p.name}</h3>
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

      {/* Modal for product details */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-xl"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
              <img
                src={selectedProduct.image || "https://via.placeholder.com/300"}
                alt={selectedProduct.name}
                className="w-full h-60 object-cover rounded-xl mb-4"
              />
              <h3 className="text-xl font-bold text-green-600">{selectedProduct.name}</h3>
              <p className="text-gray-600 mb-2">{selectedProduct.category}</p>
              <p className="font-semibold text-gray-700 mb-4">${selectedProduct.price}</p>
              <p className="text-gray-700 mb-4">
                {selectedProduct.description || "No description provided."}
              </p>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition"
                  onClick={() => contactSeller(selectedProduct)}
                >
                  Contact Seller
                </button>
                <button
                  className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
                  onClick={() => requestPermission(selectedProduct)}
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
