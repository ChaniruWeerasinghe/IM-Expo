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
