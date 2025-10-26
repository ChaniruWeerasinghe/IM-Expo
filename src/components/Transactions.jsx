import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import { jsPDF } from "jspdf";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) setUser(u);
      else setUser(null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;

    const transRef = ref(db, "transactions");
    onValue(transRef, (snapshot) => {
      const data = snapshot.val() || {};
      const filteredTransactions = Object.values(data).filter(
        (t) => t.buyerUID === user.uid || t.sellerUID === user.uid
      );
      setTransactions(filteredTransactions);
    });
  }, [user]);

  const downloadInvoice = (t) => {
  const doc = new jsPDF();
  const left = 20;
  let y = 20;

  // 🔹 Header
  doc.setFontSize(18);
  doc.text("IM-Expo", left, y);
  doc.setFontSize(14);
  doc.text("Invoice / Receipt", 150, y);
  y += 10;

  doc.setLineWidth(0.5);
  doc.line(20, y, 190, y);
  y += 10;

  // 🔹 Buyer & Seller info
  doc.setFontSize(12);
  doc.text(`Buyer UID: ${t.buyerUID}`, left, y);
  doc.text(`Buyer Name: ${t.buyerName || "N/A"}`, left, y + 7);
  doc.text(`Seller: ${t.sellerName}`, 150, y);
  doc.text(`Seller Email: ${t.sellerEmail}`, 150, y + 7);
  y += 25;

  // 🔹 Transaction Table Header
  doc.setFontSize(12);
  doc.text("Product", left, y);
  doc.text("Category", 80, y);
  doc.text("Price", 120, y);
  doc.text("Qty", 140, y);
  doc.text("Total", 160, y);
  y += 5;
  doc.line(20, y, 190, y);
  y += 7;

  // 🔹 Transaction Table Data
  doc.text(`${t.productName}`, left, y);
  doc.text(`${t.productCategory || "Uncategorized"}`, 80, y);
  doc.text(`$${t.price.toFixed(2)}`, 120, y);
  doc.text(`${t.quantity}`, 140, y);
  doc.text(`$${t.amount.toFixed(2)}`, 160, y);
  y += 10;

  doc.line(20, y, 190, y);
  y += 10;

  // 🔹 Footer
  doc.setFontSize(14);
  doc.text(`Total Amount: $${t.amount.toFixed(2)}`, left, y);
  y += 10;
  doc.setFontSize(10);
  doc.text(`Status: ${t.status}`, left, y);
  y += 5;
  doc.text(`Date: ${t.date}`, left, y);
  y += 15;
  doc.text("Thank you for your purchase!", left, y);

  // 🔹 Save PDF
  doc.save(`IM-Expo_Invoice_${t.productName}_${t.date}.pdf`);
};


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
                <td className="p-4">{t.productName}</td>
                <td className="p-4">${t.amount.toFixed(2)}</td>
                <td className="p-4">{t.status}</td>
                <td className="p-4">{t.date}</td>
                <td className="p-4">
                  <button
                    onClick={() => downloadInvoice(t)}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition"
                  >
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
