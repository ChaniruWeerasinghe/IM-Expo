import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("buyer"); // default
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save role in Firebase Realtime Database
      await set(ref(db, `users/${role}s/${user.uid}`), {
        email,
        role,
        uid: user.uid,
      });

      // Redirect to unique URL
      if (role === "buyer") navigate(`/buyer/${user.uid}`);
      else if (role === "seller") navigate(`/seller/${user.uid}`);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="p-3 border rounded-lg"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-3 border rounded-lg"
        />

        {/* Role selection */}
        <select value={role} onChange={(e) => setRole(e.target.value)} className="p-3 border rounded-lg">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>

        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
          Sign Up
        </button>
      </form>

      <p className="mt-4 text-sm">
        Already have an account? <a href="/login" className="text-green-500">Go to Login</a>
      </p>
    </div>
  );
};

export default Signup;
