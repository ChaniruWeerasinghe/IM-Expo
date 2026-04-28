import React, { useEffect } from "react";

const CustomAlert = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";

  return (
    <div className={`fixed top-4 right-4 z-[100] ${bgColor} text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300`}>
      <span>{message}</span>
      <button onClick={onClose} className="hover:scale-110 transition-transform">✕</button>
    </div>
  );
};

export default CustomAlert;
