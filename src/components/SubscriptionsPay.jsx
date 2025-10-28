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
  const plan = qp.get("plan") || "Free";       // "Free" | "Starter" | "Pro"
  const creditsParam = Number(qp.get("credits")) || 1; // slider value for Pro, else fixed
  const sellerUID = qp.get("seller") || auth.currentUser?.uid || null;

  // Normalize credits to plan rules (don’t trust URL blindly)
  const maxCredits = planMonthlyCredits(plan, creditsParam);

  useEffect(() => {
    if (!sellerUID) {
      setError("Missing seller ID. Please open subscriptions from your dashboard.");
    }
  }, [sellerUID]);

  const confirmAndApply = async () => {
    if (!sellerUID) return;
    setSaving(true);
    setError("");

    try {
      const subRef = ref(db, `subscriptions/sellers/${sellerUID}`);
      const nowISO = new Date().toISOString();

      const payload = {
        plan,                    // plan name
        maxCredits,              // plan cap
        credits: maxCredits,     // reset to plan cap (NO carry-over)
        status: "active",        // activate immediately
        lastPaymentAt: nowISO,   // used by 30/37-day status logic
        lastReset: nowISO,       // align monthly reset anchor to now
        updatedAt: serverTimestamp(),
      };

      const snap = await get(subRef);
      if (snap.exists()) {
        await update(subRef, payload);
      } else {
        await set(subRef, payload);
      }

      // Go back to Seller Dashboard (or wherever you want)
      navigate(`/seller/${sellerUID}`);
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
        <p><b>Monthly uploads:</b> {maxCredits}</p>
        {plan === "Pro" && <p><b>Selected Pro cap:</b> {creditsParam}</p>}
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
