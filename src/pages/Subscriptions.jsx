// src/components/Subscriptions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Subscriptions.module.css"; // keep your existing module css

import { ref, get } from "firebase/database";
import { db, auth } from "../firebase";
import { canActivateFreePlan } from "../utils/subscriptions";




const subscriptions = [
  {
    type: "Free",
    credits: 1,
    price: "Free",
    features: ["1 product upload", "Basic support"],
  },
  {
    type: "Starter",
    credits: 5,
    price: "$10 / month",
    features: ["5 product uploads", "Priority support", "Access to analytics"],
  },
  {
    type: "Pro",
    credits: 10,
    price: "$25 / month",
    features: [
      "10+ product uploads",
      "Priority support",
      "Verified seller badge",
      "Full analytics",
    ],
  },
];

const buyerPlan = {
  type: "Verified Buyer",
  price: "$15 / month",
  features: ["Verified profile", "Boosted visibility", "Contact sellers directly"],
};

const Subscriptions = () => {
  const [proCredits, setProCredits] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();
  const [freeLocked, setFreeLocked] = useState(false);


  // try to read seller ID from query string (header or seller dashboard should pass it)
  const queryParams = new URLSearchParams(location.search);
  const sellerUID = queryParams.get("seller") || null;


  useEffect(() => {
    const checkFreePlanStatus = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const snap = await get(ref(db, `users/sellers/${user.uid}`));
      if (snap.exists()) {
        const data = snap.val();
        const lastActivated = data?.lastFreePlanActivated;
        if (!canActivateFreePlan(lastActivated)) {
          setFreeLocked(true);
        }
      }
    };

    checkFreePlanStatus();
  }, []);


  // When user clicks Subscribe — redirect to payment page (pass plan + sellerUID + credits)
  const handleSubscribe = (plan) => {
    const credits = plan.type === "Pro" ? proCredits : plan.credits;
    const params = new URLSearchParams({
      plan: plan.type,
      credits: String(credits),
    });
    if (sellerUID) params.set("seller", sellerUID);

    // navigate to payment page — Payment component will handle writing to Firebase after (dummy) card entry
    navigate(`/subscriptions/pay?${params.toString()}`);
  };

  return (
    <div className={styles.container}>
      {/* Close button */}
      <div className={styles.closeButton} onClick={() => navigate("/")}>
        ×
      </div>

      <div className={styles.heading}>
        <h2 className={styles.title}>Subscription Plans</h2>
        <p className={styles.description}>
          Choose a plan that fits your needs. Sellers earn credits to upload
          products. Buyers can get verified and boost visibility.
        </p>
      </div>

      {/* Seller Plans */}
      <div className={styles.sellerGrid}>
        {subscriptions.map((plan) => (
          <div key={plan.type} className={styles.planCard}>
            <div className={styles.planHeader}>
              <h3 className={styles.planTitle}>{plan.type}</h3>
              {plan.type === "Pro" ? (
                <>
                  <p className={styles.planPrice}>
                    ${25 + (proCredits - 10) * 3} / month
                  </p>
                  <p className={styles.planCredits}>{proCredits} Credit(s) / month</p>
                </>
              ) : (
                <>
                  <p className={styles.planPrice}>
                    {plan.price === "Free" ? "$0 / month" : plan.price}
                  </p>
                  <p className={styles.planCredits}>
                    {plan.credits} Credit(s) / month
                  </p>
                </>
              )}
            </div>

            {plan.type === "Pro" && (
              <div className={styles.proSliderContainer}>
                <div className={styles.sliderWrapper}>
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={proCredits}
                    onChange={(e) => setProCredits(Number(e.target.value))}
                    className={styles.slider}
                  />
                  <div className={styles.ticks}>
                    {[10, 15, 20].map((num) => (
                      <span key={num} className={styles.tick}>
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}


            <ul className={styles.planFeatures}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <button
              className={`${styles.planButton} ${plan.type === "Free" && freeLocked ? styles.disabled : ""}`}
              onClick={() => {
                if (plan.type === "Free" && freeLocked) {
                  alert("You can only activate the Free plan once every 30 days.");
                  return;
                }
                handleSubscribe(plan);
              }}
              disabled={plan.type === "Free" && freeLocked}
            >
              {plan.type === "Free" && freeLocked ? "Locked (Wait 30 days)" : "Subscribe"}
            </button>

          </div>
        ))}
      </div>

      {/* Buyer Plan */}
      <div className={styles.buyerPlan}>
        <h3 className={styles.planTitle}>{buyerPlan.type}</h3>
        <div style={{ marginBottom: "0.75rem" }}></div>

        <p className={styles.planPrice}>{buyerPlan.price}</p>
        <ul className={styles.planFeatures}>
          {buyerPlan.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>

        {/* Two options: Paid or Free verification */}
        <div className={styles.buyerButtons}>
          <button
            className={styles.planButton}
            onClick={() => navigate("/subscriptions/pay?plan=VerifiedBuyer&type=paid")}
          >
            Subscribe & Get Verified
          </button>

          <button
            className={`${styles.planButton} ${styles.outlineButton}`}
            onClick={() => navigate("/permit-verification")}
          >
            Claim Free Verification
          </button>
        </div>
      </div>

    </div>
  );
};

export default Subscriptions;
