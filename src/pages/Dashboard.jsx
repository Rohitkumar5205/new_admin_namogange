import { useState } from "react";
import { Link } from "react-router-dom";

import {
  FaUsers,
  FaHome,
  FaStar,
  FaCalendarAlt,
  FaClipboardList,
  FaUserFriends,
  FaHandsHelping,
  FaLayerGroup,
  FaDonate,
  FaChild,
  FaPaintBrush,
  FaTheaterMasks,
} from "react-icons/fa";
import { FiActivity } from "react-icons/fi";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const cardBgGradients = [
  "from-blue-50 to-blue-100",
  "from-purple-50 to-purple-100",
  "from-green-50 to-green-100",
  "from-yellow-50 to-yellow-100",
  "from-pink-50 to-pink-100",
  "from-indigo-50 to-indigo-100",
  "from-teal-50 to-teal-100",
  "from-orange-50 to-orange-100",
];

const iconBgColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-teal-500",
  "bg-orange-500",
];

const textColors = [
  "text-blue-700",
  "text-purple-700",
  "text-green-700",
  "text-yellow-700",
  "text-pink-700",
  "text-indigo-700",
  "text-teal-700",
  "text-orange-700",
];

// 🔥 stable color (cards 10 ho ya 100)
const getColorById = (arr, id) => arr[id % arr.length];

//  first card data

const firstCard = [
  {
    id: 1,
    icon1: FaClipboardList,
    title: "Enquiry List",
    desc: "Daily Ganga Aarti schedule and bookings management.",
    link: "/enquiry/enquiry-list",
    bg: "from-blue-50 to-blue-100",
    iconBg: "bg-blue-500",
    text: "text-blue-700",
  },
  {
    id: 2,
    icon1: FaUserFriends,
    title: "Member List",
    desc: "Registered pilgrims and visitor records.",
    link: "/member/member-list",
    bg: "from-purple-50 to-purple-100",
    iconBg: "bg-purple-500",
    text: "text-purple-700",
  },
  {
    id: 3,
    icon1: FaHandsHelping,
    title: "Volunteers List",
    desc: "Upcoming religious events and festivals.",
    link: "/volunteer/volunteer-list",
    bg: "from-green-50 to-green-100",
    iconBg: "bg-green-500",
    text: "text-green-700",
  },
  {
    id: 4,
    icon1: FaLayerGroup,
    title: "16th AGS Section",
    desc: "Available services under Namami Gange.",
    link: "/services",
    bg: "from-yellow-50 to-yellow-100",
    iconBg: "bg-yellow-500",
    text: "text-yellow-700",
  },
  {
    id: 5,
    icon1: FaDonate,
    title: "TGMY",
    desc: "Donation records and transaction history.",
    link: "/donations",
    bg: "from-pink-50 to-pink-100",
    iconBg: "bg-pink-500",
    text: "text-pink-700",
  },
  {
    id: 6,
    icon1: FaChild,
    title: "Baccho Ki Rangshala",
    desc: "Daily & monthly activity reports.",
    link: "/reports",
    bg: "from-indigo-50 to-indigo-100",
    iconBg: "bg-indigo-500",
    text: "text-indigo-700",
  },
  {
    id: 7,
    icon1: FaPaintBrush,
    title: "Painting Competition",
    desc: "Volunteer registration and assignments.",
    link: "/volunteers",
    bg: "from-teal-50 to-teal-100",
    iconBg: "bg-teal-500",
    text: "text-teal-700",
  },
  {
    id: 8,
    icon1: FaTheaterMasks,
    title: "Nukkad Natak",
    desc: "Ghat locations and infrastructure details.",
    link: "/locations",
    bg: "from-orange-50 to-orange-100",
    iconBg: "bg-orange-500",
    text: "text-orange-700",
  },
];

const stats = [
  {
    title: "Enquiry ",
    value: "128",
    desc: "Completed interiors",
    icon: FaHome,
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    text: "text-blue-600",
  },
  {
    title: "Members",
    value: "23",
    desc: "This month",
    icon: FaUsers,
    bg: "bg-blue-50",
    iconBg: "bg-blue-500",
    text: "text-blue-600",
  },
  {
    title: "Volunteers",
    value: "42",
    desc: "Ongoing projects",
    icon: FaUsers,
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    text: "text-purple-600",
  },
  {
    title: "16th AGS Section",
    value: "18",
    desc: "Scheduled",
    icon: FaCalendarAlt,
    bg: "bg-purple-50",
    iconBg: "bg-purple-500",
    text: "text-purple-600",
  },
  {
    title: "TGMY",
    value: "86",
    desc: "Custom layouts",
    icon: FaLayerGroup,
    bg: "bg-green-50",
    iconBg: "bg-green-500",
    text: "text-green-600",
  },
  {
    title: "Baccho Ki Rangshala",
    value: "61",
    desc: "Client approved",
    icon: FaStar,
    bg: "bg-green-50",
    iconBg: "bg-green-500",
    text: "text-green-600",
  },
  {
    title: "Painting Competition",
    value: "64",
    desc: "Happy customers",
    icon: FaStar,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-500",
    text: "text-yellow-600",
  },
  {
    title: "Nukkad Natak",
    value: "4.8",
    desc: "Average score",
    icon: FiActivity,
    bg: "bg-yellow-50",
    iconBg: "bg-yellow-500",
    text: "text-yellow-600",
  },
];

// ===================== STATIC CHART DATA =====================

const projectTypes = [
  { name: "Residential", value: 45, color: "#6366f1" },
  { name: "Commercial", value: 30, color: "#8b5cf6" },
  { name: "Office", value: 15, color: "#ec4899" },
  { name: "Hospitality", value: 10, color: "#f59e0b" },
];

const revenueData = [
  { month: "Jan", revenue: 125000 },
  { month: "Feb", revenue: 145000 },
  { month: "Mar", revenue: 180000 },
  { month: "Apr", revenue: 165000 },
  { month: "May", revenue: 220000 },
  { month: "Jun", revenue: 195000 },
];
const renderInnerLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#fff"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={11}
      fontWeight={600}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
const activityLogs = [
  {
    user: "Chiranjeev",
    action:
      "Created a new Proforma Invoice for the LARM INDIA foods pvt ltd in Dashboard",
    time: "15 Jan 26 | 11:16",
  },
  {
    user: "Adnan",
    action:
      "Raaeshis Naturals New Status is Follow-up Call | Remark is FORM PENDING CREATE PI",
    time: "15 Jan 26 | 10:52",
  },
  {
    user: "Adnan",
    action:
      "Created a new Proforma Invoice for the RAAESHIS NATURALS in Dashboard",
    time: "15 Jan 26 | 10:48",
  },
  {
    user: "Adnan",
    action:
      "New Client Named RAAESHIS NATURALS Company has been added to the Dashboard",
    time: "15 Jan 26 | 10:45",
  },
];

const userStats = [
  { name: "Admin", NL: 0, WC: 0, HC: 0, CC: 0, NIC: 0, TC: 0, NP: 0, PP: 0 },
  { name: "Vijay", NL: 0, WC: 0, HC: 0, CC: 0, NIC: 0, TC: 0, NP: 0, PP: 0 },
  { name: "Accounts", NL: 0, WC: 0, HC: 0, CC: 0, NIC: 0, TC: 0, NP: 0, PP: 0 },
  {
    name: "Chiranjeev",
    NL: 0,
    WC: 0,
    HC: 1,
    CC: 0,
    NIC: 1,
    TC: 0,
    NP: 1,
    PP: 0,
  },
  { name: "Adnan", NL: 1, WC: 1, HC: 1, CC: 0, NIC: 0, TC: 2, NP: 3, PP: 0 },
];

// ===================== MAIN DASHBOARD =====================

const Dashboard = () => {
  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState("today");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">Dashboard</h2>
      </div>

      {/* <div>
        <h4 className=" text-gray-600 text-[15px] font-medium">All Charts</h4>
        <hr className="w-full border border-gray-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2">
        <div className="bg-white rounded-md p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">
            Project Type Distribution
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                label={renderInnerLabel}
                labelLine={false}
              >
                {projectTypes.map((v, i) => (
                  <Cell key={i} fill={v.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">
            Project Type Distribution
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                label={renderInnerLabel}
                labelLine={false}
              >
                {projectTypes.map((v, i) => (
                  <Cell key={i} fill={v.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">
            Project Type Distribution
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                label={renderInnerLabel}
                labelLine={false}
              >
                {projectTypes.map((v, i) => (
                  <Cell key={i} fill={v.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">
            Project Type Distribution
          </h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                label={renderInnerLabel}
                labelLine={false}
              >
                {projectTypes.map((v, i) => (
                  <Cell key={i} fill={v.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-md text-sm p-2 shadow-sm">
          <h3 className="font-medium mb-2">Project Type Distribution</h3>

          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={projectTypes}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={50}
                dataKey="value"
                label={renderInnerLabel}
                labelLine={false}
              >
                {projectTypes.map((v, i) => (
                  <Cell key={i} fill={v.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" tick={{ fontSize: 10 }} />

              <YAxis
                tickFormatter={(v) => `$${v / 1000}k`}
                tick={{ fontSize: 14 }}
              />

              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />

              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" tick={{ fontSize: 10 }} />

              <YAxis
                tickFormatter={(v) => `$${v / 1000}k`}
                tick={{ fontSize: 14 }}
              />

              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />

              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-2 shadow-sm">
          <h3 className="font-medium text-sm mb-2">Monthly Revenue</h3>

          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={revenueData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="month" tick={{ fontSize: 10 }} />

              <YAxis
                tickFormatter={(v) => `$${v / 1000}k`}
                tick={{ fontSize: 14 }}
              />

              <Tooltip
                contentStyle={{ fontSize: "12px" }}
                itemStyle={{ fontSize: "12px" }}
              />

              <Bar
                dataKey="revenue"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div> */}

      {/* tab  */}
      <div>
        <div className="flex items-center justify-between">
          {/* TITLE */}
          <h4 className="text-gray-600 text-[15px] font-medium">
            Users Activities
          </h4>

          {/* TABS */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1 mb-1">
            {[
              { key: "today", label: "Today" },
              { key: "yesterday", label: "Yesterday" },
              { key: "week", label: "This Week" },
              { key: "month", label: "This Month" },
              { key: "year", label: "This Year" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
            px-3 py-1 text-xs font-medium rounded-md
            transition-all duration-200
            ${
              activeTab === tab.key
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-600 hover:bg-white hover:text-gray-800"
            }
          `}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="w-full border border-gray-300 " />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon;

          const bg = getColorById(cardBgGradients, i);
          const iconBg = getColorById(iconBgColors, i);
          const textColor = getColorById(textColors, i);

          return (
            <div
              key={i}
              className={`rounded-md px-3 py-2   shadow-sm hover:shadow-xl
              transition-all duration-300 transition bg-gradient-to-br ${bg}`}
            >
              <div className="flex items-center justify-between">
                <div
                  className={`w-7 h-7 rounded-xl ${iconBg}
            flex items-center justify-center text-white shadow-md`}
                >
                  {" "}
                  <Icon size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-600">
                    {item.title}
                  </h4>
                </div>
                <div>
                  <p className={`text-xl font-semibold ${textColor}`}>
                    {item.value}
                  </p>
                </div>
              </div>

              {/* <p className="text-sm text-gray-500">{item.desc}</p> */}
            </div>
          );
        })}
      </div>

      {/* active table data   */}
      <div className="w-full flex flex-row gap-4 mt-3">
        {/* LEFT: ACTIVITY LOG */}
        <div className="w-[55%]  bg-white rounded-md shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase">
              Activity Log
            </h4>
          </div>

          {/* List */}
          <ul className="divide-y divide-gray-100">
            {activityLogs.map((item, i) => (
              <li
                key={i}
                className="px-4 py-3 flex justify-between hover:bg-gray-50 transition"
              >
                <p className="text-sm text-blue-600 leading-relaxed max-w-[75%]">
                  <span className="font-semibold">{item.user}</span> :{" "}
                  {item.action}
                </p>

                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {item.time}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: USER COUNT TABLE */}
        <div className="w-[45%] bg-white rounded-md shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-4 py-2 border-b border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 uppercase">
              User Summary
            </h4>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="px-3 py-2 text-left">Users</th>
                  <th className="px-2 py-2 text-center">EN</th>
                  <th className="px-2 py-2 text-center">MB</th>
                  <th className="px-2 py-2 text-center">VL</th>
                  <th className="px-2 py-2 text-center">16TH</th>
                  <th className="px-2 py-2 text-center">TGYM</th>
                  <th className="px-2 py-2 text-center">BKR</th>
                  <th className="px-2 py-2 text-center">PC</th>
                  <th className="px-2 py-2 text-center">NN</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {userStats.map((row, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-blue-600 font-medium">
                      {row.name}
                    </td>
                    <td className="px-2 py-2 text-center">{row.NL}</td>
                    <td className="px-2 py-2 text-center">{row.WC}</td>
                    <td className="px-2 py-2 text-center">{row.HC}</td>
                    <td className="px-2 py-2 text-center">{row.CC}</td>
                    <td className="px-2 py-2 text-center">{row.NIC}</td>
                    <td className="px-2 py-2 text-center">{row.TC}</td>
                    <td className="px-2 py-2 text-center">{row.NP}</td>
                    <td className="px-2 py-2 text-center">{row.PP}</td>
                  </tr>
                ))}
              </tbody>

              {/* Footer */}
              <tfoot className="border-t border-gray-200 bg-gray-50 font-semibold ">
                <tr>
                  <td className="px-3 py-2">Total</td>
                  <td className="px-2 py-2 text-center">1</td>
                  <td className="px-2 py-2 text-center">1</td>
                  <td className="px-2 py-2 text-center">2</td>
                  <td className="px-2 py-2 text-center">0</td>
                  <td className="px-2 py-2 text-center">0</td>
                  <td className="px-2 py-2 text-center">3</td>
                  <td className="px-2 py-2 text-center">4</td>
                  <td className="px-2 py-2 text-center">0</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
      <div>
        <h4 className=" text-gray-600 text-[15px] font-medium">All Cards</h4>
        <hr className="w-full border border-gray-300" />
      </div>
      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {firstCard.map((card) => {
          const Icon = card.icon1;

          const bg = getColorById(cardBgGradients, card.id);
          const iconBg = getColorById(iconBgColors, card.id);
          const textColor = getColorById(textColors, card.id);

          return (
            <Link
              key={card.id}
              to={card.link}
              className={`
          bg-gradient-to-br ${bg}
          rounded-xl py-2 px-6
          border border-gray-200
          shadow-sm hover:shadow-xl
          hover:border-blue-300
          transform hover:-translate-y-1 hover:scale-105
          transition-all duration-300 ease-in-out
          flex flex-col justify-between
          cursor-pointer
        `}
            >
              {/* TOP */}
              <div className="flex items-center gap-4 mb-2">
                {/* ICON */}
                <div
                  className={`w-11 h-11 rounded-full ${iconBg}
              flex items-center justify-center text-white shadow-md
              bg-gradient-to-tr from-white/20 to-white/0`}
                >
                  <Icon size={22} />
                </div>

                {/* TITLE */}
                <h4 className={`text-[15px] font-semibold ${textColor}`}>
                  {card.title}
                </h4>
              </div>

              {/* DESCRIPTION */}
              <p className="text-sm text-gray-600 leading-relaxed">
                {card.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
