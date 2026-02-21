import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdLogout,
  MdPerson,
  MdSettings,
  MdNotificationsActive,
  MdHelpOutline,
  MdSupportAgent,
  MdBusiness,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

// Dummy data for notifications
const notificationsData = [
  {
    id: 1,
    message: "New user registered: John Doe",
    time: "15 minutes ago",
    read: false,
  },
  {
    id: 2,
    message: "Server #1 is running high on CPU.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    message: "A new donation of $500 has been received.",
    time: "4 hours ago",
    read: true,
  },
];

export default function Header() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileDropdownRef = useRef(null);
  const notificationsDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Notifications state
  const [notifications, setNotifications] = useState(notificationsData);
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleProfileClick = () => {
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false); // Close other dropdown
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false); // Close other dropdown
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };
  const IconWithTooltip = ({ label, children }) => {
    return (
      <div className="relative group cursor-pointer">
        {children}

        {/* TOOLTIP */}
        <div
          className="
            absolute top-8 left-1/2 -translate-x-1/2
            whitespace-nowrap rounded
            bg-gray-800 px-2 py-1 text-xs text-white
            opacity-0 group-hover:opacity-100
            transition-all duration-200
            pointer-events-none z-30
          "
        >
          {label}
        </div>
      </div>
    );
  };
  const CountBadge = ({ count }) => {
    if (!count) return null;

    return (
      <span
        className="
          absolute -top-2 -right-2
          min-w-[18px] h-[18px]
          px-1
          flex items-center justify-center
          rounded-full
          bg-red-500 text-white
          text-[10px] font-bold
          shadow-md
        "
      >
        {count > 99 ? "99+" : count}
      </span>
    );
  };
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) {
      return {
        text: "Good Morning",
        icon: "☀️",
      };
    } else if (hour < 17) {
      return {
        text: "Good Afternoon",
        icon: "🌤️",
      };
    } else {
      return {
        text: "Good Evening",
        icon: "🌙",
      };
    }
  };

  const greeting = getGreeting();

  const authUser = JSON.parse(localStorage.getItem("user"));
  const userId = authUser?._id || authUser?.id;
  const userName = authUser?.username || authUser?.name || "Admin";
  const userEmail = authUser?.email || "admin@namo-gange.com";

  return (
    <header className="h-15 bg-gradient-to-r from-orange-50 via-cyan-50 to-blue-50 shadow-md flex items-center justify-between px-6">
      {/* LEFT SECTION */}
      <div className="px-4 py-1 flex justify-center">
        <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-2xl px-5 py-1 flex items-center gap-4">
          {/* Dynamic Icon */}
          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-100 text-xl">
            {greeting.icon}
          </div>

          {/* Text Section */}
          <div className="flex-1">
            <h2 className="text-sm font-medium text-gray-700">
              {greeting.text},{" "}
              <span className="font-medium text-[#0C55A0]">{userName}</span>
            </h2>
            <div className="flex items-center gap-2 ">
              {/* Auto Pulse Green Dot */}
              <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>

              <span className="text-red-600 font-semibold tracking-widest text-xs">
                AUTHORIZED ACCESS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-8 relative">
        {/* Enquiry */}
        <IconWithTooltip label="Enquiry">
          <div className="relative">
            <MdHelpOutline size={22} className="text-gray-600" />
            <CountBadge count={2} />
          </div>
        </IconWithTooltip>

        {/* Help */}
        <IconWithTooltip label="Help & Support">
          <div className="relative">
            <MdSupportAgent size={22} className="text-gray-600" />
            <CountBadge count={1} />
          </div>
        </IconWithTooltip>

        {/* Moksha Voyage */}
        <IconWithTooltip label="Moksha Voyage">
          <div className="relative">
            <MdBusiness size={22} className="text-gray-600" />
            <CountBadge count={3} />
          </div>
        </IconWithTooltip>

        {/* Notifications */}
        <div className="relative" ref={notificationsDropdownRef}>
          <IconWithTooltip label="Notifications">
            <div className="relative" onClick={handleNotificationsClick}>
              <MdNotificationsActive size={22} className="text-gray-600" />
              <CountBadge count={unreadNotifications} />
            </div>
          </IconWithTooltip>
          {notificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 z-50 p-2.5 rounded-lg bg-gradient-to-r from-orange-50 via-cyan-50 to-blue-50 shadow-2xl border border-gray-200">
                <div className="mb-2 px-3 py-2 rounded-md bg-[#FAF7F2] border border-[#E6D7BD]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[14px] font-semibold text-gray-900">
                      Notifications
                    </h3>

                    {unreadNotifications > 0 && (
                      <span className="text-[10px] text-white font-semibold bg-[#8B6A3E] px-2 py-[3px] rounded-full">
                        {unreadNotifications} new
                      </span>
                    )}
                  </div>
                </div>

                <div className="max-h-[300px] overflow-y-auto space-y-1.5 pr-1">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`px-3 py-2 rounded-md border flex items-start gap-2.5 cursor-pointer transition-all duration-200
            ${
              !notification.read
                ? "bg-[#FFF7ED] border-[#D4B68A] hover:bg-[#FDEED8]"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
                      >
                        <div className="flex-shrink-0 mt-[5px]">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              !notification.read
                                ? "bg-[#8B6A3E]"
                                : "bg-gray-300"
                            }`}
                          />
                        </div>

                        {/* TEXT */}
                        <div className="flex-1 leading-tight">
                          <p
                            className={`text-[12.5px] ${
                              !notification.read
                                ? "text-gray-900 font-semibold"
                                : "text-gray-700"
                            }`}
                          >
                            {notification.message}
                          </p>

                          <p
                            className={`text-[10.5px] mt-[2px] ${
                              !notification.read
                                ? "text-[#8B6A3E]"
                                : "text-gray-500"
                            }`}
                          >
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    /* EMPTY STATE */
                    <div className="px-3 py-6 text-center rounded-xl bg-[#FAFAFA] border border-gray-200">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-100 flex items-center justify-center">
                        <MdNotifications size={18} className="text-gray-400" />
                      </div>

                      <p className="text-sm font-medium text-gray-600">
                        No notifications
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </div>

                {/* FOOTER */}
                {notifications.length > 0 && (
                  <div className="mt-2 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E6D7BD] text-center">
                    <button
                      onClick={markAllAsRead}
                      className="text-[12px] text-[#8B6A3E] font-semibold hover:text-[#6B4F2E] transition-colors"
                    >
                      Mark all as read
                    </button>
                  </div>
                )}
              </div>
            )}
        </div>

        {/* PROFILE */}
        <div className="relative" ref={profileDropdownRef}>
          <IconWithTooltip label="Profile">
            <div
              onClick={handleProfileClick}
              className="w-7 h-7 rounded-full 
        bg-gradient-to-r from-[#F36B2A] to-[#0C55A0]
        flex items-center justify-center cursor-pointer
        shadow-md hover:scale-103 transition"
            >
              <FaUserCircle className="text-white text-2xl" />
            </div>
          </IconWithTooltip>

          {/* DROPDOWN (unchanged) */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-gradient-to-r from-orange-50 via-cyan-50 to-blue-50 rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              {/* USER INFO */}
              <div className="px-4 py-3 border-b border-gray-300">
                <p className="text-sm font-semibold text-gray-800">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">{userEmail}</p>
              </div>

              {/* MENU */}
              <div className="py-1">
                <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer">
                  <FaUserCircle className="text-[#0C55A0] text-lg" />
                  Profile
                </div>

                <div className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 cursor-pointer">
                  <MdSettings className="text-[#F36B2A] text-lg" />
                  Settings
                </div>
              </div>

              {/* LOGOUT */}
              <div className="border-t border-gray-200">
                <div
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  {" "}
                  <MdLogout className="text-lg" />
                  Logout
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
