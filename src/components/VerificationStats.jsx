// src/components/VerificationStats.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";

const VerificationStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });

  useEffect(() => {
    const reqRef = ref(db, "permitVerifications");
    const unsubscribe = onValue(reqRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = Object.values(snapshot.val());
        const total = data.length;
        const approved = data.filter((d) => d.status === "Approved").length;
        const rejected = data.filter((d) => d.status === "Rejected").length;
        const pending = total - approved - rejected;
        setStats({ total, approved, rejected, pending });
      } else {
        setStats({ total: 0, approved: 0, pending: 0, rejected: 0 });
      }
    });
    return () => unsubscribe();
  }, []);

  const cardStyle =
    "bg-white shadow-md rounded-lg p-4 flex flex-col justify-center items-center w-48";

  return (
    <div className="flex flex-wrap gap-6">
      <div className={`${cardStyle} border-l-4 border-blue-500`}>
        <h4 className="text-gray-700 text-sm font-medium">Total</h4>
        <p className="text-xl font-bold text-blue-600">{stats.total}</p>
      </div>

      <div className={`${cardStyle} border-l-4 border-green-500`}>
        <h4 className="text-gray-700 text-sm font-medium">Approved</h4>
        <p className="text-xl font-bold text-green-600">{stats.approved}</p>
      </div>

      <div className={`${cardStyle} border-l-4 border-yellow-500`}>
        <h4 className="text-gray-700 text-sm font-medium">Pending</h4>
        <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
      </div>

      <div className={`${cardStyle} border-l-4 border-red-500`}>
        <h4 className="text-gray-700 text-sm font-medium">Rejected</h4>
        <p className="text-xl font-bold text-red-600">{stats.rejected}</p>
      </div>
    </div>
  );
};

export default VerificationStats;
