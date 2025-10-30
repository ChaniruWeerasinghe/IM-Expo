// src/components/CategoryExplorer.jsx
import React from "react";
import { ArrowRight } from "lucide-react";
import Lottie from "lottie-react";

// Import Lottie animation JSONs (rename your files to match these)
import beveragesAnim from "../assets/categories/beverages.json";
import homegoodsAnim from "../assets/categories/homegoods.json";
import apparelAnim from "../assets/categories/apparel.json";
import snacksAnim from "../assets/categories/snacks.json";
import spicesAnim from "../assets/categories/spices.json";
import industrialAnim from "../assets/categories/industrial.json";
import ecoAnim from "../assets/categories/eco.json";
import foodbeveragesAnim from "../assets/categories/foodbeverages.json";
import handicraftsAnim from "../assets/categories/handicrafts.json";
import homegardenAnim from "../assets/categories/homegarden.json";
import beautywellnessAnim from "../assets/categories/beautywellness.json";

const categories = [
    {
        name: "Beverages",
        description: "Local and export-ready beverage creations and innovations.",
        color: "bg-[#C9ECFF]",
        anim: beveragesAnim,
    },
    {
        name: "Home Goods",
        description: "High-quality domestic products for modern living spaces.",
        color: "bg-[#FFD6F3]",
        anim: homegoodsAnim,
    },
    {
        name: "Apparel",
        description: "Sri Lankan apparel and textile craftsmanship with global appeal.",
        color: "bg-[#D8F5D3]",
        anim: apparelAnim,
    },
    {
        name: "Snacks",
        description: "Authentic local snacks and packaged delicacies ready for export.",
        color: "bg-[#FFE9B8]",
        anim: snacksAnim,
    },
    {
        name: "Spices",
        description: "Famous Ceylon spices and organic seasoning products.",
        color: "bg-[#E7D8FF]",
        anim: spicesAnim,
    },
    {
        name: "Industrial Goods",
        description: "Machinery, materials, and manufacturing solutions from Sri Lanka.",
        color: "bg-[#C7F5E3]",
        anim: industrialAnim,
    },
    {
        name: "Eco Products",
        description: "Sustainable, eco-friendly innovations for a greener future.",
        color: "bg-[#FFF3C9]",
        anim: ecoAnim,
    },
    {
        name: "Food & Beverages",
        description: "Export-grade food and drink from local entrepreneurs.",
        color: "bg-[#D4E2FF]",
        anim: foodbeveragesAnim,
    },
    {
        name: "Handicrafts",
        description: "Cultural and handmade creations representing Sri Lankan artistry.",
        color: "bg-[#FFD6E8]",
        anim: handicraftsAnim,
    },
    {
        name: "Home & Garden",
        description: "Furniture, decor, and gardening innovations from local makers.",
        color: "bg-[#E8FFD6]",
        anim: homegardenAnim,
    },
    {
        name: "Beauty & Wellness",
        description: "Natural cosmetics and wellness products rooted in tradition.",
        color: "bg-[#F5E8FF]",
        anim: beautywellnessAnim,
    },
];

const CategoryExplorer = () => {
    return (
        <section className="py-20 px-0 md:px-0 bg-white relative overflow-hidden">
            <div
                className="w-full max-w-[1600px] mx-auto"
                style={{
                    marginLeft: "var(--category-offset, 60px)",
                    marginRight: "var(--category-right-offset, -120px)",
                }}
            >

                {/* ---- Section Header ---- */}
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-[2.75rem] md:text-[3.25rem] font-extrabold text-gray-900 leading-tight">
                            Explore by Category
                        </h2>
                        <p className="text-[1.125rem] text-gray-600 mt-3 max-w-2xl leading-relaxed">
                            Browse a diverse range of Sri Lankan industries, creative makers, and export-ready brands.
                            Discover authentic craftsmanship, sustainability, and innovation across multiple product categories on IM-Expo.
                        </p>

                    </div>

                    {/* Scroll Buttons - now adjustable left side */}
                    <div
                        className="hidden md:flex gap-3"
                        style={{
                            position: "relative",
                            left: "var(--arrow-left-shift, 0px)",
                        }}
                    >
                        <button
                            id="scrollLeft"
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-700"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button
                            id="scrollRight"
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5 text-gray-900"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                </div>

                {/* ---- Scrollable Cards ---- */}
                <div
                    id="categoryScroll"
                    className="flex gap-6 overflow-x-auto overflow-y-hidden scroll-smooth pb-4 hide-scrollbar px-[60px]"
                    style={{
                        width: "calc(100% + 120px)",
                        marginLeft: "-60px",
                    }}
                >



                    {categories.map((cat, index) => (
                        <div
                            key={index}
                            className={`${cat.color} rounded-2xl flex-shrink-0 w-[280px] md:w-[320px] h-[380px] p-6 relative hover:shadow-lg transition-transform hover:-translate-y-1`}
                        >
                            {/* Arrow in top-right */}
                            <ArrowRight className="absolute top-6 right-6 text-gray-700 w-5 h-5" />

                            {/* Title + Description */}
                            <div>
                                <h3 className="text-[1.35rem] font-bold text-gray-900 mb-3 leading-snug">
                                    {cat.name}
                                </h3>
                                <p className="text-gray-700 text-[1rem] leading-relaxed line-clamp-3">
                                    {cat.description}
                                </p>

                            </div>

                            {/* Animation (individual adjustments for each category) */}
                            <div
                                className={`absolute left-1/2 transform -translate-x-1/2 flex justify-center items-end ${[
                                    "bottom-[0px]",   // 1. Beverages
                                    "bottom-[-70px]", // 2. Home Goods
                                    "bottom-[-40px]", // 3. Apparel
                                    "bottom-[5px]",   // 4. Snacks
                                    "bottom-[-65px]", // 5. Spices
                                    "bottom-[-15px]",   // 6. Industrial Goods
                                    "bottom-[-3px]",  // 7. Eco Products
                                    "bottom-[-30px]",   // 8. Food & Beverages
                                    "bottom-[-25px]", // 9. Handicrafts
                                    "bottom-[-5px]",  // 10. Home & Garden
                                    "bottom-[-35px]", // 11. Beauty & Wellness
                                ][index]
                                    }`}
                            >
                                <Lottie
                                    animationData={cat.anim}
                                    loop
                                    autoplay
                                    className={`object-contain ${[
                                        "w-56 h-56 md:w-64 md:h-64", // 1. Beverages
                                        "w-72 h-72 md:w-80 md:h-80", // 2. Home Goods
                                        "w-72 h-72 md:w-80 md:h-80", // 3. Apparel
                                        "w-60 h-60 md:w-68 md:h-68", // 4. Snacks
                                        "w-80 h-80 md:w-96 md:h-96", // 5. Spices
                                        "w-60 h-60 md:w-50 md:h-68", // 6. Industrial Goods
                                        "w-64 h-64 md:w-72 md:h-72", // 7. Eco Products
                                        "w-56 h-56 md:w-64 md:h-64", // 8. Food & Beverages
                                        "w-72 h-72 md:w-80 md:h-80", // 9. Handicrafts (moderately larger)
                                        "w-64 h-64 md:w-62 md:h-72", // 10. Home & Garden
                                        "w-72 h-72 md:w-80 md:h-80", // 11. Beauty & Wellness
                                    ][index]
                                        }`}
                                />
                            </div>




                        </div>
                    ))}
                </div>
            </div>

            {/* JS Scroll Control */}
            <script>{`
      const scrollContainer = document.getElementById('categoryScroll');
      const btnLeft = document.getElementById('scrollLeft');
      const btnRight = document.getElementById('scrollRight');
      if (btnLeft && btnRight && scrollContainer) {
        btnLeft.onclick = () => scrollContainer.scrollBy({ left: -300, behavior: 'smooth' });
        btnRight.onclick = () => scrollContainer.scrollBy({ left: 300, behavior: 'smooth' });
      }
    `}</script>
        </section>
    );

};

export default CategoryExplorer;
