"use client";

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

type TimeRecord = {
  id: string;
  date: string;
  employeeId: number;
  timeIn?: string;
  timeOut?: string;
};

type LeaveCredit = {
  type: string;
  balance: number;
};

export default function Home() {
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [user, setUser] = useState<any>(null);
  const [todayRecord, setTodayRecord] = useState<TimeRecord | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState<"timeIn" | "timeOut" | null>(null);

  const leaveCredits: LeaveCredit[] = [
    { type: "Vacation", balance: 7 },
    { type: "Sick", balance: 5 },
    { type: "Bereavement", balance: 3 },
    { type: "Emergency Leave", balance: 2 },
    { type: "Offset Leave", balance: 0 },
    { type: "Compensatory Time Off", balance: 0 },
  ];

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setUser(user);

      fetch(`http://localhost:5000/employeeTimeRecords?employeeId=${user.id}`)
        .then((response) => response.json())
        .then((data) => {
          setTimeRecords(data);
          const today = new Date().toISOString().split("T")[0];
          const existingRecord = data.find(
            (record: TimeRecord) => record.employeeId === parseInt(user.id, 10) && record.date === today
          );
          setTodayRecord(existingRecord || null);
        })
        .catch((error) => console.error("Error fetching time records:", error));
    }
  }, []);

  const handleTimeAction = (type: "timeIn" | "timeOut") => {
    setActionType(type);
    setShowConfirmModal(true);
  };

  const handleConfirmAction = () => {
    if (!user || !actionType) return;
    const today = new Date().toISOString().split("T")[0];

    if (actionType === "timeIn" && !todayRecord) {
      const newRecord: TimeRecord = {
        id: Date.now().toString(),
        date: today,
        employeeId: parseInt(user.id, 10),
        timeIn: new Date().toLocaleTimeString(),
      };

      setTimeRecords((prevRecords) => [newRecord, ...prevRecords]);
      setTodayRecord(newRecord);
    } else if (actionType === "timeOut" && todayRecord && !todayRecord.timeOut) {
      const updatedRecord = { ...todayRecord, timeOut: new Date().toLocaleTimeString() };
      setTimeRecords((prevRecords) =>
        prevRecords.map((record) => (record.id === updatedRecord.id ? updatedRecord : record))
      );
      setTodayRecord(updatedRecord);
    }

    setShowConfirmModal(false);
    setActionType(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-100 dark:bg-gray-900">
      <Navbar />

      {/* Welcome Section */}
      <div className="w-full max-w-5xl mb-6 p-6 bg-blue-600 text-white text-center rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold">Welcome, {user?.username || "Employee"}!</h1>
        <p className="text-lg mt-2">Here's your attendance and leave summary for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
        {/* Attendance Section (Larger Size) */}
        <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className=" text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">My Attendance</h2>
            <button
              onClick={() => handleTimeAction(todayRecord ? "timeOut" : "timeIn")}
              disabled={Boolean(todayRecord?.timeOut)}
              className={`px-5 py-2 rounded-lg font-semibold shadow-md transition duration-300 ease-in-out transform active:scale-95 ${
                todayRecord?.timeOut
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-blue-600 hover:bg-gray-800"
              }`}
            >
              {todayRecord ? (todayRecord.timeOut ? "Completed" : "Time Out") : "Time In"}
            </button>
          </div>

          <div className="overflow-x-auto mt-4 p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 text-left text-gray-700 dark:text-gray-200">
                  <th className="p-3">Date</th>
                  <th className="p-3">Time In</th>
                  <th className="p-3">Time Out</th>
                </tr>
              </thead>
              <tbody>
                {timeRecords.map((record) => (
                  <tr key={record.id} className="border-b border-gray-300 dark:border-gray-700">
                    <td className="p-3">{record.date}</td>
                    <td className="p-3">{record.timeIn || "-"}</td>
                    <td className="p-3">{record.timeOut || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Credits Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg text-white p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">Leave Credits</h2>
            <button className="px-5 py-2 rounded-lg font-semibold bg-blue-600 text-white shadow-md hover:bg-gray-800 transition">
              Apply
            </button>
          </div>

          <div className="p-4">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-300 dark:border-gray-700 text-left text-gray-700 dark:text-gray-200">
                  <th className="p-3">Leave Type</th>
                  <th className="p-3">Balance</th>
                </tr>
              </thead>
              <tbody>
                {leaveCredits.map((leave, index) => (
                  <tr key={index} className="border-b border-gray-300 dark:border-gray-700">
                    <td className="p-3">{leave.type}</td>
                    <td className="p-3">{leave.balance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm {actionType === "timeIn" ? "Time In" : "Time Out"}
            </h2>
            <div className="flex justify-end mt-6 space-x-2">
              <button onClick={() => setShowConfirmModal(false)} className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                Cancel
              </button>
              <button onClick={handleConfirmAction} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md transition">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
