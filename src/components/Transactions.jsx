// src/components/Transactions.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, onValue } from "firebase/database";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const transRef = ref(db, "transactions");
    onValue(transRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setTransactions(Object.values(data));
    });
  }, []);

  return (
    <section className="px-4 py-16 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Transactions / Orders
      </h2>

      {transactions.length > 0 ? (
        <table className="w-full table-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Product</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Invoice</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="p-4">{t.product}</td>
                <td className="p-4">${t.amount}</td>
                <td className="p-4">{t.status}</td>
                <td className="p-4">{t.date}</td>
                <td className="p-4">
                  <button className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition">
                    View / Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center">No transactions found.</p>
      )}
    </section>
  );
};

export default Transactions;
