import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllClickAnalytics } from "../../redux/slices/click-analytics/clickAnalyticsSlice";
import {
    FaWhatsapp,
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaYoutube,
    FaSearch,
    FaPhoneAlt,
    FaCalendarAlt,
    FaMailBulk
} from "react-icons/fa";
import { FiMousePointer, FiArrowRight, FiFilter } from "react-icons/fi";
import { MdOutlineAdsClick, MdGroups } from "react-icons/md";
import { motion } from "framer-motion";

const ClickAnalytics = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector((state) => state.clickAnalytics || {});

    const [searchTerm, setSearchTerm] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        dispatch(getAllClickAnalytics());
    }, [dispatch]);

    // Data Binding based on the new sample JSON structure
    const counts = data?.stats || {
        total: 0,
        whatsapp: 0,
        facebook: 0,
        instagram: 0,
        twitter: 0,
        linkedin: 0,
        youtube: 0
    };

    const logs = data?.logs || [];

    const summaryCards = [
        {
            id: 1,
            title: "TOTAL CLICKS",
            value: counts.total || 0,
            desc: "Total interactions",
            icon: <MdOutlineAdsClick size={18} />,
            bgColor: "bg-blue-600",
            accentBg: "bg-blue-50",
            numberBoxColor: "border-blue-600 text-blue-600",
            iconBg: "bg-blue-700"
        },
        {
            id: 2,
            title: "WHATSAPP",
            value: counts.whatsapp || 0,
            desc: "WhatsApp chat clicks",
            icon: <FaWhatsapp size={18} />,
            bgColor: "bg-green-600",
            accentBg: "bg-green-50",
            numberBoxColor: "border-green-600 text-green-600",
            iconBg: "bg-green-700"
        },
        {
            id: 3,
            title: "FACEBOOK",
            value: counts.facebook || 0,
            desc: "Facebook clicks",
            icon: <FaFacebookF size={18} />,
            bgColor: "bg-indigo-600",
            accentBg: "bg-indigo-50",
            numberBoxColor: "border-indigo-600 text-indigo-600",
            iconBg: "bg-indigo-700"
        },
        {
            id: 4,
            title: "INSTAGRAM",
            value: counts.instagram || 0,
            desc: "Instagram clicks",
            icon: <FaInstagram size={18} />,
            bgColor: "bg-pink-600",
            accentBg: "bg-pink-50",
            numberBoxColor: "border-pink-600 text-pink-600",
            iconBg: "bg-pink-700"
        },
        {
            id: 5,
            title: "TWITTER",
            value: counts.twitter || 0,
            desc: "Twitter clicks",
            icon: <FaTwitter size={18} />,
            bgColor: "bg-sky-500",
            accentBg: "bg-sky-50",
            numberBoxColor: "border-sky-500 text-sky-500",
            iconBg: "bg-sky-600"
        },
        {
            id: 6,
            title: "LINKEDIN",
            value: counts.linkedin || 0,
            desc: "LinkedIn clicks",
            icon: <FaLinkedinIn size={18} />,
            bgColor: "bg-blue-800",
            accentBg: "bg-blue-50",
            numberBoxColor: "border-blue-800 text-blue-800",
            iconBg: "bg-blue-900"
        },
        {
            id: 7,
            title: "YOUTUBE",
            value: counts.youtube || 0,
            desc: "YouTube clicks",
            icon: <FaYoutube size={18} />,
            bgColor: "bg-red-600",
            accentBg: "bg-red-50",
            numberBoxColor: "border-red-600 text-red-600",
            iconBg: "bg-red-700"
        },
        {
            id: 8,
            title: "Call Us",
            value: counts.call_us || 0,
            desc: "Call Us clicks",
            icon: <FaPhoneAlt size={18} />,
            bgColor: "bg-red-600",
            accentBg: "bg-red-50",
            numberBoxColor: "border-red-600 text-red-600",
            iconBg: "bg-red-700"
        },
        {
            id: 9,
            title: "Mail Us",
            value: counts.mail_us || 0,
            desc: "Mail Us clicks",
            icon: <FaMailBulk size={18} />,
            bgColor: "bg-red-600",
            accentBg: "bg-red-50",
            numberBoxColor: "border-red-600 text-red-600",
            iconBg: "bg-red-700"
        }
    ];

    /* ===== PAGINATION LOGIC ===== */
    const filteredLogs = logs.filter(log =>
        log.iconName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.ipAddress?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentLogs = filteredLogs.slice(startIndex, startIndex + itemsPerPage);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 3;
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            for (let i = 1; i <= maxVisible; i++) pages.push(i);
            pages.push("...");
            pages.push(totalPages);
        }
        return pages;
    };

    const getPlatformIcon = (iconName) => {
        switch (iconName?.toLowerCase()) {
            case "whatsapp": return <FaWhatsapp className="text-green-500" />;
            case "facebook": return <FaFacebookF className="text-indigo-600" />;
            case "instagram": return <FaInstagram className="text-pink-500" />;
            case "twitter": return <FaTwitter className="text-sky-500" />;
            case "linkedin": return <FaLinkedinIn className="text-blue-700" />;
            case "youtube": return <FaYoutube className="text-red-600" />;
            case "call float": return <FaPhoneAlt className="text-blue-500" />;
            default: return <FiMousePointer />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div
                className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
 bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
            >
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="relative flex justify-center items-center px-6 py-4 h-25">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col text-center">
                            <h2 className="text-xl font-semibold text-gray-700 text-center uppercase tracking-wide">
                                Click Analytics Management
                            </h2>
                            <p className="text-sm text-gray-600 max-w-2xl">
                                Track and monitor all user interactions on floating website widgets including WhatsApp, Facebook, Instagram, Twitter, LinkedIn, YouTube, Call, and Social media clicks.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-3 p-5">

                {/* SUMMARY CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                    {summaryCards.map((card) => (
                        <motion.div
                            key={card.id}
                            whileHover={{ scale: 1.02 }}
                            className="bg-white rounded-md shadow-sm border border-gray-200 p-4 relative overflow-hidden h-32 flex flex-col justify-between group"
                        >
                            {loading ? (
                                <div className="h-full flex flex-col justify-center gap-2">
                                    <div className="h-4 w-1/3 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-8 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                                    <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-center z-10">
                                        <div className={`p-1.5 ${card.iconBg} text-white rounded-sm shadow-sm`}>
                                            {card.icon}
                                        </div>
                                        <div className={`w-5 h-5 flex items-center justify-center border ${card.numberBoxColor} text-[10px] font-bold rounded-sm bg-white`}>
                                            {card.id}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-2xl font-bold text-gray-800 z-10">
                                        {card.value}
                                    </div>
                                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter z-10">
                                        {card.title}
                                    </div>
                                </>
                            )}
                            <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full ${card.accentBg} transition-transform duration-500 group-hover:scale-125 opacity-70`}></div>
                        </motion.div>
                    ))}
                </div>

                {/* ================= TABLE ================= */}
                <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-5 py-2 border-b bg-gray-200 border-gray-200 flex justify-between items-center">
                        <h3 className="text-base font-medium text-gray-800">Detailed Tracking Logs</h3>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={12} />
                                <input
                                    type="text"
                                    placeholder="Search logs..."
                                    className="pl-8 pr-3 py-1 text-xs border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="border border-gray-300 rounded px-2 py-1 text-xs outline-none bg-white"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={5}>5 per page</option>
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                            </select>
                        </div>
                    </div>

                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3 font-medium">S.NO</th>
                                <th className="px-4 py-3 font-medium">Interacted Icon</th>
                                <th className="px-4 py-3 font-medium">IP Address</th>
                                <th className="px-4 py-3 font-medium">Clicked At</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading && logs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 font-medium text-gray-400">Loading tracking logs...</td>
                                </tr>
                            ) : currentLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 font-medium text-gray-400 italic">No tracking records found</td>
                                </tr>
                            ) : (
                                currentLogs.map((log, index) => (
                                    <tr key={log._id} className="border-b border-gray-100 hover:bg-blue-50/30 transition-colors group bg-white">
                                        <td className="px-6 py-4 text-sm font-bold text-gray-400 group-hover:text-blue-600 transition-colors">{startIndex + index + 1}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-white border border-transparent group-hover:border-blue-100 transition-all shadow-sm">
                                                    {getPlatformIcon(log.iconName)}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">{log.iconName}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-mono rounded-full border border-gray-200">
                                                {log.ipAddress}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {new Date(log.createdAt).toLocaleString('en-GB', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                hour12: true
                                            }).replace(',', ' |')}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* ================= PAGINATION - HomeBanner Pattern ================= */}
                    <div className="flex justify-between items-center p-4 bg-white">
                        <span className="text-sm text-gray-500">
                            Showing {startIndex + 1}–
                            {Math.min(startIndex + itemsPerPage, filteredLogs.length)} of{" "}
                            {filteredLogs.length}
                        </span>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-l-lg disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((p, i) =>
                                p === "..." ? (
                                    <span key={i} className="px-3 h-8 border flex items-center">
                                        …
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setCurrentPage(p)}
                                        className={`px-3 h-8 border border-gray-300 hover:bg-gray-50 ${currentPage === p
                                            ? "bg-blue-50 text-blue-600 font-semibold"
                                            : ""
                                            }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}

                            <button
                                onClick={() =>
                                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                                }
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-r-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClickAnalytics;
