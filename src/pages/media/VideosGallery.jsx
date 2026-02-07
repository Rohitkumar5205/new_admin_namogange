import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createGalleryVideo,
  getAllGalleryVideos,
  updateGalleryVideo,
  deleteGalleryVideo,
} from "../../redux/slices/galleryVideoSlice";
import { getAllCategoryVideos } from "../../redux/slices/add_by_admin/categoryVideoSlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const VideosGallery = () => {
  const dispatch = useDispatch();
  const { videos: galleryVideos, loading } = useSelector(
    (state) => state.galleryVideo
  );
  const { list: categoryVideos } = useSelector((state) => state.categoryVideo);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("user"));

  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    date: "",
    category: "",
    orderBy: "",
    location: "",
    video_link: "",
    status: "Active",
  });
  const [isEdit, setIsEdit] = useState(false);

  const { canWrite, canDelete, isFormDisabled } = useRoleRights(
    PageNames.VIDEOS_GALLERY
  );

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllGalleryVideos());
    dispatch(getAllCategoryVideos());
  }, [dispatch]);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      title: "",
      date: "",
      category: "",
      orderBy: "",
      location: "",
      video_link: "",
      status: "Active",
    });
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = {
      title: formData.title,
      date: formData.date,
      category: formData.category,
      orderBy: formData.orderBy,
      location: formData.location,
      video_link: formData.video_link,
      status: formData.status,
      user_id: authUser?.id || null,
    };

    try {
      if (isEdit) {
        await dispatch(
          updateGalleryVideo({ id: formData._id, formData: dataToSend })
        ).unwrap();
        showSuccess("Video Gallery updated successfully");
      } else {
        await dispatch(createGalleryVideo(dataToSend)).unwrap();
        showSuccess("Video Gallery added successfully");
      }
      await dispatch(getAllGalleryVideos()).unwrap();
      resetForm();
    } catch (err) {
      console.error(err);
      showError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil((galleryVideos?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = galleryVideos?.slice(startIndex, endIndex) || [];

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
        className="relative overflow-hidden  shadow-sm border border-gray-200 h-25"
        style={{
          backgroundImage: `url(${adminBanner})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-white text-center">
                Videos Gallery Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update videos gallery content including title, image,
                link and status.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5 ">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Video Gallery" : "Add Video Gallery"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${
              isFormDisabled ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                placeholder="Enter title"
                value={formData.title}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                required
                disabled={isFormDisabled}
              />
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                disabled={isFormDisabled}
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                disabled={isFormDisabled}
              >
                <option value="">Select Category</option>
                {categoryVideos?.map((cat) => (
                  <option key={cat._id} value={cat.category}>
                    {cat.category}
                  </option>
                ))}
              </select>
            </div>

            {/* ORDER BY (1–50) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order By
              </label>
              <select
                name="orderBy"
                value={formData.orderBy}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                disabled={isFormDisabled}
              >
                <option value="">Select Order</option>
                {Array.from({ length: 50 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* LOCATION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="Enter location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                disabled={isFormDisabled}
              />
            </div>

            {/* VIDEO LINK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Video Link <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="video_link"
                value={formData.video_link}
                required
                onChange={handleChange}
                placeholder="https://youtube.com/embed/xxxx"
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                disabled={isFormDisabled}
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                disabled={isFormDisabled}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-2 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting || isFormDisabled}
                className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
                  isSubmitting || isFormDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isFormDisabled}
                className={`px-6 py-1.5 text-sm rounded-md text-white ${
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${
                  isSubmitting || isFormDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                  ? "Update Video"
                  : "Add Video"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
            <h3 className="text-base font-medium text-gray-800">
              Video Gallery List
            </h3>
          </div>

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Video Link</th>
                <th className="px-4 py-3">Status</th>
                {(canWrite || canDelete) && (
                  <th className="px-4 py-3">Action</th>
                )}
              </tr>
            </thead>

            <tbody>
              {loading && galleryVideos?.length === 0 ? (
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
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">
                      {item.date
                        ? new Date(item.date).toLocaleDateString("en-GB")
                        : ""}
                    </td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.orderBy}</td>
                    <td className="px-4 py-3">{item.location}</td>
                    <td className="px-4 py-3">
                      {item.video_link ? (
                        <div className="group relative w-20 aspect-video rounded-lg overflow-hidden border border-gray-200 bg-black shadow-sm hover:shadow-lg transition">
                          {/* Video */}
                          <iframe
                            src={item.video_link}
                            title="video"
                            className="absolute inset-0 w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />

                          {/* YouTube Play Overlay */}
                          <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/20 opacity-90 group-hover:bg-black/30 transition">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 shadow-lg">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="white"
                                className="w-5 h-5 ml-[2px]"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-block text-xs text-gray-400 italic">
                          No video available
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {(canWrite || canDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex gap-3">
                          {canWrite && (
                            <button
                              className="text-green-600"
                              onClick={() => {
                                setFormData({
                                  _id: item._id,
                                  title: item.title,
                                  date: item.date
                                    ? item.date.split("T")[0]
                                    : "",
                                  category: item.category,
                                  orderBy: item.orderBy,
                                  location: item.location,
                                  video_link: item.video_link,
                                  status: item.status,
                                });
                                setIsEdit(true);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                              }}
                            >
                              Edit
                            </button>
                          )}

                          {canDelete && (
                            <button
                              className="text-red-600"
                              onClick={() => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this video?"
                                  )
                                ) {
                                  const currentUserId = authUser?.id || null;
                                  dispatch(
                                    deleteGalleryVideo({
                                      id: item._id,
                                      user_id: currentUserId,
                                    })
                                  ).then(() => {
                                    showSuccess(
                                      "Video Gallery deleted successfully"
                                    );
                                    dispatch(getAllGalleryVideos());
                                  });
                                }
                              }}
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
              {Math.min(endIndex, galleryVideos?.length || 0)} of{" "}
              {galleryVideos?.length || 0}
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
                    className={`px-3 h-8 border border-gray-300 hover:bg-gray-50 ${
                      currentPage === p
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
      </div>
    </div>
  );
};

export default VideosGallery;
