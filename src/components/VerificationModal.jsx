import React, { useState } from "react";
import { approveRequest, rejectRequest } from "../utils/adminActions";
import styles from "./VerificationModal.module.css";

const VerificationModal = ({ request, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApprove = async () => {
    try {
      setLoading(true);
      await approveRequest(request);
      onClose();
    } catch {
      setError("Failed to approve request.");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoading(true);
      await rejectRequest(request);
      onClose();
    } catch {
      setError("Failed to reject request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h3 className={styles.title}>Verification Request</h3>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.content}>
          <div className={styles.field}>
            <strong>Full Name:</strong> {request.fullName}
          </div>
          <div className={styles.field}>
            <strong>Company:</strong> {request.company}
          </div>
          <div className={styles.field}>
            <strong>Email:</strong> {request.email || "N/A"}
          </div>
          <div className={styles.field}>
            <strong>Permit Number:</strong> {request.permitNumber}
          </div>
          <div className={styles.field}>
            <strong>Organization:</strong> {request.organization}
          </div>
          <div className={styles.field}>
            <strong>Contact:</strong> {request.contactNumber}
          </div>
          <div className={styles.field}>
            <strong>Expiry Date:</strong> {request.expiryDate}
          </div>
          <div className={styles.field}>
            <strong>Remarks:</strong> {request.remarks}
          </div>
          <div className={styles.field}>
            <strong>Status:</strong> {request.status}
          </div>
        </div>

        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${styles.reject}`}
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? "Processing..." : "Reject"}
          </button>
          <button
            className={`${styles.btn} ${styles.approve}`}
            onClick={handleApprove}
            disabled={loading}
          >
            {loading ? "Processing..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerificationModal;
