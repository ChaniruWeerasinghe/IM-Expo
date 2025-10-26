import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

const ProtectedRoute = ({ role, children }) => {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUid(user.uid);
        // Check which role the user has
        const buyerSnap = await get(ref(db, `users/buyers/${user.uid}`));
        const sellerSnap = await get(ref(db, `users/sellers/${user.uid}`));

        if (buyerSnap.exists()) setUserRole("buyer");
        else if (sellerSnap.exists()) setUserRole("seller");
        else setUserRole("unknown"); // fallback
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p className="p-6 text-gray-700">Loading...</p>;
  if (!userRole) return <Navigate to="/login" />; // not logged in
  if (userRole !== role)
    return <Navigate to={`/${userRole}/${uid || ""}`} />; // redirect to correct dashboard

  return children;
};

export default ProtectedRoute;
