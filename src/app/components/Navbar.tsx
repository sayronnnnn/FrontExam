"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      setIsLoggedIn(true);
      setIsAdmin(parsedUser.role === "admin");
      setUsername(parsedUser.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          {/* App Name with "Track" in Teal */}
          <div>
            <Link href="/" className="text-2xl font-extrabold tracking-wide">
              <span className="text-gray-900 dark:text-white">Exam</span>  
              <span className="text-teal-500"> Track</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6 relative">
            {isLoggedIn ? (
              <div className="relative flex items-center gap-3">
                {/* Role Badge */}
                <span
                  className={`px-3 py-1 text-sm font-semibold rounded-full ${
                    isAdmin ? "bg-red-500 text-white" : "bg-blue-500 text-white"
                  }`}
                >
                  {isAdmin ? "Admin" : "Employee"}
                </span>

                {/* Dropdown Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-lg font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 flex items-center gap-2 relative"
                >
                  {username} ▼
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[150px] bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-300 dark:border-gray-700 z-50">
                    {isAdmin && (
                      <Link
                        href="/dtr"
                        className="block px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        📋 Emp. DTRs
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="relative text-lg font-semibold bg-teal-500 text-white px-6 py-2 rounded-lg shadow-md"
              >
                Login
              </Link>

            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
