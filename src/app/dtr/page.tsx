"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";

type TimeRecord = {
  id: string;
  date: string;
  employeeId: number;
  timeIn?: string;
  timeOut?: string;
};

export default function DTR() {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<any[]>([]); 

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;
  const maxRecords = 100;

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/"); 
      return;
    }

    const parsedUser = JSON.parse(user);
    if (parsedUser.role !== "admin") {
      router.push("/"); 
      return;
    }

    setIsAdmin(true);

    fetch("http://localhost:5000/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users data.");
      });

    fetch("http://localhost:5000/employeeTimeRecords")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch employee records");
        return response.json();
      })
      .then((data) => {
        const limitedRecords = data.slice(0, maxRecords); // Limit records to 100
        setTimeRecords(
          limitedRecords.map((record: any) => ({
            ...record,
            id: String(record.id),
            employeeId: Number(record.employeeId),
          }))
        );
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching employee records:", error);
        setError("Failed to fetch employee records. Please try again later.");
        setIsLoading(false);
      });
  }, [router]);

  const getUserDetails = (employeeId: number) => {
    const user = users.find((user) => Number(user.id) === employeeId); 
    return user ? { name: user.username, role: user.role } : { name: "N/A", role: "N/A" };
  };

  if (!isAdmin) return null;

  // Pagination Logic
  const totalPages = Math.ceil(timeRecords.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = timeRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-100 to-gray-100 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-200">
      <Navbar />
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-4xl border border-gray-200 dark:border-gray-700 mt-16">
        
        <button 
          onClick={() => router.back()} 
          className="mb-4 px-4 py-2 text-md font-medium text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none transition-all duration-200 ease-in-out transform hover:scale-105">
          &#8592; Back
        </button>

        <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-white text-center">
          Employee DTR (Daily Time Record)
        </h2>

        {isLoading ? (
          <p className="text-center text-gray-700 dark:text-gray-300">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500 dark:text-red-400">{error}</p>
        ) : timeRecords.length === 0 ? (
          <p className="text-center text-gray-700 dark:text-gray-300">No records found.</p>
        ) : (
          <>
            <p className="text-center text-gray-700 dark:text-gray-300 mb-4">
              Displaying employee records (Page {currentPage} of {totalPages}).
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 border border-gray-300 dark:border-gray-600">Date</th>
                    <th className="py-3 px-4 border border-gray-300 dark:border-gray-600">Employee</th>
                    <th className="py-3 px-4 border border-gray-300 dark:border-gray-600">Role</th>
                    <th className="py-3 px-4 border border-gray-300 dark:border-gray-600">Time In</th>
                    <th className="py-3 px-4 border border-gray-300 dark:border-gray-600">Time Out</th>
                  </tr>
                </thead>
                <tbody>
                  {currentRecords.map((record) => {
                    const { name, role } = getUserDetails(record.employeeId);
                    return (
                      <tr key={record.id} className="border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <td className="py-3 px-4 text-center">{record.date}</td>
                        <td className="py-3 px-4 text-center">{name}</td>
                        <td className="py-3 px-4 text-center">{role}</td>
                        <td className="py-3 px-4 text-center">{record.timeIn || "N/A"}</td>
                        <td className="py-3 px-4 text-center">{record.timeOut || "N/A"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none transition-all duration-200 ease-in-out ${
                    currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-900 dark:text-white">{`Page ${currentPage} of ${totalPages}`}</span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 text-white bg-blue-500 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none transition-all duration-200 ease-in-out ${
                    currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
