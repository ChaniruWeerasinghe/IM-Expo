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

// --- Loading Spinner ---
const LoadingSpinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

// --- Unified Form Component ---
const FormField = ({ label, error, children }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1">
      {label}
    </label>
    <div className="relative">
      {children}
    </div>
    {error && (
      <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider pl-1 animate-in fade-in slide-in-from-top-1">
        {error}
      </p>
    )}
  </div>
);

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validatePhone = (value) => {
    if (!value) return true;
    const slRegex = /^(?:\+94|0)?7[0-9]{8}$/;
    const foreignRegex = /^\+[1-9]\d{1,14}$/;
    return slRegex.test(value) || foreignRegex.test(value);
  };

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateName = (value) => value.length >= 3 && !/[0-9]/.test(value);

  useEffect(() => {
    const newErrors = {};
    if (name && !validateName(name)) newErrors.name = "Invalid Name Format";
    if (email && !validateEmail(email)) newErrors.email = "Invalid Email Format";
    if (password && password.length < 6) newErrors.password = "Min 6 Characters";
    if (phone && !validatePhone(phone)) newErrors.phone = "Invalid Phone Number";
    setErrors(newErrors);
  }, [name, email, password, phone]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

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

      setAlert({ message: "Welcome to IM-Expo!", type: "success" });
      setTimeout(() => navigate(role === "buyer" ? `/buyer/${user.uid}` : `/seller/${user.uid}`), 1500);
    } catch (error) {
      setAlert({ message: error.code === "auth/email-already-in-use" ? "Email already in use" : "Signup Failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = (error) => `
    w-full h-[54px] px-4 border rounded-xl outline-none transition-all duration-300 text-sm font-medium
    ${error ? "border-red-500 bg-red-50" : "border-gray-100 bg-white hover:border-green-400 focus:border-green-500"}
  `;

  return (
    <div className="relative min-h-screen bg-white flex items-center justify-center px-4 py-4 overflow-hidden">
      <style>{`
        input:-webkit-autofill { -webkit-box-shadow: 0 0 0 30px white inset !important; }
      `}</style>

      {alert && <CustomAlert message={alert.message} type={alert.type} onClose={() => setAlert(null)} />}
      
      <div className="fixed inset-y-0 right-0 w-[45vw] bg-[#10B981] pointer-events-none z-0 [clip-path:polygon(20%_0,100%_0,100%_100%,0%_100%)] hidden lg:block" />

      <div className="animated-border-panel relative z-20 w-full max-w-5xl">
        <div className="animated-border-inner flex-col lg:flex-row border border-gray-100">
          
          <div className="w-full lg:w-[58%] p-8 lg:p-14 flex flex-col justify-center">
            <div className="mb-6 text-center lg:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-2 tracking-tighter">Join IM-Expo</h2>
              <p className="text-gray-400 font-medium text-sm">Sri Lanka's Premium Import/Export Network</p>
            </div>

            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Full Name" error={errors.name}>
                  <input type="text" placeholder="Chaniru Weerasinghe" value={name} onChange={(e) => setName(e.target.value)} required className={inputClasses(errors.name)} />
                </FormField>
                <FormField label="Email Address" error={errors.email}>
                  <input type="email" placeholder="example@gmail.com" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClasses(errors.email)} />
                </FormField>
              </div>

              <FormField label="Secure Password" error={errors.password}>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className={inputClasses(errors.password)} />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Your Role">
                  <CustomDropdown options={[{ value: "buyer", label: "Buyer (Explorer)" }, { value: "seller", label: "Seller (Producer)" }]} value={role} onChange={setRole} />
                </FormField>
                <FormField label="Phone Number" error={errors.phone}>
                  <input type="text" placeholder="e.g. 076 670 0503" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClasses(errors.phone)} />
                </FormField>
              </div>

              {role === "seller" && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                  <FormField label="Company Name">
                    <input type="text" placeholder="Lanka Trade Ltd." value={company} onChange={(e) => setCompany(e.target.value)} className={inputClasses(false)} />
                  </FormField>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || Object.keys(errors).length > 0}
                className={`mt-4 w-full h-[60px] rounded-2xl font-black text-white text-lg transition-all duration-500 flex items-center justify-center gap-3 transform active:scale-95 ${
                  loading
                    ? "bg-[#059669] opacity-80 cursor-not-allowed"
                    : Object.keys(errors).length > 0
                    ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857]"
                }`}
              >
                {loading ? (
                  <>
                    <LoadingSpinner />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Create Free Account"
                )}
              </button>
            </form>

            <div className="mt-10 text-center text-sm font-medium text-gray-400">
              Already a member? <Link to="/login" className="text-[#10B981] font-black hover:underline underline-offset-8 ml-1 transition-all">Sign In</Link>
            </div>
          </div>

          <div className="hidden lg:flex lg:w-[42%] bg-white flex-col items-center justify-center p-16 border-l border-gray-50">
            <div className="w-full max-w-xs space-y-10">
              <div className="hover:scale-110 transition-transform duration-1000 ease-in-out">
                  <Lottie animationData={animationData} loop={true} />
              </div>
              <div className="text-center space-y-4">
                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Verified Trade</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-medium">Access over 5,000 verified Sri Lankan producers and global buyers in one secure place.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
