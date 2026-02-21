import React, { useState, useEffect } from "react";
import {
  MdNotifications,
  MdDoneAll,
  MdAccessTime,
  MdInfo,
  MdAccountBalanceWallet,
  MdStar,
  MdCalendarToday,
  MdSettings,
  MdFilterList,
  MdSearch,
  MdKeyboardArrowDown,
  MdCheckCircle,
  MdCancel,
  MdNotificationsActive,
  MdNotificationsOff,
  MdVisibility,
  MdDelete,
  MdArchive,
  MdDownload,
  MdRefresh,
  MdMoreHoriz,
  MdCreditCard,
  MdChevronRight,
  MdMail,
  MdPrint,
} from "react-icons/md";

// Dummy data generator for initial state
const generateNotifications = () => [
  {
    id: "1",
    title: "New Enquiry Received",
    message:
      "You have received a new enquiry from Amit Kumar regarding 'Yoga Classes'.",
    type: "booking_created",
    priority: "high",
    isRead: false,
    archived: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Donation Received",
    message: "A donation of ₹5000 has been received from Rajesh Singh.",
    type: "payment_received",
    priority: "high",
    isRead: false,
    archived: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "Scheduled maintenance is planned for tonight at 2:00 AM.",
    type: "system",
    priority: "low",
    isRead: true,
    archived: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
  },
  {
    id: "4",
    title: "New Feedback",
    message: "Sarah Jones left a 5-star review for the 'Ganga Aarti' event.",
    type: "review_received",
    priority: "medium",
    isRead: true,
    archived: false,
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  },
  {
    id: "5",
    title: "Volunteer Registration",
    message:
      "New volunteer registration: Priya Sharma for 'Clean Ganga Drive'.",
    type: "booking_created",
    priority: "medium",
    isRead: false,
    archived: false,
    createdAt: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
  },
];

export default function Notification() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = () => {
      try {
        const data = localStorage.getItem("notifications");
        if (data) {
          const parsed = JSON.parse(data);
          setNotifications(parsed.map(convertToUINotification));
        } else {
          // Initialize with dummy data if empty
          const initialData = generateNotifications();
          setNotifications(initialData.map(convertToUINotification));
          localStorage.setItem("notifications", JSON.stringify(initialData));
        }
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotifications(generateNotifications().map(convertToUINotification));
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const convertToUINotification = (n) => {
    const createdAt = new Date(n.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let timeString = "";
    if (diffMins < 1) timeString = "Just now";
    else if (diffMins < 60) timeString = `${diffMins} minutes ago`;
    else if (diffHours < 24) timeString = `${diffHours} hours ago`;
    else if (diffDays === 1) timeString = "Yesterday";
    else timeString = `${diffDays} days ago`;

    let action;
    let data = {};

    switch (n.type) {
      case "booking_created":
        action = { label: "View Details" };
        break;
      case "booking_accepted":
        action = { label: "Manage" };
        break;
      case "payment_received":
        action = { label: "View Transaction" };
        const amountMatch = n.message && n.message.match(/₹(\d+)/);
        if (amountMatch) {
          data = { amount: parseInt(amountMatch[1]) };
        }
        break;
      case "review_received":
        action = { label: "View Feedback" };
        data = { rating: 5 };
        break;
    }

    return {
      ...n,
      time: timeString,
      date: createdAt.toISOString().split("T")[0],
      priority: n.priority || "medium",
      archived: n.archived || false,
      action,
      data,
    };
  };

  const [notificationStats, setNotificationStats] = useState({
    total: 0,
    unread: 0,
    today: 0,
    thisWeek: 0,
  });

  useEffect(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead && !n.archived).length;
    const today = notifications.filter(
      (n) => n.date === new Date().toISOString().split("T")[0] && !n.archived,
    ).length;
    const thisWeek = notifications.filter((n) => {
      const notifDate = new Date(n.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return notifDate >= weekAgo && !n.archived;
    }).length;

    setNotificationStats({ total, unread, today, thisWeek });
  }, [notifications]);

  const getNotificationIcon = (type) => {
    const iconProps = { size: 20 };

    switch (type) {
      case "booking_created":
      case "booking_accepted":
      case "booking_cancelled":
        return <MdCalendarToday {...iconProps} className="text-blue-600" />;
      case "payment_received":
      case "withdrawal_approved":
        return (
          <MdAccountBalanceWallet {...iconProps} className="text-green-600" />
        );
      case "review_received":
        return <MdStar {...iconProps} className="text-yellow-600" />;
      case "system":
        return <MdInfo {...iconProps} className="text-gray-600" />;
      default:
        return <MdNotifications {...iconProps} className="text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-600 border border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-600 border border-yellow-200";
      case "low":
        return "bg-gray-100 text-gray-600 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "booking_created":
        return "New Enquiry";
      case "booking_accepted":
        return "Accepted";
      case "booking_cancelled":
        return "Cancelled";
      case "payment_received":
        return "Payment";
      case "withdrawal_approved":
        return "Withdrawal";
      case "review_received":
        return "Feedback";
      case "system":
        return "System";
      default:
        return type;
    }
  };

  const updateLocalStorage = (newNotifications) => {
    localStorage.setItem("notifications", JSON.stringify(newNotifications));
  };

  const markAsRead = (id) => {
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, isRead: true } : notif,
    );
    setNotifications(updated);
    updateLocalStorage(updated);
  };

  // const markAllAsRead = () => {
  //   const updated = notifications.map((notif) => ({ ...notif, isRead: true }));
  //   setNotifications(updated);
  //   updateLocalStorage(updated);
  // };

  const archiveNotification = (id) => {
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, archived: true } : notif,
    );
    setNotifications(updated);
    updateLocalStorage(updated);
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((notif) => notif.id !== id);
    setNotifications(updated);
    updateLocalStorage(updated);
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (selectedTab === "unread" && notif.isRead) return false;
    if (selectedTab === "archived" && !notif.archived) return false;
    if (selectedTab !== "archived" && notif.archived) return false;

    if (
      searchQuery &&
      !notif.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !notif.message.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;

    if (selectedType && notif.type !== selectedType) return false;

    return true;
  });

  const groupedNotifications = filteredNotifications
    .reduce((groups, notif) => {
      const date = notif.date;
      const existingGroup = groups.find((g) => g.date === date);

      if (existingGroup) {
        existingGroup.notifications.push(notif);
      } else {
        groups.push({ date, notifications: [notif] });
      }

      return groups;
    }, [])
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDateHeader = (dateStr) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const notificationTypes = [
    {
      value: "booking_created",
      label: "Enquiries",
      icon: MdCalendarToday,
      color: "blue",
    },
    {
      value: "booking_accepted",
      label: "Accepted",
      icon: MdCheckCircle,
      color: "green",
    },
    {
      value: "booking_cancelled",
      label: "Cancelled",
      icon: MdCancel,
      color: "red",
    },
    {
      value: "payment_received",
      label: "Payments",
      icon: MdAccountBalanceWallet,
      color: "purple",
    },
    {
      value: "withdrawal_approved",
      label: "Withdrawals",
      icon: MdCreditCard,
      color: "indigo",
    },
    {
      value: "review_received",
      label: "Reviews",
      icon: MdStar,
      color: "yellow",
    },
    { value: "system", label: "System", icon: MdInfo, color: "gray" },
  ];

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 17) return "Afternoon";
    return "Evening";
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold text-gray-600">
        Loading notifications...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
      >
        {" "}
        <div className="absolute inset-0 bg-black/0"></div>{" "}
        <div className="px-4 md:px-6 py-4 md:py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
<h2 className="text-xl font-semibold text-white">                  Notifications
                </h2>
                <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
                  Admin Panel
                </span>
              </div>
              <p className="text-sm text-blue-100 md:text-base flex items-center gap-2">
                <MdNotifications className="w-4 h-4" />
                Good {getTimeOfDay()}! Stay updated with your latest activities
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
                <MdMail color="white" size={20} />
                {notificationStats.unread > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {/* <button
                onClick={markAllAsRead}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition flex items-center gap-2"
              >
                <MdDoneAll className="w-4 h-4" />
                <span className="hidden sm:inline">Mark All Read</span>
              </button> */}
              {/* <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition flex items-center gap-2">
                <MdSettings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button> */}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4  space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg py-1 px-3 border border-gray-200 shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-all">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-full">
              <MdNotifications size={20} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                Total
              </p>
              <p className="text-lg font-medium text-gray-900">
                {notificationStats.total}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg py-1 px-3 border border-gray-200 shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-all">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
              <MdNotificationsActive size={20} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                Unread
              </p>
              <p className="text-lg font-medium text-gray-900">
                {notificationStats.unread}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg py-1 px-3 border border-gray-200 shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-all">
            <div className="p-2 bg-green-50 text-green-600 rounded-full">
              <MdAccessTime size={20} />
            </div>
            <div className="text-center">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                Today
              </p>
              <p className="text-lg font-medium text-gray-900">
                {notificationStats.today}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg py-1 px-3 border border-gray-200 shadow-sm flex justify-between items-center gap-4 hover:shadow-md transition-all">
            <div className="p-2 bg-pink-50 text-pink-600 rounded-full">
              <MdCalendarToday size={20} />
            </div>
              <div className="text-center">
              <p className="text-xs font-medium text-gray-700 uppercase tracking-wider">
                This Week
              </p>
              <p className="text-lg font-medium text-gray-900">
                {notificationStats.thisWeek}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-4 bg-gray-50">
            <div className="flex">
              {["all", "unread", "archived"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-3 text-sm font-medium capitalize relative ${
                    selectedTab === tab
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                  {tab === "unread" && notificationStats.unread > 0 && (
                    <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-500 text-white rounded-full">
                      {notificationStats.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-b border-gray-200">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <MdSearch
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search notifications by title or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 bg-white"
              >
                <MdFilterList size={18} className="text-gray-600" />
                Filter by Type
                <MdKeyboardArrowDown
                  size={16}
                  className={`transition ${showFilters ? "rotate-180" : ""}`}
                />
              </button>

              <button
                onClick={() => {
                  const data = localStorage.getItem("notifications");
                  if (data) {
                    const allNotifications = JSON.parse(data);
                    setNotifications(
                      allNotifications.map(convertToUINotification),
                    );
                  }
                }}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white"
              >
                <MdRefresh size={18} className="text-gray-600" />
              </button>

              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
                <MdDownload size={18} className="text-gray-600" />
              </button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedType(null)}
                    className={`px-3 py-1.5 text-sm rounded-lg border ${
                      selectedType === null
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50 bg-white"
                    }`}
                  >
                    All Types
                  </button>
                  {notificationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        onClick={() =>
                          setSelectedType(
                            selectedType === type.value ? null : type.value,
                          )
                        }
                        className={`px-3 py-1.5 text-sm rounded-lg border flex items-center gap-1 ${
                          selectedType === type.value
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 hover:bg-gray-50 bg-white"
                        }`}
                      >
                        <Icon size={14} />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="max-h-[500px] overflow-y-auto">
            {groupedNotifications.length > 0 ? (
              groupedNotifications.map((group) => (
                <div key={group.date}>
                  <div className="px-4 py-2 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-700">
                      {formatDateHeader(group.date)}
                    </h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <tbody className="divide-y divide-gray-200">
                        {group.notifications.map((notification) => (
                          <tr
                            key={notification.id}
                            className={`hover:bg-gray-50 transition relative ${
                              !notification.isRead ? "bg-blue-50/30" : ""
                            }`}
                          >
                            <td className="p-4">
                              <div className="flex gap-3">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center border-2 border-white shadow-sm">
                                    {getNotificationIcon(
                                      notification.type,
                                      notification.priority,
                                    )}
                                  </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <div className="flex flex-wrap items-center gap-2 mb-1">
                                        <h4 className="text-sm font-semibold text-gray-900">
                                          {notification.title}
                                        </h4>
                                        <span
                                          className={`text-xs px-2 py-0.5 rounded-full ${getPriorityBadge(notification.priority)}`}
                                        >
                                          {notification.priority}
                                        </span>
                                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full border border-gray-200">
                                          {getTypeLabel(notification.type)}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-600 mb-2">
                                        {notification.message}
                                      </p>

                                      {notification.action && (
                                        <button className="text-xs text-blue-600 hover:underline flex items-center gap-1 mb-2 font-medium">
                                          {notification.action.label}
                                          <MdChevronRight size={12} />
                                        </button>
                                      )}

                                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                                        <span className="flex items-center gap-1">
                                          <MdAccessTime size={12} />
                                          {notification.time}
                                        </span>
                                        {notification.data?.amount && (
                                          <>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <span className="font-medium text-green-600">
                                              ₹{notification.data.amount}
                                            </span>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-1 mt-2 sm:mt-0">
                                      {!notification.isRead && (
                                        <button
                                          onClick={() =>
                                            markAsRead(notification.id)
                                          }
                                          className="p-1.5 hover:bg-blue-50 rounded-lg transition"
                                          title="Mark as read"
                                        >
                                          <MdVisibility
                                            size={16}
                                            className="text-gray-500"
                                          />
                                        </button>
                                      )}
                                      {!notification.archived && (
                                        <button
                                          onClick={() =>
                                            archiveNotification(notification.id)
                                          }
                                          className="p-1.5 hover:bg-blue-50 rounded-lg transition"
                                          title="Archive"
                                        >
                                          <MdArchive
                                            size={16}
                                            className="text-gray-500"
                                          />
                                        </button>
                                      )}
                                      <button
                                        onClick={() =>
                                          deleteNotification(notification.id)
                                        }
                                        className="p-1.5 hover:bg-blue-50 rounded-lg transition"
                                        title="Delete"
                                      >
                                        <MdDelete
                                          size={16}
                                          className="text-gray-500"
                                        />
                                      </button>
                                      <button className="p-1.5 hover:bg-blue-50 rounded-lg transition">
                                        <MdMoreHoriz
                                          size={16}
                                          className="text-gray-500"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {!notification.isRead && (
                                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-10 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-r"></div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <MdNotificationsOff size={40} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No notifications
                </h3>
                <p className="text-sm text-gray-500 max-w-sm mx-auto">
                  {selectedTab === "unread"
                    ? "You have no unread notifications. Great job staying on top of things!"
                    : selectedTab === "archived"
                      ? "No archived notifications. Archive notifications to keep your inbox clean."
                      : "You're all caught up! Check back later for new updates."}
                </p>
                {selectedTab !== "all" && (
                  <button
                    onClick={() => setSelectedTab("all")}
                    className="mt-4 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    View All Notifications
                  </button>
                )}
              </div>
            )}
          </div>

          {groupedNotifications.length > 0 && (
            <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50">
              <div className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {filteredNotifications.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {notifications.length}
                </span>{" "}
                notifications
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 bg-white flex items-center gap-1">
                  <MdDownload size={14} />
                  Export
                </button>
                <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 bg-white flex items-center gap-1">
                  <MdPrint size={14} />
                  Print
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition flex flex-col items-center gap-2 group">
            <div className="p-2 bg-purple-100 rounded-lg group-hover:scale-110 transition">
              <MdSettings size={18} className="text-purple-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Notification Settings
            </span>
          </button>
          <button className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition flex flex-col items-center gap-2 group">
            <div className="p-2 bg-blue-100 rounded-lg group-hover:scale-110 transition">
              <MdAccessTime size={18} className="text-blue-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Quiet Hours
            </span>
          </button>
          <button className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition flex flex-col items-center gap-2 group">
            <div className="p-2 bg-gray-100 rounded-lg group-hover:scale-110 transition">
              <MdNotificationsOff size={18} className="text-gray-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">Mute All</span>
          </button>
          <button className="p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition flex flex-col items-center gap-2 group">
            <div className="p-2 bg-green-100 rounded-lg group-hover:scale-110 transition">
              <MdDownload size={18} className="text-green-600" />
            </div>
            <span className="text-xs font-medium text-gray-700">
              Download Log
            </span>
          </button>
        </div>

        <div className="bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300 rounded-xl p-4 text-white">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MdMail size={20} />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Email Digest</h3>
                <p className="text-xs text-blue-100">
                  Get a daily summary of all your notifications directly in your
                  inbox
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-white text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50 transition">
              Configure
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-100">Daily</p>
              <p className="text-sm font-semibold">8:00 AM</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-100">Weekly</p>
              <p className="text-sm font-semibold">Monday</p>
            </div>
            <div className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-100">Monthly</p>
              <p className="text-sm font-semibold">1st</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
