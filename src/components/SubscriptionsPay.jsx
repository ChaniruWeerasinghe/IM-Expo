// src/components/SubscriptionsPay.jsx
import React, { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, get, set, update, serverTimestamp } from "firebase/database";
import { db, auth } from "../firebase";
import { planMonthlyCredits } from "../utils/subscriptions";
import { canActivateFreePlan } from "../utils/subscriptions";
import { runTransaction } from "firebase/database";
import styles from "./SubscriptionsPay.module.css";




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

        // ✅ Mark seller as verified when subscribed
        await set(ref(db, `users/sellers/${sellerUID}/verification`), {
          status: "Verified",
          type: "paid",
          subscribedAt: nowISO,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        });

        alert("✅ Subscription activated & seller verified successfully!");

        // ✅ Redirect seller after alert confirmation
        setTimeout(() => {
          navigate(`/seller/${sellerUID}`);
        }, 300);


        return;
      }

      // ✅ Case 2: Seller subscribing for upload credits
      if (sellerSnap.exists()) {
        const subRef = ref(db, `subscriptions/sellers/${sellerUID}`);

        // Use a transaction so the check+write is atomic
        const result = await runTransaction(subRef, (current) => {
          const nowMs = Date.now();

          // Initialize if empty
          if (!current) {
            current = {
              plan: "Free",
              status: "active",
              maxCredits: 1,
              credits: 1,
              lastReset: new Date(nowMs).toISOString(),
              lastFreePlanActivated: null, // will be millis when set
            };
          }

          if (plan === "Free") {
            if (current.lastFreePlanActivated) {
              const diffDays = (nowMs - current.lastFreePlanActivated) / (1000 * 60 * 60 * 24);
              if (diffDays < 30) {
                // Abort by returning current unchanged
                return current;
              }
            }

            // Allow Free plan once per 30 days
            return {
              plan: "Free",
              maxCredits: 1,
              credits: 1,
              status: "active",
              lastPaymentAt: new Date(nowMs).toISOString(),
              lastReset: new Date(nowMs).toISOString(),
              updatedAt: nowMs,
              lastFreePlanActivated: nowMs, // 🔴 store MILLIS
            };
          }

          // Paid plans (Starter/Pro)
          return {
            plan,
            maxCredits,
            credits: maxCredits,
            status: "active",
            lastPaymentAt: new Date(nowMs).toISOString(),
            lastReset: new Date(nowMs).toISOString(),
            updatedAt: nowMs,
            lastFreePlanActivated: current.lastFreePlanActivated || null,
          };
        });

        // If user attempted Free inside 30 days, state will be unchanged
        const finalSnap = await get(subRef);
        const finalData = finalSnap.val() || {};
        if (plan === "Free") {
          const last = finalData.lastFreePlanActivated;
          const ok = canActivateFreePlan(last);
          if (!ok) {
            alert("You can only activate the Free plan once every 30 days.");
            setSaving(false);
            return;
          }
        }

        alert("✅ Subscription activated successfully!");
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
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Confirm Subscription</h1>

        <div className={styles.planBox}>
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

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.buttonRow}>
          <button
            className={`${styles.btn} ${styles.btnBack}`}
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Back
          </button>

          <button
            className={`${styles.btn} ${styles.btnConfirm}`}
            onClick={confirmAndApply}
            disabled={saving || !sellerUID}
          >
            {saving ? "Applying…" : "Confirm & Activate"}
          </button>
        </div>
      </div>
    </div>
  );

}
