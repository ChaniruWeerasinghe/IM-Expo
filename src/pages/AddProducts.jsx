// src/pages/AddProducts.jsx
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
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setErrorMsg("");

    if (!user) {
      setErrorMsg("You must be logged in as a seller to add products.");
      return;
    }

    try {
      // 1️⃣ Get seller subscription
      const subSnap = await get(ref(db, `subscriptions/sellers/${user.uid}`));
      const sub = subSnap.val();

      if (!sub) {
        setErrorMsg(
          "No active subscription found. Please check your plan or contact support."
        );
        return;
      }

      // 2️⃣ Block if no credits left
      if (sub.credits <= 0) {
        alert(
          "You have no upload credits left. Please upgrade your plan to continue."
        );
        navigate(`/subscriptions?seller=${user.uid}`);
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
        views: 0,
        salesCount: 0,
        ratings: [],
        avgRating: 0,
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
      setErrorMsg("Something went wrong while adding your product. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left side – Preview / Upload Section */}
        <div className="bg-gradient-to-br from-green-600 to-green-400 flex flex-col items-center justify-center p-8 text-white">
          <h2 className="text-2xl font-bold mb-4 text-center">Show Your Product</h2>
          {product.image ? (
            <img
              src={product.image}
              alt="Preview"
              className="w-56 h-56 object-cover rounded-xl shadow-lg border-4 border-white"
            />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center bg-green-300 bg-opacity-30 rounded-xl border-2 border-white border-dashed text-sm text-center">
              Image preview will appear here
            </div>
          )}
          <p className="mt-4 text-sm text-green-50 text-center px-4">
            Upload a high-quality image link to attract more buyers.
          </p>
        </div>

        {/* Right side – Form Section */}
        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-green-600 mb-6">
            Add a New Product
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />

            <select
              name="category"
              value={product.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            />

            <input
              type="url"
              name="image"
              placeholder="Image URL (optional)"
              value={product.image}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={product.description}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              rows="4"
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition-all"
            >
              Add Product
            </button>
          </form>

          {submitted && (
            <div className="mt-6 bg-green-100 text-green-800 px-4 py-2 rounded-lg text-center font-medium">
              Product added successfully!
            </div>
          )}

          {errorMsg && (
            <div className="mt-6 bg-red-100 text-red-700 px-4 py-2 rounded-lg text-center font-medium">
              {errorMsg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddProducts;
