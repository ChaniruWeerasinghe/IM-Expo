// src/components/Login.jsx
import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import Lottie from "lottie-react";
import animationData from "../assets/animations/login-animation.json";
import animationLeft from "../assets/animations/login-left.json";
import CustomAlert from "./CustomAlert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
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
      else setAlert({ message: "User role not found. Please contact support.", type: "error" });
    } catch (error) {
      console.error(error);
      let msg = "Invalid email or password.";
      if (error.code === "auth/user-not-found") msg = "No account found with this email.";
      if (error.code === "auth/wrong-password") msg = "Incorrect password.";
      setAlert({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAlert({ message: "Please enter your email first to reset password.", type: "error" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAlert({ message: "Password reset email sent! Check your inbox.", type: "success" });
    } catch (error) {
      console.error(error);
      setAlert({ message: "Failed to send reset email. Verify your email address.", type: "error" });
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 overflow-hidden">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      {/* Page background decoration */}
      <div
        aria-hidden
        className="fixed inset-y-0 right-0 w-[48vw] bg-green-600 pointer-events-none z-0 [clip-path:polygon(26%_0,100%_0,100%_100%,0%_100%)] hidden lg:block"
      />

      {/* LEFT-SIDE ANIMATION */}
      <div className="fixed -bottom-20 left-0 hidden md:flex items-end justify-start pointer-events-none z-10">
        <div className="w-[380px] max-w-[38vw]">
          <Lottie animationData={animationLeft} loop={true} />
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-20 flex flex-col lg:flex-row bg-white shadow-2xl rounded-[2rem] overflow-hidden w-full max-w-5xl border border-gray-100">
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-gray-500 mb-8">Sign in to your account</p>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div className="space-y-1">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              />
            </div>
            <div className="space-y-1">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:outline-none transition-all"
              />
              <div className="text-right mt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs font-semibold text-green-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                loading ? "bg-gray-300" : "bg-green-500 hover:bg-green-600 hover:shadow-green-500/20"
              }`}
            >
              {loading ? "Verifying..." : "Login"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-green-600 font-bold hover:underline">
              Sign Up
            </Link>
          </div>

          <p className="text-xs text-gray-400 mt-10 text-center lg:text-left">
            © {new Date().getFullYear()} IM-Expo. Secure Authentication.
          </p>
        </div>

        {/* Right Animation Section */}
        <div className="hidden lg:flex w-full lg:w-1/2 bg-gray-50 items-center justify-center p-12 border-l border-gray-100">
          <div className="w-full max-w-sm">
            <Lottie animationData={animationData} loop={true} />
            <div className="mt-6 text-center">
              <h3 className="text-lg font-bold text-gray-800">Secure Access</h3>
              <p className="text-sm text-gray-500 mt-1">Your data is encrypted and protected with industry-standard security.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
