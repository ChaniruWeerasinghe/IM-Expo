// /src/components/ProductReview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ref, get, set, onValue, update } from "firebase/database";
import { db, auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { FaUpload } from "react-icons/fa";

/**
 * ProductReview
 *
 * Modes:
 *  - mode="read": read-only display inside Portfolio modal (shows avg stars + count)
 *  - mode="rate": interactive stars for Buyer Dashboard (buyers with approved purchase)
 *
 * Data model (Realtime DB):
 *  ratings/
 *    <productId>/
 *      <buyerUID>: number (1..5)
 *
 *  products/
 *    <productId>/
 *      avgRating: number
 *      ratingsCount: number
 */
const ProductReview = ({
  productId,
  mode = "read",                 // "read" | "rate"
  onSubmitted = () => {},         // callback after submit (used by BuyerDashboard to close modal)
}) => {
  const [user] = useAuthState(auth);

  const [avgRating, setAvgRating] = useState(0);
  const [ratingsCount, setRatingsCount] = useState(0);

  // For "rate" mode
  const [myRating, setMyRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // ---- Helpers ----
  const stars = useMemo(() => [1, 2, 3, 4, 5], []);

  const renderStars = (value) => {
    // value may be float; show filled based on floor/ceiling
    return (
      <div className="flex items-center gap-1">
        {stars.map((s) => {
          const filled = s <= Math.round(value);
          return (
            <span
              key={s}
              className={`text-2xl ${filled ? "text-yellow-400" : "text-gray-300"}`}
            >
              ★
            </span>
          );
        })}
      </div>
    );
  };

  // ---- Fetch average + count (listen live for Portfolio; reuse for rate mode to show context) ----
  useEffect(() => {
    if (!productId) return;

    const prodRef = ref(db, `products/${productId}`);
    const unsub = onValue(prodRef, (snap) => {
      const data = snap.val() || {};
      if (typeof data.avgRating === "number") setAvgRating(data.avgRating);
      else setAvgRating(0);
      if (typeof data.ratingsCount === "number") setRatingsCount(data.ratingsCount);
      else setRatingsCount(0);
    });

    return () => unsub();
  }, [productId]);

  // ---- Prefill my previous rating in "rate" mode ----
  useEffect(() => {
    if (mode !== "rate" || !productId || !user) return;

    const myRef = ref(db, `ratings/${productId}/${user.uid}`);
    get(myRef).then((snap) => {
      const val = snap.val();
      if (typeof val === "number") setMyRating(val);
    });
  }, [mode, productId, user]);

  // ---- Submit rating (buyers only, done in BuyerDashboard flow) ----
  const submitRating = async () => {
    if (mode !== "rate") return;
    if (!user) {
      alert("Please log in as a buyer to rate.");
      return;
    }
    if (myRating < 1 || myRating > 5) {
      alert("Please select a rating between 1 and 5.");
      return;
    }
    try {
      setSubmitting(true);

      // 1) Save/overwrite this buyer's rating for the product
      await set(ref(db, `ratings/${productId}/${user.uid}`), myRating);

      // 2) Recompute average & count from ratings/<productId>
      const allSnap = await get(ref(db, `ratings/${productId}`));
      const ratingsObj = allSnap.val() || {};
      const values = Object.values(ratingsObj).map((v) => Number(v)).filter((n) => !isNaN(n));
      const count = values.length;
      const avg = count > 0 ? values.reduce((s, n) => s + n, 0) / count : 0;

      // 3) Persist summary onto the product node for quick reads
      await update(ref(db, `products/${productId}`), {
        avgRating: parseFloat(avg.toFixed(2)),
        ratingsCount: count,
      });

      setAvgRating(parseFloat(avg.toFixed(2)));
      setRatingsCount(count);

      onSubmitted();
      alert("Thank you for your rating.");
    } catch (err) {
      console.error("Rating submit error:", err);
      alert("Failed to submit rating. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (mode === "read") {
    // Read-only: show avg + count
    return (
      <div className="flex items-center gap-3">
        {renderStars(avgRating)}
        <div className="text-sm text-gray-600">
          <span className="font-semibold">{avgRating ? avgRating.toFixed(1) : "0.0"}</span>
          <span> / 5</span>
          <span className="ml-2">({ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"})</span>
        </div>
      </div>
    );
  }

  // rate mode: interactive
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {stars.map((num) => (
          <button
            key={num}
            onMouseEnter={() => setHover(num)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setMyRating(num)}
            className={`text-3xl transition ${
              num <= (hover || myRating) ? "text-yellow-400 scale-110" : "text-gray-300"
            }`}
            aria-label={`rate-${num}`}
            type="button"
          >
            ★
          </button>
        ))}
      </div>

      <button
        onClick={submitRating}
        disabled={submitting || myRating < 1}
        className={`${
          submitting ? "opacity-70 cursor-not-allowed" : ""
        } bg-green-600 hover:bg-green-700 text-white rounded-full p-2 transition flex items-center justify-center`}
        title="Submit rating"
        type="button"
      >
        <FaUpload size={14} />
      </button>
    </div>
  );
};

export default ProductReview;
