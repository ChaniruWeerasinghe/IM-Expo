export const imexpoData = {
  platform: {
    name: "IM-Expo",
    tagline: "Show your colors — connect, trade, and grow globally.",
    mission:
      "To empower Sri Lankan sellers and buyers to showcase their talent and products globally through a verified and trusted import/export platform.",
  },

  features: {
    sellers: [
      "Upload and publish products using credits.",
      "Access the Seller Dashboard to manage listings, analytics, and transactions.",
      "Upgrade plans to unlock more uploads and boosts.",
      "Earn IM-Expo Verified status after successful transactions.",
    ],
    buyers: [
      "Browse and filter verified products and sellers.",
      "Contact sellers directly to start trade discussions.",
      "Apply for buyer verification with import/export permits.",
      "Manage transactions and track orders in the Buyer Dashboard.",
    ],
    verification: {
      overview:
        "Verification adds a green badge showing authenticity and reliability.",
      criteria: [
        "Complete 10+ successful transactions OR submit valid business documents.",
        "Verification is reviewed manually and shown on profile and products.",
      ],
      benefits: [
        "Higher visibility in search and Discover pages.",
        "Builds trust with global buyers and sellers.",
      ],
    },
  },

  subscriptions: {
    overview:
      "Plans unlock upload credits and visibility features. Each credit allows 1 product to be published.",
    plans: [
      { name: "Free", credits: 1, price: 0, features: ["1 upload credit"] },
      {
        name: "Basic",
        credits: 5,
        price: "LKR 1000",
        features: ["5 uploads", "verified eligibility", "basic visibility"],
      },
      {
        name: "Pro",
        credits: 10,
        price: "LKR 2500",
        features: ["10 uploads", "boost discounts", "premium placement"],
      },
      {
        name: "Premium",
        credits: 20,
        price: "LKR 5000",
        features: ["20 uploads", "priority boosts", "verified support"],
      },
    ],
  },

  boosts: {
    description:
      "Boosts promote products for higher exposure in Discover and category listings.",
    durations: [
      "1 day — quick highlight",
      "7 days — standard promotion",
      "30 days — premium visibility",
    ],
    payment: "Boosts can be paid using cards, mobile, or credits.",
  },

  transactions: {
    overview:
      "Transactions record all trade activity between buyers and sellers.",
    sections: [
      "Ongoing orders with real-time tracking",
      "Completed transactions with invoices",
      "Payment and refund details",
    ],
  },

  support: {
    email: "support@im-expo.com",
    contactPage: "/contact",
    faqTopics: [
      "Uploading products",
      "Subscription plans",
      "Verification process",
      "Boosting and promotions",
      "Transactions and refunds",
    ],
  },
};
