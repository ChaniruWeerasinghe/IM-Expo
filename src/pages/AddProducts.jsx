import React, { useState } from "react";
import { db, auth } from "../firebase";
import { ref, push, get, update } from "firebase/database";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

const AddProducts = () => {
  const [user] = useAuthState(auth); 
  const [product, setProduct] = useState({
    name: "",
    category: "Beverages",
    price: "",
    image: "",
    description: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);

    if (!user) {
      alert("You must be logged in as a seller to add products.");
      return;
    }

    try {
      // 1️⃣ Get seller subscription
      const subSnap = await get(ref(db, `subscriptions/sellers/${user.uid}`));
      const sub = subSnap.val();

      if (!sub) {
        alert("No subscription found. Please contact support.");
        return;
      }

      // 2️⃣ Block if no credits left
      if (sub.credits <= 0) {
        alert("❌ You've reached your free upload limit. Please upgrade your plan before adding more products.");
        navigate("/subscriptions");
        return;
      }

      // 3️⃣ Upload product
      const productsRef = ref(db, "products");
      await push(productsRef, {
        ...product,
        price: parseFloat(product.price),
        sellerUID: user.uid,
        sellerEmail: user.email,
        createdAt: new Date().toISOString(),
      });

      // 4️⃣ Update credits
      await update(ref(db, `subscriptions/sellers/${user.uid}`), {
        usedCredits: (sub.usedCredits || 0) + 1,
        credits: sub.credits - 1,
      });

      setProduct({
        name: "",
        category: "Beverages",
        price: "",
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
          required
        >
          <option value="Beverages">Beverages</option>
          <option value="Home Goods">Home Goods</option>
          <option value="Apparel">Apparel</option>
          <option value="Snacks">Snacks</option>
          <option value="Spices">Spices</option>
          <option value="Industrial Goods">Industrial Goods</option>
          <option value="Eco Products">Eco Products</option>
          <option value="Food & Beverages">Food & Beverages</option>
          <option value="Handicrafts">Handicrafts</option>
          <option value="Home & Garden">Home & Garden</option>
          <option value="Beauty & Wellness">Beauty & Wellness</option>
        </select>

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg"
          required
        />

        <input
          type="url"
          name="image"
          placeholder="Image URL (optional)"
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
