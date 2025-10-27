// src/components/Subscriptions.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "./Subscriptions.module.css"; // keep your existing module css

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

  // try to read seller ID from query string (header or seller dashboard should pass it)
  const queryParams = new URLSearchParams(location.search);
  const sellerUID = queryParams.get("seller") || null;

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
            <h3 className={styles.planTitle}>{plan.type}</h3>

            {/* Dynamic pricing for Pro plan */}
            {plan.type === "Pro" ? (
              <div className={styles.proSliderContainer}>
                <p className={styles.planPrice}>
                  ${25 + (proCredits - 10) * 3} / month
                </p>
                <p className={styles.planCredits}>{proCredits} Credit(s)</p>
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
            ) : (
              <>
                <p className={styles.planPrice}>{plan.price}</p>
                <p className={styles.planCredits}>{plan.credits} Credit(s)</p>
              </>
            )}

            <ul className={styles.planFeatures}>
              {plan.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>

            <button
              className={styles.planButton}
              onClick={() => handleSubscribe(plan)}
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {/* Buyer Plan */}
      <div className={styles.buyerPlan}>
        <h3 className={styles.planTitle}>{buyerPlan.type}</h3>
        <p className={styles.planPrice}>{buyerPlan.price}</p>
        <ul className={styles.planFeatures}>
          {buyerPlan.features.map((feature, idx) => (
            <li key={idx}>{feature}</li>
          ))}
        </ul>
        <button className={styles.planButton} onClick={() => navigate("/subscriptions/buyer")}>
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Subscriptions;
