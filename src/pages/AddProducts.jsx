// src/pages/AddProducts.jsx
import React, { useState } from "react";
import { db } from "../firebase";
import { ref, push } from "firebase/database";

const AddProducts = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "Handmade",
    pricePerUnit: "",
    seller: "",
    image: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);

    try {
      const productsRef = ref(db, "products");
      await push(productsRef, product); // ✅ push data to Realtime DB

      setProduct({
        name: "",
        category: "Handmade",
        pricePerUnit: "",
        seller: "",
        image: "",
        description: "",
      });

      setSubmitted(true);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("❌ Failed to add product. Check Firebase rules or console.");
    }
  };

  return (
    <section className="px-4 py-16 max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
        Add a New Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        >
          <option value="Handmade">Handmade</option>
          <option value="Art">Art</option>
          <option value="Food">Food</option>
          <option value="Clothing">Clothing</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          name="pricePerUnit"
          placeholder="Price per unit"
          value={product.pricePerUnit}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="text"
          name="seller"
          placeholder="Seller Name"
          value={product.seller}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="url"
          name="image"
          placeholder="Image URL"
          value={product.image}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition"
        >
          Add Product
        </button>
      </form>

      {submitted && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-medium">
            ✅ Product added successfully!
          </p>
        </div>
      )}
    </section>
  );
};

export default AddProducts;
