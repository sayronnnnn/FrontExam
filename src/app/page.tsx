import Link from "next/link";
import Navbar from "./components/Navbar";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-blue-300/40 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-200">
      <Navbar />
      
      {/* Smaller Container with Subtle Hover Effect */}
      <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/50 p-8 rounded-2xl shadow-lg max-w-sm w-full text-center border border-white/20 dark:border-gray-700 mt-12 transition-all transform hover:scale-105 hover:shadow-xl">
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
          Welcome 👋
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-sm">
          Manage employee time records effortlessly.
        </p>

        {/* Image with Soft Glow */}
        <div className="mt-4 relative">
          <Image
            src="/images/clock.jpg"
            alt="DTR Tracking System"
            width={250}
            height={150}
            className="rounded-lg mx-auto block shadow-md hover:shadow-lg transition-all duration-300"
          />
        </div>

        {/* CTA Button */}
        <div className="mt-5">
          <Link
            href="/login"
            className="inline-block w-full text-center bg-teal-500 text-white py-2 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            🚀 Get Started
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-4 text-gray-600 dark:text-gray-400 text-xs font-light">
          <p>
            Designed by <span className="font-medium text-gray-800 dark:text-gray-300">Cyron</span> | © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
}
