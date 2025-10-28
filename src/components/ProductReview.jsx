// src/components/ProductReview.jsx
import React, { useState, useEffect } from "react";
import { ref, onValue, update } from "firebase/database";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

const ProductReview = ({ productId }) => {
  const [user] = useAuthState(auth);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [ratings, setRatings] = useState({});

  // 🔹 Fetch existing ratings
  useEffect(() => {
    if (!productId) return;
    const productRef = ref(db, `products/${productId}`);
    onValue(productRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setRatings(data.ratings || {});
        setAvgRating(data.avgRating || 0);

        if (user && data.ratings && data.ratings[user.uid]) {
          setRating(data.ratings[user.uid]);
        }
      }
    });
  }, [productId, user]);

  // 🔹 Submit new rating
  const submitRating = async () => {
    if (!user) {
      alert("You must be logged in to rate products.");
      return;
    }
    if (rating < 1 || rating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }

    try {
      const updatedRatings = { ...ratings, [user.uid]: rating };
      const allRatings = Object.values(updatedRatings);
      const avg =
        allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length;

      await update(ref(db, `products/${productId}`), {
        ratings: updatedRatings,
        avgRating: parseFloat(avg.toFixed(2)),
      });

      alert("✅ Thank you for your feedback!");
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert("❌ Failed to submit rating.");
    }
  };

  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-3 text-center">
        Rate this Product
      </h4>

      {/* Star Buttons */}
      <div className="flex justify-center mb-4">
        {[1, 2, 3, 4, 5].map((num) => (
          <button
            key={num}
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(num)}
            className={`text-3xl transition ${
              num <= (hover || rating)
                ? "text-yellow-400 scale-110"
                : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={submitRating}
          className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition"
        >
          Submit Rating
        </button>
      </div>

      {/* Current Average */}
      <p className="mt-3 text-sm text-gray-700 text-center">
        Average Rating:{" "}
        <span className="font-semibold text-green-600">{avgRating || 0}</span> ⭐
      </p>
    </div>
  );
};

export default ProductReview;
