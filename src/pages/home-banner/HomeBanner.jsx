import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../redux/slices/home-banner/bannerSlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import { MdSchedule } from "react-icons/md";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const HomeBanner = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banner);
  // console.log("banners", banners);
  const [isSubmitting, setIsSubmitting] = useState(false);
  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    link: "",
    image: null,
    imagePreview: "",
    status: "Active",
    created_by: "",
    updated_by: "",
  });
  const [schedule, setSchedule] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("user"));
  // const currentUserId = authUser?.id || null;
  // const currentUserName = authUser?.username || "";

  const handleScheduleChange = (e) => {
    const { name, value } = e.target;
    setSchedule((prev) => ({ ...prev, [name]: value }));
  };
  const handleSaveSchedule = () => {
    if (
      !schedule.startDate ||
      !schedule.startTime ||
      !schedule.endDate ||
      !schedule.endTime
    ) {
      showError("Please fill all schedule fields");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      schedule: {
        start_date: schedule.startDate,
        start_time: schedule.startTime,
        end_date: schedule.endDate,
        end_time: schedule.endTime,
      },
    }));

    setShowScheduleModal(false);
    showSuccess("Schedule added successfully");
  };

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllBanners());
  }, [dispatch]);

  // Get permissions for the current user on "Home Banner" page
  const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.HOME_BANNER);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files?.[0]) {
      setFormData({
        ...formData,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0]), // 👈
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      title: "",
      link: "",
      image: null,
      status: "Active",
      created_by: "",
      updated_by: "",
      schedule: null,
    });
    setSchedule({
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
    });
    setIsEdit(false);
  };

  const handleDelete = (id) => {
    // const currentUserName = "66ec23d89309636c42738591";
    const currentUserId = authUser?.id || null;
    // console.log("delete,,,", currentUserId);
    dispatch(deleteBanner({ id: id, user_id: currentUserId })).then(() => {
      showSuccess("Banner deleted successfully ");
      dispatch(getAllBanners());
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showError("Title is required.");
      return;
    }
    // Log the form data before submitting
    console.log("Form Data to be submitted:", formData);
    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("link", formData.link);
    dataToSend.append("status", formData.status);
    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image);
    }
    if (formData.schedule) {
      dataToSend.append("schedule", JSON.stringify(formData.schedule));
    }
    // const currentUserName = "66ec23d89309636c42738591";
    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";

    try {
      if (isEdit) {
        dataToSend.append("updated_by", currentUserName);
        dataToSend.append("user_id", currentUserId);
        await dispatch(
          updateBanner({ id: formData._id, formData: dataToSend })
        ).unwrap();
        showSuccess("Banner updated successfully ✅");
      } else {
        dataToSend.append("created_by", currentUserName);
        dataToSend.append("updated_by", currentUserName);
        dataToSend.append("user_id", currentUserId);
        await dispatch(createBanner(dataToSend)).unwrap();
        showSuccess("Banner added successfully ");
      }

      await dispatch(getAllBanners()).unwrap();
      resetForm();
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      showError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil((banners?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = banners?.slice(startIndex, endIndex) || [];

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

  return (
    <div className="">
      {/* ================= HEADER ================= */}
      <div
        // className="relative overflow-hidden  shadow-sm border border-gray-200 h-25"
        // style={{
        //   backgroundImage: `url(${adminBanner})`,
        //   backgroundRepeat: "no-repeat",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"

      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-white text-center">
                {" "}
                Home Banner Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update homepage banner content including title, image,
                link and status.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-800">
            {isEdit ? "Update Banner" : "Add New Banner"}
          </h3>
          <div className="bg-gray-50 border-b my-2  border-gray-200" />
          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 pointer-events-none" : ""}`}
          >
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter banner title"
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
                required
              />
            </div>

            {/* LINK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Redirect Link <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="link"
                value={formData?.link}
                onChange={handleChange}
                placeholder="https://example.com"
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Banner Image <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
                disabled={isFormDisabled}
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData?.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none"
                disabled={isFormDisabled}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-2 flex justify-end gap-5 mt-6">
              {/* Schedule BUTTON */}
              <button
                type="button"
                onClick={() => setShowScheduleModal(true)}
                disabled={isSubmitting || isFormDisabled}
                className={`px-5 py-1 text-sm text-white border border-gray-300 rounded bg-blue-500 hover:bg-blue-600 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Schedule
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isFormDisabled}
                className={`px-6 py-1 text-sm rounded text-white ${isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                    ? "Update Banner"
                    : "Add Banner"}{" "}
              </button>

              {/* CANCEL BUTTON */}
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting || isFormDisabled}
                className={`px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Banner List</h3>
          </div>

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b  border-gray-200">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Banner Title</th>
                <th className="px-4 py-3">Redirect Link</th>
<th className="px-4 py-3 whitespace-nowrap">Banner Image</th>                <th className="px-4 py-3">Status</th>
                {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading && banners?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{startIndex + index + 1}.</td>
                    <td className="px-4 py-3 font-medium">{item?.title}</td>
                    <td className="px-4 py-3 text-blue-600 underline">
                      {item?.link}
                    </td>
                    <td className="px-4 py-3">
                      <img
                        src={item?.image || "/placeholder.png"}
                        alt="Banner"
                        className="h-10 w-20 object-cover rounded border border-gray-300"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium
          ${item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item?.status}
                      </span>
                    </td>
                    {(canWrite || canDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-6">
                          {canWrite && (
                            <button
                              className="relative text-sm text-green-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-green-600
after:transition-all after:duration-300
hover:after:w-full"
                              onClick={() => {
                                setFormData({
                                  _id: item._id,
                                  title: item.title,
                                  link: item.link,
                                  status: item.status,
                                  image: null, // 👈 IMPORTANT
                                  created_by: item.created_by,
                                  updated_by: item.updated_by,
                                  imagePreview: item.image, // 👈 preview ke liye
                                  schedule: item.schedule,
                                });
                                if (item.schedule) {
                                  setSchedule({
                                    startDate: item.schedule.start_date || "",
                                    startTime: item.schedule.start_time || "",
                                    endDate: item.schedule.end_date || "",
                                    endTime: item.schedule.end_time || "",
                                  });
                                } else {
                                  setSchedule({
                                    startDate: "",
                                    startTime: "",
                                    endDate: "",
                                    endTime: "",
                                  });
                                }
                                setIsEdit(true);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              Edit
                            </button>
                          )}

                          {canDelete && (
                            <button
                              className="relative text-sm text-red-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-red-600
after:transition-all after:duration-300
hover:after:w-full"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(endIndex, banners?.length || 0)} of{" "}
              {banners?.length || 0}
            </span>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-l-lg"
              >
                Prev
              </button>

              {getPageNumbers().map((p, i) =>
                p === "..." ? (
                  <span key={i} className="px-3 h-8 border">
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
                disabled={currentPage === totalPages}
                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-r-lg"
              >
                Next
              </button>
            </div>
          </div>
        </div>
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-lg w-full max-w-lg shadow-lg">
              {/* Header */}
              <div className="px-5 py-3 border-b border-gray-200 flex items-center gap-2">
                <MdSchedule className="text-blue-600 text-xl" />
                <h3 className="text-lg font-normal text-gray-800">
                  Schedule Banner
                </h3>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={schedule.startDate}
                    onChange={handleScheduleChange}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={schedule.startTime}
                    onChange={handleScheduleChange}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={schedule.endDate}
                    onChange={handleScheduleChange}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={schedule.endTime}
                    onChange={handleScheduleChange}
                    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 px-5 py-3  border-t border-gray-200">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="px-4 py-1.5 text-sm border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSchedule}
                  className="px-5 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeBanner;
