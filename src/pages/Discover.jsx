// src/pages/Discover.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";


// ---------------- Discover Page ----------------
const Discover = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]); // ✅ for search display
    const [searchTerm, setSearchTerm] = useState(""); // ✅ for live search input
    const [sellers, setSellers] = useState([]);
    const [visibleTrending, setVisibleTrending] = useState(5);
    const [visibleTopRated, setVisibleTopRated] = useState(5);
    const [visibleTopSelling, setVisibleTopSelling] = useState(5);
    const [topSellingProducts, setTopSellingProducts] = useState([]);

    // 🔹 Fetch Approved Orders + Product Details for Top Selling Section
    useEffect(() => {
        const ordersRef = ref(db, "orderRequests");
        const productsRef = ref(db, "products");

        // Read both orderRequests and products
        onValue(ordersRef, (orderSnap) => {
            const ordersData = orderSnap.val();
            if (!ordersData) return;

            onValue(productsRef, (productSnap) => {
                const productsData = productSnap.val();
                if (!productsData) return;

                // keep each product’s key for proper matching
                const productsArray = Object.entries(productsData).map(([key, value]) => ({
                    id: key,
                    ...value,
                }));

                const approvedOrders = Object.values(ordersData).filter(
                    (order) => order.status === "Approved"
                );

                // Merge orders with their matching product info
                const merged = approvedOrders.flatMap((order) => {
                    const matches = productsArray.filter(
                        (p) => p.id === order.productId || p.productId === order.productId
                    );

                    return matches.map((match) => ({
                        ...order,
                        productName: match?.name || order.productName || "Unnamed Product",
                        name: match?.name || order.productName || "Unnamed Product", // ✅ ensures ProductCard sees the name
                        productImage: match?.image || "/assets/default-product.png",
                        category: match?.category || "Uncategorized",
                    }));
                });



                // ✅ Remove duplicates by productId — only keep the highest quantity per product
                const uniqueProductsMap = new Map();

                merged.forEach((item) => {
                    const pid = item.productId;
                    if (!uniqueProductsMap.has(pid) || (item.quantity || 0) > (uniqueProductsMap.get(pid).quantity || 0)) {
                        uniqueProductsMap.set(pid, item);
                    }
                });

                const uniqueProducts = Array.from(uniqueProductsMap.values());

                // ✅ Sort by quantity descending
                const sorted = uniqueProducts
                    .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
                    .slice(0, 8);

                setTopSellingProducts(sorted);

            });
        });
    }, []);



    // 🔹 Fetch Products from Firebase
    useEffect(() => {



        const productsRef = ref(db, "products");
        onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const allProducts = Object.values(data);
                setProducts(allProducts);
                setFilteredProducts(allProducts); // initialize filtered
            }
        });
    }, []);

    // 🔹 Handle Live Search Filtering
    useEffect(() => {
        if (!searchTerm.trim()) {
            setFilteredProducts(products);
        } else {
            const lower = searchTerm.toLowerCase();
            const filtered = products.filter((p) =>
                (p.name && p.name.toLowerCase().includes(lower)) ||
                (p.category && p.category.toLowerCase().includes(lower)) ||
                (p.sellerName && p.sellerName.toLowerCase().includes(lower))
            );
            setFilteredProducts(filtered);
        }
    }, [searchTerm, products]);

    // 🔹 Fetch Verified Sellers
    useEffect(() => {
        const usersRef = ref(db, "users");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const verified = Object.values(data).filter((u) => u.verified === true);
                setSellers(verified);
            }
        });
    }, []);

    // 🔹 Sorting for Product Sections
    const trending = [...filteredProducts]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 8);

    const topRated = [...filteredProducts]
        .sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0))
        .slice(0, 8);





    return (
        <div className="font-roboto bg-gray-50 text-gray-800">
            <Header />

            {/* ---------------- Hero Section ---------------- */}
            <section className="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-center py-24 px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Discover Verified Sellers & Trending Creations
                </h1>
                <p className="text-lg max-w-2xl mx-auto mb-10">
                    Explore unique talents, verified importers, and export-ready products
                    from Sri Lanka and beyond.
                </p>

                {/* 🔍 Search Bar (Live Filtering) */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-3 w-full max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Search by product, category, or seller..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-3/4 px-4 py-3 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
            </section>

            {/* ---------------- Trending Products ---------------- */}
            <section className="py-16 px-6 lg:px-12">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Trending Products</h2>
                    <p className="text-gray-600">Most viewed items this week.</p>
                </div>

                {trending.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                            {trending.slice(0, visibleTrending).map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>

                        {visibleTrending < 15 && trending.length > visibleTrending && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setVisibleTrending((prev) => prev + 5)}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Explore More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-500">No trending products yet.</p>
                )}

            </section>

            {/* ---------------- Top Rated Products ---------------- */}
            <section className="py-16 px-6 lg:px-12 bg-gray-50 border-t border-gray-200">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Top Rated Products</h2>
                    <p className="text-gray-600">Highly rated by verified buyers.</p>
                </div>

                {topRated.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                            {topRated.slice(0, visibleTopRated).map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>

                        {visibleTopRated < 15 && topRated.length > visibleTopRated && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setVisibleTopRated((prev) => prev + 5)}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Explore More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-500">No top rated products yet.</p>
                )}

            </section>

            {/* ---------------- Top Selling Products ---------------- */}
            <section className="py-16 px-6 lg:px-12 bg-white border-t border-gray-200">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Top Selling Items</h2>
                    <p className="text-gray-600">Best performing products by sales volume.</p>
                </div>

                {topSellingProducts.length > 0 ? (
                    <>
                        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5">
                            {topSellingProducts.slice(0, visibleTopSelling).map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>

                        {visibleTopSelling < 15 && topSellingProducts.length > visibleTopSelling && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={() => setVisibleTopSelling((prev) => prev + 5)}
                                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                                >
                                    Explore More
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-gray-500">No top selling products yet.</p>
                )}


            </section>


            {/* ---------------- Top Verified Sellers ---------------- */}
            <section className="bg-white py-16 px-6 lg:px-12 border-t border-gray-200">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Top Verified Sellers
                    </h2>
                    <p className="text-gray-600">
                        Meet the most trusted and active sellers on IM-Expo.
                    </p>
                </div>

                {sellers.length > 0 ? (
                    <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {sellers.slice(0, 8).map((seller, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
                            >
                                <img
                                    src={seller.profileImage || "/assets/avatar.png"}
                                    alt={seller.name}
                                    className="w-24 h-24 mx-auto rounded-full mb-4 object-cover"
                                />
                                <h3 className="font-semibold text-lg text-gray-800">
                                    {seller.name}
                                </h3>
                                <p className="text-sm text-gray-500 mb-2">
                                    {seller.location || "Sri Lanka"}
                                </p>
                                <span className="inline-block bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                                    Verified Seller
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500">
                        No verified sellers available yet.
                    </p>
                )}
            </section>

            {/* ---------------- Categories ---------------- */}
            <section className="py-16 px-6 lg:px-12 bg-gray-50 border-t border-gray-200">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">
                        Explore by Category
                    </h2>
                    <p className="text-gray-600">
                        Discover local industries and creative sectors on IM-Expo.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {[
                        "Handicrafts",
                        "Apparel",
                        "Agriculture",
                        "Art & Design",
                        "Technology",
                        "Services",
                    ].map((cat, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-sm rounded-xl p-6 text-center hover:shadow-md transition"
                        >
                            <div className="text-green-600 text-3xl mb-3">🟢</div>
                            <p className="font-medium text-gray-800">{cat}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- How It Works ---------------- */}
            <section className="bg-white py-20 px-6 lg:px-12 border-t border-gray-200">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                        How IM-Expo Works
                    </h2>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition">
                            <h3 className="text-green-600 font-semibold text-xl mb-3">
                                1. Showcase Your Work
                            </h3>
                            <p className="text-gray-600">
                                Upload your creations and publish them for buyers and importers
                                worldwide.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition">
                            <h3 className="text-green-600 font-semibold text-xl mb-3">
                                2. Connect with Verified Buyers
                            </h3>
                            <p className="text-gray-600">
                                Communicate directly with verified buyers and build genuine
                                trade partnerships.
                            </p>
                        </div>

                        <div className="p-6 rounded-xl bg-gray-50 shadow-sm hover:shadow-md transition">
                            <h3 className="text-green-600 font-semibold text-xl mb-3">
                                3. Earn & Grow
                            </h3>
                            <p className="text-gray-600">
                                Manage your subscriptions, boost products, and expand your
                                business reach.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-wrap justify-center gap-4">
                        <Link
                            to="/signup"
                            className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 transition"
                        >
                            Join as Seller
                        </Link>
                        <Link
                            to="/portfolio"
                            className="border border-green-500 text-green-600 px-8 py-3 rounded-lg hover:bg-green-50 transition"
                        >
                            Explore as Buyer
                        </Link>
                    </div>
                </div>
            </section>

            {/* ---------------- CTA Footer ---------------- */}
            <section className="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-center py-20 px-6">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                    Ready to Showcase Your Talent?
                </h2>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        to="/signup"
                        className="bg-white text-green-600 font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition"
                    >
                        Create Seller Account
                    </Link>
                    <Link
                        to="/portfolio"
                        className="border border-white text-white font-medium px-8 py-3 rounded-lg hover:bg-green-600 transition"
                    >
                        Explore Products
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Discover;
