// src/components/VerificationTable.jsx
import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase";
import VerificationModal from "./VerificationModal";

const VerificationTable = () => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const reqRef = ref(db, "permitVerifications");
    const unsubscribe = onValue(reqRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map((key) => ({ id: key, ...data[key] }));
        setRequests(list);
      } else {
        setRequests([]);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">
        Pending Verification Requests
      </h3>

      {requests.length === 0 ? (
        <p className="text-gray-500 text-sm">No requests found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Company</th>
                <th className="border px-4 py-2">Permit No.</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td className="border px-4 py-2">{req.fullName}</td>
                  <td className="border px-4 py-2">{req.company}</td>
                  <td className="border px-4 py-2">{req.permitNumber}</td>
                  <td
                    className={`border px-4 py-2 font-semibold ${
                      req.status === "Approved"
                        ? "text-green-600"
                        : req.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {req.status}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => setSelectedRequest(req)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedRequest && (
        <VerificationModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
        />
      )}
    </div>
  );
};

export default VerificationTable;
