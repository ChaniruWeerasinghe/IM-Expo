import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import verifiedIcon from "../assets/badges/imexpo-verified-icon.png";
import defaultAvatar from "../assets/badges/default-avatar.png";

const TopVerifiedSellers = () => {
    const [verifiedSellers, setVerifiedSellers] = useState([]);

    useEffect(() => {
        const sellersRef = ref(db, "users/sellers");
        const permitsRef = ref(db, "permitVerifications");

        const collectVerified = (data, approvedIds) => {
            if (!data) return [];
            return Object.entries(data)
                .map(([id, val]) => ({ id, ...val }))
                .filter(
                    (user) =>
                        (approvedIds.includes(user.uid) ||
                            user.verification?.status === "Verified" ||
                            user.isVerified === true) &&
                        user.name &&
                        user.name.trim() !== "" // ✅ only show sellers with a valid name
                );

        };

        onValue(permitsRef, (permitSnap) => {
            const permitData = permitSnap.val();
            const approvedIds = permitData
                ? Object.values(permitData)
                    .filter((p) => p.status === "Approved")
                    .map((p) => p.userId)
                : [];

            onValue(sellersRef, (sellerSnap) => {
                const verifiedSellers = collectVerified(sellerSnap.val(), approvedIds)
                    .sort((a, b) => (b.totalTransactions || 0) - (a.totalTransactions || 0))
                    .slice(0, 8);
                setVerifiedSellers(verifiedSellers);
            });
        });
    }, []);


    return (
        <section className="bg-gray-50 py-16 px-6 lg:px-12 border-t border-gray-200">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Top Verified Sellers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Meet the most trusted and active sellers on IM-Expo. These creators
                    have earned their verified badges through consistent, high-quality
                    trade activity.
                </p>
            </div>

            {verifiedSellers.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {verifiedSellers.map((seller) => (
                        <div
                            key={seller.id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
                        >
                            <img
                                src={
                                    seller.profileImage && seller.profileImage.trim() !== ""
                                        ? seller.profileImage
                                        : defaultAvatar
                                }
                                alt={seller.name || "Verified Seller"}
                                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover shadow-sm"
                            />

                            <h3 className="font-semibold text-lg text-gray-800">
                                {seller.name || "Unnamed Seller"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                                {seller.location || "Sri Lanka"}
                            </p>

                            <div className="flex justify-center items-center gap-1 mb-3">
                                <img
                                    src={verifiedIcon}
                                    alt="Verified Badge"
                                    className="w-5 h-5"
                                />
                                <span className="text-green-600 font-medium text-sm">
                                    Verified Seller
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-3">
                                {seller.totalTransactions
                                    ? `${seller.totalTransactions} Transactions`
                                    : "No data"}
                            </p>

                            <Link
                                to={`/portfolio/${seller.id}`}
                                className="inline-block mt-2 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition"
                            >
                                View Portfolio
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    No verified sellers available yet.
                </p>
            )}
        </section>
    );
};

export default TopVerifiedSellers;
