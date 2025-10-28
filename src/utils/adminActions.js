// src/utils/adminActions.js
import { ref, update } from "firebase/database";
import { db } from "../firebase";

// 🟢 Approve request
export const approveRequest = async (req) => {
  const approvedAt = new Date().toISOString();
  const adminEmail = localStorage.getItem("adminEmail") || "admin@gmail.com";

  const updates = {};

  // Update permit verification entry
  updates[`permitVerifications/${req.id}/status`] = "Approved";
  updates[`permitVerifications/${req.id}/approvedAt`] = approvedAt;
  updates[`permitVerifications/${req.id}/approvedBy`] = adminEmail;

  // Update user verification status
  updates[`users/buyers/${req.userId}/verification`] = {
    status: "Verified",
    type: req.type || "free",
    approvedAt,
    approvedBy: adminEmail,
  };

  await update(ref(db), updates);
};

// 🔴 Reject request
export const rejectRequest = async (req) => {
  const rejectedAt = new Date().toISOString();
  const adminEmail = localStorage.getItem("adminEmail") || "admin@gmail.com";

  const updates = {};

  // Update permit verification entry
  updates[`permitVerifications/${req.id}/status`] = "Rejected";
  updates[`permitVerifications/${req.id}/rejectedAt`] = rejectedAt;
  updates[`permitVerifications/${req.id}/approvedBy`] = adminEmail;

  // Update user verification node
  updates[`users/buyers/${req.userId}/verification`] = {
    status: "Rejected",
    type: req.type || "free",
    rejectedAt,
    reviewedBy: adminEmail,
  };

  await update(ref(db), updates);
};
