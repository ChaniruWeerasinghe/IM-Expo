// src/utils/subscriptions.js
export const planMonthlyCredits = (plan, maxCredits) => {
  if (plan === "Free") return 1;
  if (plan === "Starter") return 5;
  if (plan === "Pro") {
    const n = Number(maxCredits) || 10;
    return Math.max(10, Math.min(n, 20)); // clamp 10–20
  }
  return 1;
};


// Identify buyer verification type
export const verificationType = (hasPermit) => {
  return hasPermit ? "free" : "paid";
};


// ✅ Prevent Free plan reactivation before 30 days (supports ISO or millis)
export const canActivateFreePlan = (lastActivated) => {
  if (!lastActivated) return true;
  const last =
    typeof lastActivated === "number" ? new Date(lastActivated) : new Date(lastActivated);
  const diffDays = (Date.now() - last.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 30;
};

