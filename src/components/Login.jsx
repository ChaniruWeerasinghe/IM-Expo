import React, { useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import { ref, get } from "firebase/database";
import Lottie from "lottie-react";
import animationData from "../assets/animations/login-animation.json";
import animationLeft from "../assets/animations/login-left.json";
import CustomAlert from "./CustomAlert";

// --- Loading Spinner ---
const LoadingSpinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

// --- Unified Form Component ---
const FormField = ({ label, children, extra }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <div className="flex justify-between items-end ml-1">
      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">
        {label}
      </label>
      {extra}
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

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
      else setAlert({ message: "User role not found.", type: "error" });
    } catch (error) {
      console.error(error);
      let msg = "Invalid email or password.";
      if (error.code === "auth/user-not-found") msg = "No account found.";
      if (error.code === "auth/wrong-password") msg = "Incorrect password.";
      setAlert({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setAlert({ message: "Enter your email first.", type: "error" });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setAlert({ message: "Reset email sent! Check your inbox.", type: "success" });
    } catch (error) {
      setAlert({ message: "Failed to send reset email.", type: "error" });
    }
  };

  const inputClasses = `
    w-full h-[54px] px-4 border border-gray-100 bg-white rounded-xl outline-none transition-all duration-300 text-sm font-medium
    hover:border-green-400 focus:border-green-500
  `;

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-4 py-8 overflow-hidden">
      <style>{`
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px white inset !important; }
      `}</style>

      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}

      <div className="fixed inset-y-0 right-0 w-[45vw] bg-[#10B981] pointer-events-none z-0 [clip-path:polygon(20%_0,100%_0,100%_100%,0%_100%)] hidden lg:block" />

      <div className="animated-border-panel relative z-20 w-full max-w-5xl">
        <div className="animated-border-inner flex-col lg:flex-row border border-gray-100">
          
          <div className="w-full lg:w-[58%] p-10 lg:p-20 flex flex-col justify-center">
            <div className="mb-12 text-center lg:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tighter">Welcome Back</h2>
              <p className="text-gray-400 font-medium">Continue your global trade journey</p>
            </div>

            <form onSubmit={handleLogin} className="flex flex-col gap-8">
              <FormField label="Email Address">
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={inputClasses}
                />
              </FormField>

              <FormField 
                label="Secure Password"
                extra={
                  <button type="button" onClick={handleForgotPassword} className="text-[10px] font-black text-[#10B981] uppercase tracking-wider hover:underline underline-offset-2">
                    Forgot?
                  </button>
                }
              >
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={inputClasses}
                />
              </FormField>

              <button
                type="submit"
                disabled={loading}
                className={`mt-4 w-full h-[60px] rounded-2xl font-black text-white text-lg transition-all duration-500 flex items-center justify-center gap-3 transform active:scale-95 ${
                  loading
                    ? "bg-[#059669] opacity-80 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                }`}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Login to Account"
                )}
              </button>
            </form>

            <div className="mt-12 text-center text-sm font-medium text-gray-400">
              New to IM-Expo? <Link to="/signup" className="text-[#10B981] font-black hover:underline underline-offset-8 ml-1 transition-all">Create Account</Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:w-[42%] bg-white flex-col items-center justify-center p-16 border-l border-gray-50">
            <div className="w-full max-w-xs space-y-10">
              <div className="hover:scale-110 transition-transform duration-1000 ease-in-out">
                  <Lottie animationData={animationData} loop={true} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Secure Trade</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">Your account is protected by enterprise-grade security and verification systems.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
