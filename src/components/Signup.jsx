import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/animations/login-animation.json";
import animationLeft from "../assets/animations/login-left2.json";
import CustomDropdown from "./CustomDropdown";
import CustomAlert from "./CustomAlert";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  // Validation states
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePhone = (value) => {
    if (!value) return true; // optional
    // SL Rules:
    // 07XXXXXXXX (10 digits)
    // 7XXXXXXXX (9 digits)
    // +947XXXXXXXX (11+ digits)
    const slRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    const foreignRegex = /^\+[1-9]\d{1,14}$/; // Standard international
    return slRegex.test(value) || foreignRegex.test(value);
  };

  const validateEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validateName = (value) => {
    return value.length >= 3 && !/[0-9]/.test(value);
  };

  useEffect(() => {
    const newErrors = {};
    if (name && !validateName(name)) newErrors.name = "Name must be 3+ chars and no numbers";
    if (email && !validateEmail(email)) newErrors.email = "Invalid email format";
    if (password && password.length < 6) newErrors.password = "Password must be 6+ characters";
    if (phone && !validatePhone(phone)) newErrors.phone = "Invalid phone format (SL or International)";
    
    setErrors(newErrors);
  }, [name, email, password, phone]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      setAlert({ message: "Please fix validation errors first", type: "error" });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await set(ref(db, `users/${role}s/${user.uid}`), {
        uid: user.uid,
        name,
        email,
        role,
        phone: phone || null,
        company: role === "seller" ? company || null : null,
        createdAt: new Date().toISOString(),
        verified: false,
      });

      setAlert({ message: "Account created successfully! Redirecting...", type: "success" });
      setTimeout(() => {
        if (role === "buyer") navigate(`/buyer/${user.uid}`);
        else if (role === "seller") navigate(`/seller/${user.uid}`);
      }, 1500);
    } catch (error) {
      console.error("Signup error:", error);
      let msg = "Failed to create account. Please try again.";
      if (error.code === "auth/email-already-in-use") msg = "This email is already registered.";
      setAlert({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: "buyer", label: "Buyer (Exporter/Explorer)" },
    { value: "seller", label: "Seller (Local Producer)" },
  ];

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12 overflow-hidden">
      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      {/* Background decoration */}
      <div className="fixed inset-y-0 right-0 w-[45vw] bg-cyan-600 pointer-events-none z-0 [clip-path:polygon(20%_0,100%_0,100%_100%,0%_100%)] hidden lg:block" />

      {/* Left-side Animation */}
      <div className="fixed -bottom-10 left-0 hidden lg:flex items-end justify-start pointer-events-none z-10">
        <div className="w-[400px]">
          <Lottie animationData={animationLeft} loop={true} />
        </div>
      </div>

      {/* Main Card */}
      <div className="relative z-20 flex flex-col lg:flex-row bg-white shadow-2xl rounded-[2rem] overflow-hidden w-full max-w-5xl border border-gray-100">
        
        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-8 md:p-12">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h2>
            <p className="text-gray-500">Join the IM-Expo global trade network</p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-medium pl-2">{errors.name}</p>}
              </div>

              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                />
                {errors.email && <p className="text-[10px] text-red-500 font-medium pl-2">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <input
                type="password"
                placeholder="Secure Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.password ? "border-red-500 bg-red-50" : "border-gray-300"}`}
              />
              {errors.password && <p className="text-[10px] text-red-500 font-medium pl-2">{errors.password}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomDropdown
                label="Your Role"
                options={roleOptions}
                value={role}
                onChange={setRole}
              />
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1 block">Phone Number</label>
                <input
                  type="text"
                  placeholder="e.g. 076 670 0503"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${errors.phone ? "border-red-500 bg-red-50" : "border-gray-300"}`}
                />
                {errors.phone && <p className="text-[10px] text-red-500 font-medium pl-2">{errors.phone}</p>}
              </div>
            </div>

            {role === "seller" && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <input
                  type="text"
                  placeholder="Company Name (Optional)"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || Object.keys(errors).length > 0}
              className={`mt-4 w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
                loading || Object.keys(errors).length > 0
                  ? "bg-gray-300 cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 hover:shadow-green-500/20"
              }`}
            >
              {loading ? "Creating Account..." : "Start Trading"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>

        {/* Animation Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center p-12 border-l border-gray-100">
          <div className="w-full max-w-md">
            <Lottie animationData={animationData} loop={true} />
            <div className="mt-8 text-center">
              <h3 className="text-xl font-bold text-gray-800">Global Reach</h3>
              <p className="text-gray-500 mt-2">Connect with verified partners worldwide and grow your business sustainably.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
