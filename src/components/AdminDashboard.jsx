import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { ref, get, set } from "firebase/database";

// Child components
import VerificationTable from "./VerificationTable";
import VerificationStats from "./VerificationStats";

// Import module styles
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("subscriptions");
  const [plans, setPlans] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch subscription plans
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

  // ✅ Edit plan data
  const handleEdit = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
    setPlans(updatedPlans);
  };

  // ✅ Save plan changes
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
      await set(
        ref(db, "plans"),
        plans.reduce((acc, p) => ({ ...acc, [p.id]: p }), {})
      );
      alert("✅ Plans updated successfully!");
    } catch (error) {
      console.error("Error updating plans:", error);
      alert("❌ Failed to update plans.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    navigate("/admin-login");
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div>
          <div className={styles.sidebarHeader}>Admin Panel</div>
          <nav className="flex flex-col mt-2">
            <button
              onClick={() => setActiveTab("subscriptions")}
              className={`${styles.navButton} ${
                activeTab === "subscriptions" ? styles.navActive : ""
              }`}
            >
              Manage Subscriptions
            </button>
            <button
              onClick={() => setActiveTab("verifications")}
              className={`${styles.navButton} ${
                activeTab === "verifications" ? styles.navActive : ""
              }`}
            >
              User Verifications
            </button>
          </nav>
        </div>

       <div className="p-3 border-t border-gray-300">
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.mainContent}>
        {activeTab === "subscriptions" && (
          <>
            <h2 className={styles.pageTitle}>Manage Subscription Plans</h2>
            {plans.length === 0 ? (
              <p>Loading plans...</p>
            ) : (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Plan</th>
                      <th>Credits</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans.map((plan, i) => (
                      <tr key={plan.id}>
                        <td className="font-medium text-gray-800">{plan.type}</td>
                        <td>
                          <input
                            type="number"
                            value={plan.credits}
                            onChange={(e) =>
                              handleEdit(i, "credits", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-20"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={plan.price}
                            onChange={(e) =>
                              handleEdit(i, "price", e.target.value)
                            }
                            className="border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button onClick={handleSave} className={styles.saveBtn}>
              Save Changes
            </button>
          </>
        )}

        {activeTab === "verifications" && (
          <div>
            <h2 className={styles.pageTitle}>Verification Management</h2>
            <VerificationStats />
            <div className="mt-6">
              <VerificationTable />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
