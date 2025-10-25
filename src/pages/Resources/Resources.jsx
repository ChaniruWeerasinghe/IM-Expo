import React, { useState } from "react";
import BlogCard from "./BlogCard";
import { resources } from "./resourcesData";

const categories = ["All", "Export/Import Guides", "Seller Tips", "Buyer Insights"];

const Resources = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredResources =
    activeCategory === "All"
      ? resources
      : resources.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-12">

      

      {/* 🌟 How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">
          How IM-Expo Works
        </h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-12">
          IM-Expo connects verified buyers and sellers directly, eliminating middlemen and making global trade safe, simple, and profitable. Here’s how you can get started:
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Steps 1–6 */}
          {[
            {
              title: "1. Create Your Profile",
              desc: "Sign up as a seller or buyer and complete your verification to get a TrustScore badge. Verified accounts build trust with every connection."
            },
            {
              title: "2. Upload Products or Requests",
              desc: "Sellers upload products or services with images, descriptions, and categories. Buyers can post Requests for Quotation (RFQs) for what they need."
            },
            {
              title: "3. Connect Directly",
              desc: "Use our secure messaging system to negotiate deals, clarify details, and agree on terms — all verified and transparent, without middlemen."
            },
            {
              title: "4. Close Deals Safely",
              desc: "Track transactions, manage orders, and optionally use escrow services for extra security. Keep your profits without unnecessary fees."
            },
            {
              title: "5. Grow With Insights",
              desc: "Access market trends, popular products, and trade analytics to make smarter business decisions and expand globally."
            },
            {
              title: "6. Build Your Reputation",
              desc: "Earn reviews and increase your TrustScore to attract more verified buyers or sellers. Your reputation becomes your currency."
            },
          ].map((step, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-green-600 text-xl font-semibold mb-4">{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Resources & Guides</h1>
        <p className="mt-4 text-gray-600">
          Stay informed with export/import regulations, seller tips, and business insights for buyers.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center space-x-4 mb-8 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium text-sm transition-colors duration-300 ${
              activeCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>


      {/* Resources Grid */}
      <section id="resource-grid" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredResources.map((item) => (
          <BlogCard
            key={item.id}
            title={item.title}
            description={item.description}
            category={item.category}
            link={item.link}
          />
        ))}
      </section>
    </div>
  );
};

export default Resources;
