// src/components/Header.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import { ref, get } from "firebase/database";

const Header = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [role, setRole] = useState(null);
  const [clickCount, setClickCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const checkRole = async () => {
      if (!currentUser) return;
      const buyerSnap = await get(ref(db, `users/buyers/${currentUser.uid}`));
      const sellerSnap = await get(ref(db, `users/sellers/${currentUser.uid}`));
      if (buyerSnap.exists()) setRole("buyer");
      else if (sellerSnap.exists()) setRole("seller");
    };
    checkRole();
  }, [currentUser]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  const handlePlansClick = () => {
    if (currentUser) {
      navigate(`/subscriptions?seller=${currentUser.uid}`);
    } else {
      navigate("/subscriptions");
    }
  };

  const NavLink = ({ to, children, onClick }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`relative px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 ${
          isActive ? "text-[#059669]" : "text-gray-600 hover:text-[#10B981]"
        }`}
      >
        {children}
        {isActive && (
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#059669] rounded-full" />
        )}
      </Link>
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full z-[100] px-4 py-6 pointer-events-none">
      <header 
        className={`mx-auto max-w-6xl w-full transition-all duration-500 ease-in-out pointer-events-auto
          ${scrolled 
            ? "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-3 rounded-[2rem] border border-gray-50" 
            : "bg-white/95 backdrop-blur-md py-4 rounded-[2.5rem] border border-white/50 shadow-lg shadow-black/5"
          }`}
      >
        <div className="px-6 lg:px-10 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <button
              onClick={() => {
                setClickCount((prev) => {
                  const newCount = prev + 1;
                  if (newCount >= 5) {
                    navigate("/admin-login");
                    return 0;
                  }
                  clearTimeout(window.logoTapTimer);
                  window.logoTapTimer = setTimeout(() => setClickCount(0), 1000);
                  return newCount;
                });
              }}
              className="text-[#059669] font-black text-2xl tracking-tighter focus:outline-none select-none hover:scale-105 transition-transform"
            >
              IM-Expo
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/discover">Discover</NavLink>
            <NavLink to="/resources">Resources</NavLink>
            <NavLink to="/portfolio">Portfolio</NavLink>
            <button
              onClick={handlePlansClick}
              className={`px-4 py-2 text-sm font-bold tracking-tight transition-all duration-300 ${
                location.pathname === "/subscriptions" ? "text-[#059669]" : "text-gray-600 hover:text-[#10B981]"
              }`}
            >
              Plans
            </button>
          </nav>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {!currentUser ? (
              <>
                <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:text-[#059669] transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="px-6 py-2.5 bg-[#10B981] text-white rounded-full text-sm font-black shadow-lg shadow-green-600/20 hover:bg-[#059669] hover:shadow-green-700/30 transition-all active:scale-95">
                  Join Now
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-2">
                {role && (
                  <button
                    onClick={() => navigate(`/${role}/${currentUser.uid}`)}
                    className="px-5 py-2 bg-gray-50 text-gray-700 rounded-full text-xs font-black border border-gray-100 hover:bg-white transition-all capitalize"
                  >
                    {role} Dashboard
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Logout"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-600 hover:text-green-600 transition-colors"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16"/></svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full mt-4 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="mx-auto w-[92%] bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-gray-100 flex flex-col gap-4">
              <NavLink to="/" onClick={() => setIsOpen(false)}>Home</NavLink>
              <NavLink to="/discover" onClick={() => setIsOpen(false)}>Discover</NavLink>
              <NavLink to="/resources" onClick={() => setIsOpen(false)}>Resources</NavLink>
              <NavLink to="/portfolio" onClick={() => setIsOpen(false)}>Portfolio</NavLink>
              <button onClick={() => { handlePlansClick(); setIsOpen(false); }} className="px-4 py-2 text-sm font-bold text-gray-500 text-left">Plans</button>
              
              <div className="h-px bg-gray-100 my-2" />
              
              {!currentUser ? (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-4 text-center font-bold text-gray-700">Login</Link>
                  <Link to="/signup" onClick={() => setIsOpen(false)} className="w-full py-4 bg-green-600 text-white rounded-2xl text-center font-black">Join IM-Expo</Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {role && (
                    <button onClick={() => { navigate(`/${role}/${currentUser.uid}`); setIsOpen(false); }} className="w-full py-4 bg-gray-50 text-gray-700 rounded-2xl text-center font-black">
                      Go to Dashboard
                    </button>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="w-full py-4 text-red-500 font-bold text-center">Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;
