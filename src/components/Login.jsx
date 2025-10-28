// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import Lottie from "lottie-react";
import animationData from "../assets/animations/login-animation.json";
import animationLeft from "../assets/animations/login-left.json";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const adminEmail = "admin@imexpo.com";
    const adminPassword = "imexpo123";

    try {
      if (email === adminEmail && password === adminPassword) {
        localStorage.setItem("isAdmin", "true");
        navigate("/admin");
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const buyerSnap = await get(ref(db, `users/buyers/${user.uid}`));
      const sellerSnap = await get(ref(db, `users/sellers/${user.uid}`));

      if (buyerSnap.exists()) navigate(`/buyer/${user.uid}`);
      else if (sellerSnap.exists()) navigate(`/seller/${user.uid}`);
      else alert("User role not found. Please contact support.");
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (

    <>
      {/* Page background rectangle (outside the form container) */}
      <div
        aria-hidden
        className="
    fixed inset-y-0 right-0
    w-[48vw]
    bg-green-600
    pointer-events-none
    z-0
    [clip-path:polygon(26%_0,100%_0,100%_100%,0%_100%)]
  "
      />

      {/* LEFT-SIDE ANIMATION (outside the card) */}
      <div className="fixed -bottom-20 left-0 hidden md:flex items-end justify-start pointer-events-none z-10">
        <div className="w-[380px] max-w-[38vw]">
          <Lottie animationData={animationLeft} loop={true} />
        </div>
      </div>






      {/* Login Card */}
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">


        <div className="relative z-20 flex flex-col md:flex-row bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-5xl border border-gray-100">

          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-8 text-center md:text-left">
              Sign in to continue to{" "}
              <span className="font-semibold text-green-600">IM-Expo</span>
            </p>

            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className={`${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"
                  } text-white font-semibold py-3 rounded-lg transition duration-200`}
              >
                {loading ? "Signing In..." : "Login"}
              </button>
            </form>

            <div className="mt-4 text-sm text-center md:text-left text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-green-600 font-semibold hover:underline"
              >
                Sign Up
              </Link>
            </div>

            <p className="text-xs text-gray-400 mt-10 text-center md:text-left">
              © {new Date().getFullYear()} IM-Expo. All rights reserved.
            </p>
          </div>

          {/* Right Animation Section */}
          <div className="hidden md:flex w-full md:w-1/2 bg-white items-center justify-center p-8">
            <div className="w-full max-w-sm">
              <Lottie animationData={animationData} loop={true} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

};

export default Login;
