// src/components/SubscriptionsPay.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, get, set, update, serverTimestamp } from "firebase/database";
import { db, auth } from "../firebase";
import { planMonthlyCredits } from "../utils/subscriptions";

export default function SubscriptionsPay() {
  const location = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const qp = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const plan = qp.get("plan") || "Free"; // "Free" | "Starter" | "Pro" | "VerifiedBuyer"
  const creditsParam = Number(qp.get("credits")) || 1;
  const sellerUID = qp.get("seller") || auth.currentUser?.uid || null;

  const maxCredits = planMonthlyCredits(plan, creditsParam);

  useEffect(() => {
    if (!sellerUID) {
      setError("Missing user ID. Please open subscriptions from your dashboard.");
    }
  }, [sellerUID]);

  const confirmAndApply = async () => {
    if (!sellerUID) return;
    setSaving(true);
    setError("");

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated.");
      const nowISO = new Date().toISOString();

      // Check if user exists as buyer or seller in DB
      const buyerSnap = await get(ref(db, `users/buyers/${user.uid}`));
      const sellerSnap = await get(ref(db, `users/sellers/${user.uid}`));

      // ✅ Case 1: Buyer subscribing for Verified Badge
      if (plan === "VerifiedBuyer" || buyerSnap.exists()) {
        const buyerRef = ref(db, `users/buyers/${user.uid}/verification`);
        const verifyData = {
          status: "Verified",
          type: "paid",
          subscribedAt: nowISO,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };
        await set(buyerRef, verifyData);

        alert("✅ You are now an IM-Expo Verified Buyer!");

        // ✅ Redirect buyer after alert confirmation
        setTimeout(() => {
          navigate(`/buyer/${user.uid}`);
        }, 300);

        return;
      }

      // ✅ Case 2: Seller subscribing for upload credits
      if (sellerSnap.exists()) {
        const subRef = ref(db, `subscriptions/sellers/${sellerUID}`);
        const payload = {
          plan,
          maxCredits,
          credits: maxCredits,
          status: "active",
          lastPaymentAt: nowISO,
          lastReset: nowISO,
          updatedAt: serverTimestamp(),
        };

        const snap = await get(subRef);
        if (snap.exists()) await update(subRef, payload);
        else await set(subRef, payload);

        alert("✅ Subscription activated successfully!");

        // ✅ Redirect seller after alert confirmation
        setTimeout(() => {
          navigate(`/seller/${sellerUID}`);
        }, 300);

        return;
      }

      // Fallback — unknown user type
      alert("User role not identified. Please re-login and try again.");
      navigate("/");
    } catch (e) {
      console.error(e);
      setError("Failed to activate the plan. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Confirm Subscription</h1>
      <div className="rounded-lg border p-4 bg-white">
        <p><b>Plan:</b> {plan}</p>
        {plan === "VerifiedBuyer" ? (
          <p><b>Type:</b> Buyer Verification Subscription</p>
        ) : (
          <>
            <p><b>Monthly uploads:</b> {maxCredits}</p>
            {plan === "Pro" && <p><b>Selected Pro cap:</b> {creditsParam}</p>}
          </>
        )}
      </div>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      <div className="mt-6 flex gap-3">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          Back
        </button>
        <button
          className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
          onClick={confirmAndApply}
          disabled={saving || !sellerUID}
        >
          {saving ? "Applying…" : "Confirm & Activate"}
        </button>
      </div>
    </div>
  );
}
