// src/components/TopVerifiedBuyers.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import verifiedIcon from "../assets/badges/imexpo-verified-icon.png";
import defaultAvatar from "../assets/badges/default-avatar.png";



const TopVerifiedBuyers = () => {
    const [verifiedBuyers, setVerifiedBuyers] = useState([]);

    useEffect(() => {
        const buyersRef = ref(db, "users/buyers");
        const subsRef = ref(db, "subscriptions");
        const permitsRef = ref(db, "permitVerifications");

        onValue(buyersRef, (buyerSnap) => {
            const buyersData = buyerSnap.val();
            if (!buyersData) {
                setVerifiedBuyers([]);
                return;
            }

            const allBuyers = Object.entries(buyersData).map(([id, val]) => ({
                id,
                ...val,
            }));

            // listen to both subs + permit verifications
            onValue(subsRef, (subsSnap) => {
                const subsData = subsSnap.val() || {};
                const verifiedByPlan = Object.keys(subsData).filter(
                    (key) =>
                        subsData[key].plan === "VerifiedBuyer" ||
                        subsData[key].plan === "Pro"
                );

                onValue(permitsRef, (permitSnap) => {
                    const permitData = permitSnap.val() || {};
                    const approvedByPermit = Object.values(permitData)
                        .filter((p) => p.status === "Approved")
                        .map((p) => p.userId);

                    // combine both sources
                    const verifiedIds = [...new Set([...verifiedByPlan, ...approvedByPermit])];

                    const verified = allBuyers
                        .filter(
                            (b) =>
                                (b.verification?.status === "Verified" ||
                                    verifiedIds.includes(b.uid)) &&
                                b.name && b.name.trim() !== "" // ✅ only show buyers with valid name
                        )

                        .sort((a, b) => (b.totalPurchases || 0) - (a.totalPurchases || 0))
                        .slice(0, 8);


                    setVerifiedBuyers(verified);
                });
            });
        });
    }, []);


    return (
        <section className="bg-gray-50 py-16 px-6 lg:px-12 border-t border-gray-200">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Top Verified Buyers
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                    Trusted buyers who regularly support verified sellers and maintain a strong purchase record on IM-Expo.
                </p>
            </div>

            {verifiedBuyers.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {verifiedBuyers.map((buyer) => (
                        <div
                            key={buyer.id}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition text-center"
                        >
                            <img
                                src={buyer.profileImage && buyer.profileImage.trim() !== "" ? buyer.profileImage : defaultAvatar}
                                alt={buyer.name || "Verified Buyer"}
                                className="w-24 h-24 mx-auto rounded-full mb-4 object-cover shadow-sm"
                            />


                            <h3 className="font-semibold text-lg text-gray-800">
                                {buyer.name || "Unnamed Buyer"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-2">
                                {buyer.country || "Sri Lanka"}
                            </p>

                            <div className="flex justify-center items-center gap-1 mb-3">
                                <img
                                    src={verifiedIcon}
                                    alt="Verified Badge"
                                    className="w-5 h-5"
                                />

                                <span className="text-cyan-600 font-medium text-sm">
                                    Verified Buyer
                                </span>
                            </div>

                            <p className="text-xs text-gray-500 mb-3">
                                {buyer.totalPurchases
                                    ? `${buyer.totalPurchases} Purchases`
                                    : "No data"}
                            </p>

                            <Link
                                to="#"
                                className="inline-block mt-2 px-4 py-2 bg-cyan-600 text-white text-sm font-medium rounded-lg hover:bg-cyan-700 transition"
                            >
                                Contact Buyer
                            </Link>

                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">
                    No verified buyers available yet.
                </p>
            )}
        </section>
    );
};

export default TopVerifiedBuyers;
