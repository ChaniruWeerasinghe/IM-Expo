import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition">
    <img
      src={product.image || "/assets/placeholder.png"}
      alt={product.name}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-1">
        {product.name || "Unnamed Product"}
      </h3>
      <p className="text-gray-600 text-sm mb-1">
        {product.category || "Uncategorized"}
      </p>
      <p className="text-sm text-gray-500 mb-3">
        Seller: {product.sellerName || "Unknown"}
      </p>
      <p className="text-sm text-gray-500 mb-2">
        👁️ Views: {product.views || 0} | ⭐ {product.avgRating || 0} | 💰{" "}
        {product.salesCount || 0}
      </p>
      <Link
        to="/portfolio"
        className="text-green-500 font-medium hover:underline"
      >
        View Product →
      </Link>
    </div>
  </div>
);

export default ProductCard;
