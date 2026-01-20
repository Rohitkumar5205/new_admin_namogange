import React, { useState, useEffect } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../../redux/slices/home-banner/bannerSlice";
import { showSuccess, showError } from "../../utils/toastService";

const HomeBanner = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banner);
  console.log("banners", banners);
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

  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllBanners());
  }, [dispatch]);

  /* ===== HANDLERS ===== */
  // const handleChange = (e) => {
  //   const { name, value, files } = e.target;
  //   setFormData({ ...formData, [name]: files ? files[0] : value });
  // };
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
    });
    setIsEdit(false);
  };

  const handleDelete = (id) => {
    const currentUserId = "66ec23d89309636c42738591";

    dispatch(deleteBanner({ id: id, user_id: currentUserId })).then(() => {
      showSuccess("Banner deleted successfully ❌");
      dispatch(getAllBanners());
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showError("Title is required.");
      return;
    }

    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("link", formData.link);
    dataToSend.append("status", formData.status);
    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image);
    }

    const currentUserId = "66ec23d89309636c42738591";

    try {
      if (isEdit) {
        dataToSend.append("updated_by", currentUserId);
        await dispatch(
          updateBanner({ id: formData._id, formData: dataToSend })
        ).unwrap();
        showSuccess("Banner updated successfully ✅");
      } else {
        dataToSend.append("created_by", currentUserId);
        dataToSend.append("updated_by", currentUserId);
        await dispatch(createBanner(dataToSend)).unwrap();
        showSuccess("Banner added successfully ✅");
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
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Home Banner Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update homepage banner content including title, image, link and
          status.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Banner" : "Add New Banner"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
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
              disabled={isSubmitting}
              className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-1.5 text-sm rounded text-white ${
                isEdit
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
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">Banner List</h3>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b  border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Banner Title</th>
              <th className="px-4 py-3">Redirect Link</th>
              <th className="px-4 py-3">Banner Image</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
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
          ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
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
                          });
                          setIsEdit(true);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        Edit
                      </button>

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
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, banners?.length || 0)}{" "}
            of {banners?.length || 0}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-r-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeBanner;
