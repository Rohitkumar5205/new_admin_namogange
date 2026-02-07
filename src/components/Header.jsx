import { useState, useRef, useEffect } from "react";
import {
  MdNotifications,
  MdLogout,
  MdPerson,
  MdSettings,
} from "react-icons/md";
import {
  MdNotificationsActive,
  MdHelpOutline,
  MdSupportAgent,
  MdBusiness,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // CLOSE ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
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

  return (
    <header className="h-15 bg-white shadow-md flex items-center justify-between px-6">
      {/* SEARCH */}
      <div className="h-15 px-4 py-4 ">
        <h1 className="text-xl font-medium text-center text-[#0C55A0]">
          Welcome Admin
        </h1>
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
        <IconWithTooltip label="Notifications">
          <div className="relative">
            <MdNotificationsActive size={22} className="text-gray-600" />
            <CountBadge count={5} />
          </div>
        </IconWithTooltip>

        {/* PROFILE */}
        <div className="relative" ref={dropdownRef}>
          <IconWithTooltip label="Profile">
            <div
              onClick={() => setOpen(!open)}
              className="w-7 h-7 rounded-full 
        bg-gradient-to-r from-[#F36B2A] to-[#0C55A0]
        flex items-center justify-center cursor-pointer
        shadow-md hover:scale-103 transition"
            >
              <FaUserCircle className="text-white text-2xl" />
            </div>
          </IconWithTooltip>

          {/* DROPDOWN (unchanged) */}
          {open && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              {/* USER INFO */}
              <div className="px-4 py-3 border-b border-gray-300">
                <p className="text-sm font-semibold text-gray-800">
                  Admin User
                </p>
                <p className="text-xs text-gray-500">admin@namo-gange.com</p>
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
