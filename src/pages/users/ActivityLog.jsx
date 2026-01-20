import React, { useState } from "react";
import { FaPrint } from "react-icons/fa";

/* ================= MOCK DATA ================= */
const ACTIVITY_LOGS = [
  {
    message: "Mohit: Create New Performa Invoice of Client Kuldeep Singh",
    date: "2025-11-23",
    datetime: "23-Nov-2025 09:11 AM",
    day: "today",
  },
  {
    message: "Mohit: Create New Estimate of Client Kuldeep Singh",
    date: "2025-11-22",
    datetime: "22-Nov-2025 09:11 AM",
    day: "yesterday",
  },
  {
    message: "Mohit: Add status on client Kuldeep Singh",
    date: "2025-11-21",
    datetime: "21-Nov-2025 09:11 AM",
    day: "yesterday",
  },
];

const STATS = [
  { label: "Add Corporate Data", count: 10, date: "2025-11-23", day: "today" },
  {
    label: "Add Status in Corporate Data",
    count: 4,
    date: "2025-11-23",
    day: "today",
  },
  {
    label: "Sent Reminder in Corporate Data",
    count: 6,
    date: "2025-11-22",
    day: "yesterday",
  },
];

/* ================= HELPERS ================= */
const formatDate = (dateStr) => {
  if (!dateStr) return "--";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* ================= COMPONENT ================= */
const ActivityLog = () => {
  const [activityTab, setActivityTab] = useState("today");
  const [statsTab, setStatsTab] = useState("today");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [searched, setSearched] = useState(false);

  /* ===== TAB DATA (Top Section) ===== */
  const tabLogs = ACTIVITY_LOGS.filter(
    (i) => activityTab === "month" || i.day === activityTab
  );

  const tabStats = STATS.filter(
    (i) => statsTab === "month" || i.day === statsTab
  );

  const tabTotal = tabStats.reduce((a, b) => a + b.count, 0);

  /* ===== SEARCH DATA (Bottom Section) ===== */
  const searchLogs =
    searched && from && to
      ? ACTIVITY_LOGS.filter((i) => i.date >= from && i.date <= to)
      : [];

  const searchStats =
    searched && from && to
      ? STATS.filter((i) => i.date >= from && i.date <= to)
      : [];

  const searchTotal = searchStats.reduce((a, b) => a + b.count, 0);

  /* ===== PRINT ===== */
  const handlePrint = () => {
    if (searchLogs.length === 0) return;
    window.print();
  };

  return (
    <div className="space-y-6 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add User Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add User Management in Namo Gange Trusteeship.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* ===== ACTIVITY LOG ===== */}
        <div className="rounded border border-blue-400 bg-white">
          <div className="bg-[#3b9ad9] text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold text-sm">ACTIVITY LOG</span>
            <div className="flex gap-4 text-sm ">
              <button
                onClick={() => setActivityTab("today")}
                className={`cursor-pointer ${
                  activityTab === "today"
                    ? "font-semibold border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setActivityTab("yesterday")}
                className={`cursor-pointer ${
                  activityTab === "yesterday"
                    ? "font-semibold border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                Yesterday
              </button>
              <button
                onClick={() => setActivityTab("month")}
                className={`cursor-pointer ${
                  activityTab === "month"
                    ? "font-semibold border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              {tabLogs.map((item, i) => (
                <tr key={i} className="odd:bg-gray-100">
                  <td className="px-3 py-2 text-blue-600">{item.message}</td>
                  <td className="px-3 py-2">{item.datetime}</td>
                </tr>
              ))}
              {tabLogs.length === 0 && (
                <tr>
                  <td colSpan="2" className="text-center py-6 text-gray-500">
                    No Activity Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== STATS ===== */}
        <div className="rounded border border-blue-400 bg-white">
          <div className="bg-[#3b9ad9] text-white px-4 py-2 flex justify-between items-center">
            <span className="font-semibold text-sm">STATS</span>
            <div className="flex gap-4 text-sm ">
              <button
                onClick={() => setStatsTab("today")}
                className={`cursor-pointer ${
                  statsTab === "today"
                    ? "font-semibold border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                Today
              </button>
              <button
                onClick={() => setStatsTab("yesterday")}
                className={`cursor-pointer ${
                  statsTab === "yesterday"
                    ? "font-semibold border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                Yesterday
              </button>
              <button
                onClick={() => setStatsTab("month")}
                className={`cursor-pointer ${
                  statsTab === "month"
                    ? "font-semibold border-b-2 border-white"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                This Month
              </button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left px-3 py-2">USERS</th>
                <th className="text-right px-3 py-2">No.</th>
              </tr>
            </thead>
            <tbody>
              {tabStats.map((s, i) => (
                <tr key={i} className="odd:bg-gray-100">
                  <td className="px-3 py-2">{s.label}</td>
                  <td className="px-3 py-2 text-right">{s.count}</td>
                </tr>
              ))}
              <tr className="font-semibold border-t border-gray-300">
                <td className="px-3 py-2">TOTAL</td>
                <td className="px-3 py-2 text-right">{tabTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="bg-white rounded shadow-sm border border-blue-400 mt-6">
        <div className="flex justify-between px-5 py-1.5 border-b border-gray-200 bg-[#3b9ad9] text-white rounded-t">
          <h3 className="text-base font-medium">Search Filters</h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={searchLogs.length === 0}
              className={`flex items-center gap-2
                border border-gray-300
                px-3 py-1 rounded
                text-sm
                ${
                  searchLogs.length
                    ? "hover:bg-gray-100 hover:text-gray-700"
                    : "opacity-50 cursor-not-allowed"
                }`}
            >
              <FaPrint size={12} />
              <span className="text-xs font-medium">Print</span>
            </button>
          </div>
        </div>

        <div className="px-6 py-4 flex flex-wrap md:flex-nowrap gap-14 items-end">
          {/* FROM */}
          <div className="flex flex-row items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              From <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          {/* TO */}
          <div className="flex flex-row items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              To <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              className="border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          {/* SEARCH */}
          <button
            type="button"
            onClick={() => setSearched(true)}
            className="py-1.5 px-10 bg-[#3b9ad9] hover:bg-[#2f87c5]
              text-white text-sm font-medium rounded shadow-sm transition"
          >
            Search
          </button>
        </div>
      </div>

      {/* ================= SEARCH RESULT ================= */}

      {searched && from && to && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* ACTIVITY LOG */}
          <div className="border border-blue-400 rounded">
            <div className="bg-[#3b9ad9] text-white px-3 py-1 text-sm font-semibold">
              ACTIVITY LOG
            </div>
            <table className="w-full text-sm">
              <tbody>
                {searchLogs.length ? (
                  searchLogs.map((item, i) => (
                    <tr key={i} className="odd:bg-gray-100">
                      <td className="px-3 py-2 text-blue-600">
                        {item.message}
                      </td>
                      <td className="px-3 py-2">{formatDate(item.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="text-center py-6 text-gray-500">
                      No Activity Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* STATS */}
          <div className="border border-blue-400 rounded">
            <div className="bg-[#3b9ad9] text-white px-3 py-1 text-sm font-semibold">
              STATS
            </div>
            <table className="w-full text-sm">
              <tbody>
                {searchStats.map((s, i) => (
                  <tr key={i} className="odd:bg-gray-100">
                    <td className="px-3 py-2">{s.label}</td>
                    <td className="px-3 py-2 text-right">{s.count}</td>
                  </tr>
                ))}
                {searchStats.length > 0 && (
                  <tr className="font-semibold border-t border-gray-300">
                    <td className="px-3 py-2">TOTAL</td>
                    <td className="px-3 py-2 text-right">{searchTotal}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityLog;
