"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Email validation regex
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Handle email input change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setMessage("");
  };

  // Handle send button click
  const handleSend = async () => {
    if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/users");
      const users = await response.json();

      const user = users.find((user: any) => user.email === email);

      if (user) {
        setMessage("A password reset link has been sent to your email.");
      } else {
        setEmailError("Email not found. Please check and try again.");
      }
    } catch (err) {
      setEmailError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-100 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <Navbar />
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200 dark:border-gray-700 mt-16">
        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        {message && (
          <div className="text-green-500 text-center mb-4">{message}</div>
        )}
        {emailError && (
          <div className="text-red-500 text-center mb-4">{emailError}</div>
        )}

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Enter your email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => router.push("/login")}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition-all transform hover:scale-105"
          >
            Back
          </button>

          <button
            onClick={handleSend}
            disabled={loading}
            className={`px-4 py-2 text-white rounded-lg shadow-md transition-all transform hover:scale-105 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}