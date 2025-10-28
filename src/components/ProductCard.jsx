// src/components/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => (
  <div className="bg-white shadow-md rounded-xl overflow-hidden hover:shadow-lg transition h-full flex flex-col">
    {/* Product Image */}
    <img
      src={
        product.image ||
        product.imageURL ||
        product.productImage ||
        "/assets/placeholder.png"
      }

      alt={product.name}
      className="w-full h-48 object-cover"
    />

    {/* Card Content */}
    <div className="flex flex-col justify-between flex-1 p-4">
      {/* Product name always at top */}
      <div>
        <h3 className="font-semibold text-lg text-gray-800 mb-2 leading-tight">
          {product.name || "Unnamed Product"}
        </h3>
      </div>

      {/* Category, seller, and button grouped at bottom */}
      <div className="mt-auto">
        <p className="text-gray-600 text-sm mb-1">
          {product.category || "Uncategorized"}
        </p>
        <p className="text-sm text-gray-500 mb-3">
          Seller: {product.sellerName || "Unknown"}
        </p>
        <Link
          to="/portfolio"
          className="inline-block bg-green-500 text-white text-sm font-medium px-4 py-1 rounded-lg shadow-sm hover:bg-green-600 hover:shadow-md transition-all duration-200"
        >
          View Product
        </Link>
      </div>
    </div>
  </div>
);

export default ProductCard;
