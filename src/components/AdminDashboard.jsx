import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, set } from "firebase/database";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch subscription plans from Firebase
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const snapshot = await get(ref(db, "plans"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const planList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setPlans(planList);
        } else {
          // Default seed data
          const defaultPlans = [
            { id: "1", type: "Free", credits: 1, price: "Free" },
            { id: "2", type: "Starter", credits: 5, price: "$10 / month" },
            { id: "3", type: "Pro", credits: 10, price: "$25 / month" },
          ];
          setPlans(defaultPlans);
          await set(ref(db, "plans"), {
            1: defaultPlans[0],
            2: defaultPlans[1],
            3: defaultPlans[2],
          });
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      }
    };
    fetchPlans();
  }, []);

  // ✅ Edit local plan data
  const handleEdit = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };

  // ✅ Save plan changes back to Firebase
  const handleSave = async () => {
    try {
      const updates = {};
      plans.forEach((plan) => {
        updates[`plans/${plan.id}`] = {
          type: plan.type,
          credits: plan.credits,
          price: plan.price,
        };
      });
      await set(ref(db, "plans"), plans.reduce((acc, p) => ({ ...acc, [p.id]: p }), {}));
      alert("✅ Plans updated successfully!");
    } catch (error) {
      console.error("Error updating plans:", error);
      alert("❌ Failed to update plans.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    navigate("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-green-600 text-white flex flex-col justify-between">
        <div>
          <div className="p-4 text-center font-bold text-2xl border-b border-green-500">
            Admin Panel
          </div>
          <nav className="flex flex-col mt-4">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`px-6 py-3 text-left hover:bg-green-700 ${
                activeTab === "subscriptions" ? "bg-green-700" : ""
              }`}
            >
              Manage Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("verifications")}
              className={`px-6 py-3 text-left hover:bg-green-700 ${
                activeTab === "verifications" ? "bg-green-700" : ""
              }`}
            >
              User Verifications
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-green-500">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white w-full py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        {activeTab === "subscriptions" && (
          <>
            <h2 className="text-2xl font-bold mb-6">Manage Subscription Plans</h2>
            {plans.length === 0 ? (
              <p>Loading plans...</p>
            ) : (
              <table className="min-w-full border rounded-lg bg-white">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="border px-4 py-2">Plan</th>
                    <th className="border px-4 py-2">Credits</th>
                    <th className="border px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan, i) => (
                    <tr key={plan.id}>
                      <td className="border px-4 py-2 font-medium text-gray-800">
                        {plan.type}
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="number"
                          value={plan.credits}
                          onChange={(e) => handleEdit(i, "credits", e.target.value)}
                          className="border rounded px-2 py-1 w-20"
                        />
                      </td>
                      <td className="border px-4 py-2">
                        <input
                          type="text"
                          value={plan.price}
                          onChange={(e) => handleEdit(i, "price", e.target.value)}
                          className="border rounded px-2 py-1"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <button
              onClick={handleSave}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded"
            >
              Save Changes
            </button>
          </>
        )}

        {activeTab === "verifications" && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Pending Verifications</h2>
            <p className="text-gray-700">
              This is where admins can review uploaded documents from sellers and buyers.
              (We’ll connect this to Firebase later.)
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
