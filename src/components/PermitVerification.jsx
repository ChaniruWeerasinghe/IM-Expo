// src/components/PermitVerification.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ref, push, set } from "firebase/database";
import { db, auth } from "../firebase";

const PermitVerification = () => {
    const navigate = useNavigate();

    // form states
    const [fullName, setFullName] = useState("");
    const [company, setCompany] = useState("");
    const [email, setEmail] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [permitNumber, setPermitNumber] = useState("");
    const [organization, setOrganization] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [remarks, setRemarks] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const user = auth.currentUser;
        if (user) setEmail(user.email || "");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fullName || !company || !permitNumber || !organization || !contactNumber) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            setIsSubmitting(true);
            const user = auth.currentUser;
            if (!user) throw new Error("User not logged in.");

            const requestRef = push(ref(db, "permitVerifications"));
            await set(requestRef, {
                userId: user.uid,
                fullName,
                company,
                email,
                contactNumber,
                permitNumber,
                organization,
                expiryDate: expiryDate || "N/A",
                remarks: remarks || "N/A",
                status: "Pending",
                requestedAt: new Date().toISOString(),
            });

            // mark user as pending
            await set(ref(db, `users/buyers/${user.uid}/verification`), {
                status: "Pending",
                type: "free",
            });

            setSuccess(true);

            setTimeout(() => navigate(`/buyer/${user.uid}`), 2500);
        } catch (err) {
            console.error(err);
            alert("Error submitting verification request. Try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-16 px-6 flex items-center justify-center">
            <div className="w-full max-w-6xl bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100">
                {/* LEFT: Info Section */}
                <div className="md:w-1/2 bg-gradient-to-br from-green-500 to-blue-600 text-white p-10 flex flex-col justify-between">
                    <div>
                        <h2 className="text-3xl font-bold mb-4">About Verification</h2>
                        <p className="text-white/90 mb-6 leading-relaxed">
                            IM-Expo’s Buyer Verification process ensures authenticity and compliance with national
                            import/export regulations. Approved buyers are displayed with an
                            <span className="font-semibold text-white"> “Authorized Buyer” </span>
                            badge, granting them higher visibility and trust among sellers.
                        </p>

                        <h3 className="text-2xl font-semibold mb-3">Rules & Regulations</h3>
                        <ul className="list-disc list-inside text-white/90 space-y-2 text-sm leading-relaxed">
                            <li>All submitted information must be accurate and verifiable.</li>
                            <li>False or misleading details may lead to account suspension.</li>
                            <li>IM-Expo reserves the right to request additional proof or reject submissions.</li>
                            <li>Approved verifications remain valid for one year unless revoked.</li>
                            <li>Changes in permit status must be reported immediately.</li>
                        </ul>
                    </div>

                    {/* Badge Display */}
                    <div
                        style={{
                            marginTop: "0px",   // move UP 40px
                            marginLeft: "100px",   // move RIGHT 60px
                            marginBottom: "-25px",
                        }}
                    >
                        <img
                            src={require("../assets/badges/imexpo-verified-badge.png")}
                            alt="IM-Expo Verified Badge"
                            style={{ width: "280px", height: "auto" }}
                        />
                    </div>



                    <div className="mt-8 border-t border-white/20 pt-4 text-sm text-white/80">
                        <p>
                            Need help? Contact our verification team at{" "}
                            <span className="font-medium text-white underline">support@imexpo.lk</span>
                        </p>
                    </div>
                </div>

                {/* RIGHT: Form Section */}
                <div className="md:w-1/2 p-10">
                    <h2 className="text-3xl font-extrabold text-green-600 mb-3 text-center">
                        Claim Free Verification
                    </h2>
                    <p className="text-gray-600 text-center mb-8">
                        Have a valid government import/export permit? Fill this form to request free IM-Expo Buyer Verification.
                        Your request will be reviewed by our admin team.
                    </p>

                    {!success ? (
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                placeholder="Full Name *"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Company / Business Name *"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />

                            <input
                                type="email"
                                placeholder="Email Address"
                                className="border rounded-lg p-3 bg-gray-100 cursor-not-allowed"
                                value={email}
                                readOnly
                            />
                            <input
                                type="text"
                                placeholder="Contact Number *"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Permit / License Number *"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                                value={permitNumber}
                                onChange={(e) => setPermitNumber(e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Issuing Organization *"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                            />

                            <input
                                type="date"
                                placeholder="Permit Expiry Date"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                            />

                            <textarea
                                placeholder="Remarks or supporting information (optional)"
                                className="border rounded-lg p-3 focus:ring-2 focus:ring-green-400 md:col-span-2"
                                rows="3"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            ></textarea>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`md:col-span-2 w-full py-3 rounded-lg text-white font-semibold transition-all ${isSubmitting
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                                    }`}
                            >
                                {isSubmitting ? "Submitting..." : "Submit Verification Request"}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-green-600 font-semibold text-lg mb-4">
                                Your request has been submitted successfully!
                            </p>
                            <p className="text-gray-600">Redirecting to your dashboard...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PermitVerification;
