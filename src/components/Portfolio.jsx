// src/components/Portfolio.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Portfolio = () => {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    const productsRef = ref(db, "products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const list = Object.values(data);
        setProducts(list);
        setFiltered(list);
      }
    });
  }, []);

  useEffect(() => {
    let result = products.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "All") result = result.filter((p) => p.category === category);
    setFiltered(result);
  }, [search, category, products]);

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Products / Portfolio
      </h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
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
          {filtered.map((product, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <img
                src={product.image || "https://via.placeholder.com/300"}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-green-600">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.category}</p>
                <p className="mt-2 font-semibold text-gray-700">${product.price}</p>
                <p className="mt-1 text-gray-600 text-sm">By: {product.seller}</p>
                <div className="flex gap-2 mt-4">
                  <button className="flex-1 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition">
                    Contact Seller
                  </button>
                  <button className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-lg hover:bg-blue-600 transition">
                    Request Import Permission
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No products found.</p>
      )}
    </section>
  );
};

export default Portfolio;
