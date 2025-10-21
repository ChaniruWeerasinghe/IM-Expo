import React from "react";

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
    features: ["10 product uploads", "Priority support", "Verified seller badge", "Full analytics"],
  },
];

const buyerPlan = {
  type: "Verified Buyer",
  price: "$15 / month",
  features: ["Verified profile", "Boosted visibility", "Contact sellers directly"],
};

const Subscriptions = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Subscription Plans
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Choose a plan that fits your needs. Sellers earn credits to upload
          products. Buyers can get verified and boost visibility.
        </p>
      </div>

      {/* Seller Plans */}
      <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto">
        {subscriptions.map((plan) => (
          <div
            key={plan.type}
            className="bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between hover:shadow-2xl transition"
          >
            <h3 className="text-xl font-semibold text-gray-800">{plan.type}</h3>
            <p className="mt-4 text-3xl font-bold text-gray-900">{plan.price}</p>
            <p className="mt-2 text-gray-500">{plan.credits} Credit(s)</p>
            <ul className="mt-4 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-gray-600">
                  • {feature}
                </li>
              ))}
            </ul>
            <button className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Subscribe
            </button>
          </div>
        ))}
      </div>

      {/* Buyer Plan */}
      <div className="mt-16 max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-2xl transition">
        <h3 className="text-2xl font-semibold text-gray-800">{buyerPlan.type}</h3>
        <p className="mt-4 text-3xl font-bold text-gray-900">{buyerPlan.price}</p>
        <ul className="mt-4 space-y-2">
          {buyerPlan.features.map((feature, idx) => (
            <li key={idx} className="text-gray-600">
              • {feature}
            </li>
          ))}
        </ul>
        <button className="mt-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Subscriptions;
