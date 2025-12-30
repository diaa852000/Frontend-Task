// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";

export default function Login() {
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await signIn(email, password);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="h-screen flex items-center">
      <form
        onSubmit={handleSubmit}
        className="border border-gray-300 p-6 max-w-[500px] w-full mx-auto rounded"
      >
        <h1 className="text-center text-lg font-semibold mb-4">Login</h1>

        {/* Email */}
        <label htmlFor="email" className="block mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          className="border border-gray-300 p-2 w-full mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <label htmlFor="password" className="block mb-1">
          Password
        </label>
        <input
          id="password"
          type="password"
          className="border border-gray-300 p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Error */}
        {error && (
          <p className="text-red-600 text-sm mb-3 text-center">
            {error}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-main text-white w-full py-2 rounded"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
