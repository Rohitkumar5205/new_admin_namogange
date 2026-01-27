import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../../utils/toastService";
import { getAllCategories } from "../../redux/slices/add_by_admin/categorySlice";
import adminBanner from "../../assets/banners/bg.jpg";
import {
  createNewsLetter,
  getAllNewsLetters,
  updateNewsLetter,
  deleteNewsLetter,
} from "../../redux/slices/newsletter/newsLetterSlice";

const NewsLetters = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    month_year: "",
    order_by: "",
    image: null,
    pdf: null,
    status: "Active",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { newsletters, loading } = useSelector(
    (state) => state.newsletter || {}
  );
  console.log("newsletters", newsletters);
  const authUser = JSON.parse(localStorage.getItem("user"));
  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllNewsLetters());
  }, [dispatch]);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      title: "",
      month_year: "",
      order_by: "",
      image: null,
      pdf: null,
      status: "Active",
    });
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserId = authUser?.id;
    const currentUserName = authUser?.username;
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("monthYear", formData.month_year);
    data.append("order_by", formData.order_by);
    data.append("status", formData.status);
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }

    if (formData.pdf instanceof File) {
      data.append("pdf", formData.pdf);
    }
    if (currentUserId) data.append("user_id", currentUserId);
    if (currentUserName) {
      data.append(isEdit ? "updated_by" : "created_by", currentUserName);
    }
    setIsSubmitting(true);
    try {
      if (isEdit) {
        await dispatch(updateNewsLetter({ id: formData._id, data })).unwrap();
        showSuccess("News Letters updated successfully ✅");
      } else {
        await dispatch(createNewsLetter(data)).unwrap();
        showSuccess("News Letters added successfully ✅");
      }
      dispatch(getAllNewsLetters());
      resetForm();
    } catch (err) {
      console.error(err);
      showError(err?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteNewsLetter({ id, user_id: authUser?.id }))
      .unwrap()
      .then(() => {
        showSuccess("News Letter deleted successfully");
        dispatch(getAllNewsLetters());
      })
      .catch((err) => {
        showError(err?.message || "Failed to delete");
      });
  };

  /* ===== PAGINATION LOGIC ===== */
  const currentList = Array.isArray(newsletters)
    ? newsletters
    : Array.isArray(newsletters?.data)
    ? newsletters.data
    : [];
  const totalPages = Math.ceil(currentList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = currentList.slice(startIndex, endIndex);

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
          Add News Letters Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update News Letters content including title, month, order,
          files and status.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update News Letters" : "Add New News Letters"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              News Letters Title <span className="text-red-500">*</span>
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
          {/* MONTH & YEAR */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month & Year <span className="text-red-500">*</span>
            </label>
            <input
              type="month"
              name="month_year"
              value={formData.month_year}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* ORDER BY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order By <span className="text-red-500">*</span>
            </label>
            <select
              name="order_by"
              value={formData.order_by}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            >
              <option value="">Select Order</option>
              {Array.from({ length: 50 }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* PDF */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PDF File
            </label>
            <input
              type="file"
              name="pdf"
              accept="application/pdf"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
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
              disabled={loading}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading || isSubmitting}
              className={`px-6 py-1.5 text-sm rounded text-white ${
                isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              } ${
                loading || isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading || isSubmitting
                ? "Processing..."
                : isEdit
                ? "Update News Letters"
                : "Add News Letters"}{" "}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">
            News Letters List
          </h3>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b  border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">News Letters Title</th>
              <th className="px-4 py-3">Month/Year</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">PDF</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentData?.length > 0 ? (
              currentData.map((item, index) => (
                <tr
                  key={item._id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{startIndex + index + 1}.</td>
                  <td className="px-4 py-3 font-medium">{item.title}</td>
                  <td className="px-4 py-3">{item.monthYear}</td>
                  <td className="px-4 py-3">{item.order_by}</td>
                  <td className="px-4 py-3">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt="img"
                      className="w-20 h-10 object-cover rounded border"
                    />
                  </td>
                  <td className="px-4 py-3 text-blue-600 underline truncate max-w-xs">
                    {item.pdf ? (
                      <a
                        href={item.pdf}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    ) : (
                      "N/A"
                    )}
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
                      {item.status}
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
                            month_year: item.monthYear,
                            order_by: item.order_by,
                            image: item.image,
                            pdf: item.pdf,
                            status: item.status,
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
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, currentList.length)} of{" "}
            {currentList.length}
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

export default NewsLetters;
