import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategoryImage,
  deleteCategoryImage,
  getAllCategoryImages,
  updateCategoryImage,
} from "../../redux/slices/add_by_admin/categoryImageSlice";
import { showSuccess, showError } from "../../utils/toastService";
import { getAllCategories } from "../../redux/slices/add_by_admin/categorySlice";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const ImageCategory = () => {
  const dispatch = useDispatch();
  const { categoryImages, loading } = useSelector(
    (state) => state.categoryImage
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const categoryOptions = useSelector((state) => state.category.categories);
  const authUser = JSON.parse(localStorage.getItem("user"));

  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    category: "",
    order_by: "",
    image: null,
    status: "Active",
  });
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    dispatch(getAllCategoryImages());
    dispatch(getAllCategories());
  }, [dispatch]);

  const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.IMAGE_CATEGORY);

  /* ===== PAGINATION (SAME AS YOUR CODE) ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((categoryImages?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = categoryImages?.slice(startIndex, endIndex) || [];

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

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      title: "",
      category: "",
      order_by: "",
      image: null,
      status: "Active",
    });
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("category", formData.category);
    dataToSend.append("order_by", formData.order_by);
    dataToSend.append("status", formData.status);
    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image);
    }

    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";
    dataToSend.append("user_id", currentUserId);

    try {
      if (isEdit) {
        dataToSend.append("updated_by", currentUserName);
        dataToSend.append("user_id", currentUserId);
        await dispatch(
          updateCategoryImage({ id: formData._id, formData: dataToSend })
        ).unwrap();
        showSuccess("Image Category updated successfully");
      } else {
        dataToSend.append("created_by", currentUserName);
        dataToSend.append("updated_by", currentUserName);
        dataToSend.append("user_id", currentUserId);
        await dispatch(createCategoryImage(dataToSend)).unwrap();
        showSuccess("Image Category added successfully");
      }
      dispatch(getAllCategoryImages());
      resetForm();
    } catch (error) {
      console.error("Failed to save image category:", error);
      showError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    const currentUserId = authUser?.id || null;
    if (
      window.confirm("Are you sure you want to delete this image category?")
    ) {
      dispatch(deleteCategoryImage({ id, user_id: currentUserId })).then(() => {
        showSuccess("Image Category deleted successfully");
        dispatch(getAllCategoryImages());
      });
    }
  };

  return (
    <div className="">
      {/* ================= HEADER ================= */}
      {/* <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add Image Category Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update Image Category content.
        </p>
      </div> */}
      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-white text-center">
                Image Category Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update Image Category content.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5 ">
        {/* ================= FORM (DESIGN SAME) ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Image Category" : "Add New Image Category"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter title"
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* CATEGORY */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="">Select Category</option>
                {categoryOptions?.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
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
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="">Select</option>
                {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image File
              </label>
              <input
                type="file"
                name="image"
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-1 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting || isFormDisabled}
                className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || isFormDisabled}
                className={`px-6 py-1.5 text-sm rounded text-white ${isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
                  } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                    ? "Update Image Category"
                    : "Add Image Category"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE (DESIGN SAME) ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
            <h3 className="text-base font-medium text-gray-800">
              Image Category List
            </h3>
          </div>{" "}
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading && categoryImages?.length === 0 ? (
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
                    <td className="px-4 py-3 font-medium">{item.title}</td>
                    <td className="px-4 py-3">{item.category}</td>
                    <td className="px-4 py-3">{item.order_by}</td>
                    <td className="px-4 py-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.title}
                        className="h-10 w-10 object-cover rounded-full border"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {(canWrite || canDelete) && (
                      <td className="px-4 py-3 flex gap-3">
                        {canWrite && (
                          <button
                            className="text-green-600"
                            onClick={() => {
                              setFormData({
                                _id: item._id,
                                title: item.title,
                                category: item.category,
                                order_by: item.order_by,
                                image: item.image,
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
                            onClick={() => handleDelete(item._id)}
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {/* ================= PAGINATION (SAME DESIGN) ================= */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}–
              {Math.min(endIndex, categoryImages?.length || 0)} of{" "}
              {categoryImages?.length || 0}
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
    </div>
  );
};

export default ImageCategory;
