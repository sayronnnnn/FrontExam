"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isLockedOut, setIsLockedOut] = useState(false);

  const router = useRouter();

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  useEffect(() => {
    setIsButtonDisabled(!(isValidEmail(email) && password.length >= 4));
  }, [email, password]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      router.push("/home");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLockedOut) {
      setError("You are locked out. Please try again later.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) throw new Error("Server error");

      const users = await response.json();
      const user = users.find((u: any) => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        setRetryCount(0);
        router.push("/home");
      } else {
        setError("Incorrect email or password");
        setRetryCount((prev) => prev + 1);
      }
    } catch {
      setError("Error connecting to server");
    }
  };

  useEffect(() => {
    if (retryCount >= 3) {
      setIsLockedOut(true);
      setError("Maximum login attempts reached. Please try again later.");
      const timer = setTimeout(() => {
        setRetryCount(0);
        setIsLockedOut(false);
        setError("");
      }, 30000);
      return () => clearTimeout(timer);
    }
  }, [retryCount]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-100 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <Navbar />
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 dark:border-gray-700 mt-16">
        <h1 className="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white">Login</h1>
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 border-gray-300 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 border-gray-300 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isButtonDisabled || isLockedOut}
            className={`w-full py-2 px-4 text-white rounded-md transition duration-200 ${
              isButtonDisabled || isLockedOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Login
          </button>
        </form>

        <div className="mt-4">
          <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-700">
            Forgot your password?
          </Link>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          <p>🔒 <strong>Note:</strong> Only <span className="text-blue-500 font-semibold">admins</span> can view all employees' DTRs.</p>
        </div>
      </div>
    </div>
  );
}
