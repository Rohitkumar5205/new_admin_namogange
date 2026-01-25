import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdLogout,
  MdCorporateFare,
  MdVerified,
  MdSupportAgent,
  MdArticle,
  MdQuestionAnswer,
  MdCategory,
  MdCardMembership,
  MdOutlineVolunteerActivism,
} from "react-icons/md";
import { FaChevronDown, FaChevronUp, FaRegBuilding } from "react-icons/fa";
import { GoPersonFill } from "react-icons/go";
import { FiSliders, FiSettings, FiImage, FiMail } from "react-icons/fi";
import { BiSolidInstitution } from "react-icons/bi";
import { AiFillHome } from "react-icons/ai";
import { SiOpenapiinitiative } from "react-icons/si";
import { FaDatabase, FaRegUser } from "react-icons/fa6";
import { IoNewspaper } from "react-icons/io5";
import { PiNewspaperBold } from "react-icons/pi";
import { FaDonate } from "react-icons/fa";
import { HiTrendingUp } from "react-icons/hi";
import { FaChild } from "react-icons/fa";
import { FaPalette } from "react-icons/fa";
import { FaTheaterMasks } from "react-icons/fa";
import { IoIosInformationCircle } from "react-icons/io";
import { SlSupport } from "react-icons/sl";
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [openMenu, setOpenMenu] = useState("Drivers");

  const isActive = (path) => location.pathname === path;

  /* ======================
     SIDEBAR CONFIG (JSON)
  ====================== */
  const sidebarData = [
    {
      section: "MAIN",
      items: [
        { label: "Dashboard", path: "/dashboard", icon: MdDashboard },
        {
          label: "Home Banner",
          icon: FiSliders,
          path: "/home-banner",
        },
        { label: "Objective", path: "/objective", icon: MdCorporateFare },
        { label: "Testimonial", path: "/testimonial", icon: MdCorporateFare },
        { label: "Initiatives", path: "/initiatives", icon: MdCorporateFare },
        {
          label: "Media",
          icon: FiImage,
          children: [
            { label: "Photos Gallery", path: "/media/photos-gallery" },
            { label: "Videos Gallery", path: "/media/videos-gallery" },
          ],
        },
        {
          label: "Trust Bodies",
          icon: FiImage,
          children: [
            {
              label: "Add Trust Bodies",
              path: "/trust-bodies/add-trust-bodies",
            },
            {
              label: "Trust Bodies List",
              path: "/trust-bodies/trust-bodies-list",
            },
          ],
        },
        {
          label: "News Updates",
          icon: FaRegBuilding,
          children: [
            { label: "Add News Updates", path: "/news/add-news-updates" },
            { label: "News Updates List", path: "/news/news-updates-list" },
          ],
        },
        { label: "News Letters", path: "/news-letters", icon: PiNewspaperBold },
        {
          label: "Blogs",
          icon: MdArticle,
          children: [
            { label: "Add Blog", path: "/blogs/add-blog" },
            { label: "Blog List", path: "/blogs/blog-list" },
          ],
        },
        { label: "FAQ", path: "/faq", icon: MdQuestionAnswer },
        {
          label: "Enquiry List",
          path: "/enquiry/enquiry-list",
          icon: IoIosInformationCircle,
        },
        {
          label: "Support List",
          path: "/support/support-list",
          icon: SlSupport,
        },
      ],
    },
    {
      section: "PARTNER SECTION",
      items: [
        {
          label: "Member",
          icon: MdCardMembership,
          children: [
            { label: "Add Member", path: "/member/add-member" },
            { label: "Member List", path: "/member/member-list" },
          ],
        },
        {
          label: "Volunteer",
          icon: MdOutlineVolunteerActivism,
          children: [
            { label: "Add Volunteer", path: "/volunteer/add-volunteer" },
            { label: "Volunteer List", path: "/volunteer/volunteer-list" },
          ],
        },
        {
          label: "Donation",
          icon: FaDonate,
          children: [
            { label: "Add Donation", path: "/donation/add-donation" },
            { label: "Donation List", path: "/donation/donation-list" },
          ],
        },
      ],
    },
    {
      section: "EVENT SECTION",
      items: [
        {
          label: "16th AGS Section",
          icon: GoPersonFill,
          children: [
            { label: "Web Enquiry", path: "/16th-ags-section/web-enquiry" },
            { label: "Delegates", path: "/16th-ags-section/delegate-list" },
            { label: "New Data", path: "/16th-ags-section/new-data" },
            { label: "Warm Data", path: "/16th-ags-section/warm-data" },
            { label: "Hot Data", path: "/16th-ags-section/hot-data" },
            { label: "Cold Data", path: "/16th-ags-section/cold-data" },
            {
              label: "Master Delegate Data",
              path: "/16th-ags-section/master-delegate-data",
            },
          ],
        },
        {
          label: "TGMY",
          icon: HiTrendingUp,
          children: [
            { label: "Add New Contestants", path: "/tgym/add-contestant" },
            { label: "General Contestants", path: "/tgym/general-contestant" },
            {
              label: "Follow UP Contestants",
              path: "/tgym/follow-up-contestant",
            },
            { label: "Hot Contestants", path: "/tgym/hot-contestant" },
            {
              label: "Audition Contestants",
              path: "/tgym/audition-contestant",
            },
            { label: "Video Contestants", path: "/tgym/video-contestant" },
            { label: "Finale Contestants", path: "/tgym/finale-contestant" },
            { label: "Master Contestants", path: "/tgym/master-contestant" },
            {
              label: "Not Intr. Contestants",
              path: "/tgym/not-intr-contestant",
            },
          ],
        },
        {
          label: "Baccho Ki Rangshala",
          icon: FaChild,
          children: [
            {
              label: "Add Rangshala",
              path: "/baccho-ki-rangshala/add-rangshala",
            },
            {
              label: "Rangshala List",
              path: "/baccho-ki-rangshala/rangshala-list",
            },
          ],
        },
        {
          label: "Painting Competition",
          icon: FaPalette,
          children: [
            {
              label: "Add Painting",
              path: "/painting-competition/add-painting",
            },
            {
              label: "Painting List",
              path: "/painting-competition/painting-list",
            },
          ],
        },
        {
          label: "Nukkad Natak",
          icon: FaTheaterMasks,
          children: [
            { label: "Add Natak", path: "/nukkad-natak/add-natak" },
            { label: "Natak List", path: "/nukkad-natak/natak-list" },
          ],
        },
      ],
    },

    {
      section: "ADMIN MANAGEMENT",
      items: [
        {
          label: "Add By Admin",
          icon: FaDatabase,
          children: [
            { label: "Add Occupation", path: "/add_by_admin/add-occupation" },
            {
              label: "Add Organization",
              path: "/add_by_admin/organization ",
            },
            { label: "Add Designation", path: "/add_by_admin/designation" },
            { label: "Add Department", path: "/add_by_admin/department" },
            { label: "Add Category", path: "/add_by_admin/category" },
            { label: "Add Profession", path: "/add_by_admin/profession" },
            { label: "Add Event", path: "/add_by_admin/event" },
            { label: "Add Status", path: "/add_by_admin/status" },
            { label: "Add University", path: "/add_by_admin/university" },
            { label: "Add Source", path: "/add_by_admin/source" },
            { label: "Add Enquiry", path: "/add_by_admin/enquiry" },
            { label: "Add Data", path: "/add_by_admin/data" },
            { label: "Add Target", path: "/add_by_admin/target" },
            {
              label: "Add Coordinator Status",
              path: "/add_by_admin/coordinator",
            },
            { label: "Add Bank", path: "/add_by_admin/bank" },
            { label: "Image Category", path: "/add_by_admin/image-category" },
          ],
        },

        {
          label: "Users",
          icon: FaRegUser,
          children: [
            { label: "Add User", path: "/users/user" },
            // { label: "Activity Log", path: "/users/activity-log" },
          ],
        },
        {
          label: "Colleges",
          icon: BiSolidInstitution,
          children: [
            { label: "Add College", path: "/collage/add-college" },
            { label: "College List", path: "/collage/college-list" },
          ],
        },
      ],
    },

    // {
    //   section: "CONTENT",
    //   items: [{ label: "FAQ", path: "/faq", icon: MdQuestionAnswer }],
    // },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-screen flex flex-col">
      {/* LOGO */}
      <div className="h-15 px-4 flex justify-center items-center shadow-md">
        <img
          src="/namo_gange.png"
          alt="Namo Gange"
          className="h-14 w-auto object-contain"
        />
      </div>

      {/* MENU */}
      <div className="flex-1 overflow-y-auto px-1.5 py-3">
        {sidebarData.map((section) => (
          <div key={section.section} className="mb-4">
            <p className="text-xs text-gray-400 px-3 mb-1">{section.section}</p>

            {section.items.map((item) => {
              const Icon = item.icon;

              /* ===== NESTED MENU ===== */
              if (item.children) {
                const isOpen = openMenu === item.label;

                return (
                  <div key={item.label}>
                    <div
                      onClick={() => setOpenMenu(isOpen ? "" : item.label)}
                      className="flex items-center justify-between px-4 py-1.5 rounded cursor-pointer text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <Icon />
                        {item.label}
                      </div>
                      {isOpen ? (
                        <FaChevronUp size={12} />
                      ) : (
                        <FaChevronDown size={12} />
                      )}
                    </div>

                    {isOpen && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          return (
                            <div
                              key={child.path}
                              onClick={() => navigate(child.path)}
                              className={`flex items-center gap-3 px-4 py-1 rounded cursor-pointer text-sm
                                ${isActive(child.path)
                                  ? "bg-blue-50 text-[#0C55A0] font-medium"
                                  : "text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                              {/* <ChildIcon size={14} /> */}
                              {child.label}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              /* ===== NORMAL MENU ===== */
              return (
                <div
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-3 px-4 py-1.5 rounded cursor-pointer text-sm
                    ${isActive(item.path)
                      ? "bg-blue-50 text-[#0C55A0] font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon />
                  {item.label}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* LOGOUT */}
      <div className="p-4 border-t-3 border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-1.5 rounded-md text-sm">
          <MdLogout />
          Logout
        </button>
      </div>
    </aside>
  );
}
