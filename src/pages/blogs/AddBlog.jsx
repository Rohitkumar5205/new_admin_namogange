import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import TiptapEditor from "../../components/TiptapEditor";
import { createBlog, updateBlog } from "../../redux/slices/blog/blogSlice";
import { showSuccess, showError } from "../../utils/toastService";
import { getAllCategories } from "../../redux/slices/add_by_admin/categorySlice";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";
import { motion } from "framer-motion";

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = JSON.parse(sessionStorage.getItem("user"));
  const { categories } = useSelector((state) => state.category);

  // Check if we are in edit mode
  const isEdit = Boolean(location.state?.blog);
  const blogToEdit = location.state?.blog;

  const [formData, setFormData] = useState({
    _id: null, // Add _id to formData for consistency with other forms
    title: "",
    category: "",
    author: "",
    image: null,
    imagePreview: "",
    image_alt: "",
    content: "",
    status: "Active",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const { isFormDisabled } = useRoleRights(PageNames.ADD_BLOG);

  useEffect(() => {
    // Clear file input on mount/unmount to prevent stale state
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && blogToEdit) {
      setFormData({
        title: blogToEdit.title || "",
        _id: blogToEdit._id, // Set _id for editing
        category: blogToEdit.category || "",
        author: blogToEdit.author || "",
        image: null,
        imagePreview: blogToEdit.image || "",
        image_alt: blogToEdit.image_alt || "",
        content: blogToEdit.description || "",
        status: blogToEdit.status || "Active",
      });
    }
  }, [isEdit, blogToEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image" && files && files[0]) {
      const file = files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        showError("Image size must be less than 10MB");
        e.target.value = ""; // Clear the input UI
        setFormData((prev) => ({ ...prev, image: null, imagePreview: "" }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        image: files[0],
        imagePreview: URL.createObjectURL(files[0]),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      author: "",
      image: null,
      imagePreview: "",
      image_alt: "",
      content: "",
      status: "Active",
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.author) {
      showError("Please fill in all required fields.");
      return;
    }

    if (!isEdit && !formData.image) {
      showError("Please select an image.");
      return;
    }

    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("category", formData.category);
    dataToSend.append("author", formData.author);
    dataToSend.append("description", formData.content);
    dataToSend.append("status", formData.status);
    dataToSend.append("user_id", authUser?.id); // Assuming authUser.id is available

    dataToSend.append("image_alt", formData.image_alt);

    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await dispatch(
          updateBlog({ id: blogToEdit._id, formData: dataToSend }),
        ).unwrap(); // Use blogToEdit._id for update
        showSuccess("Blog updated successfully");
      } else {
        await dispatch(createBlog(dataToSend)).unwrap();
        showSuccess("Blog created successfully");
        resetForm(); // Reset form after successful creation
      }
      navigate("/blogs/blog-list");
    } catch (error) {
      console.error("Failed to save blog:", error);
      showError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <motion.div
            className="flex flex-col text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-700 text-center">
              {isEdit ? "Update Blog" : "Add New Blog"}
            </h2>
            <p className="text-sm text-blue-100">
              {isEdit
                ? "Modify existing blog details."
                : "Create a new blog post."}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3 p-5">
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 gap-6 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Enter title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                >
                  <option value="">Select Category</option>
                  {categories?.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Enter author"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image (Size: 438*232) <span className="text-red-500">*</span>
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  onChange={handleChange}
                  required={!isEdit}
                  accept="image/*"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
                {/* Image Preview Section */}
                {formData.imagePreview && (
                  <div className="mt-3 p-1 border rounded bg-gray-50 inline-block shadow-sm">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="h-20 w-auto object-cover rounded border border-gray-300"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image Alt
                </label>
                <input
                  type="text"
                  name="image_alt"
                  value={formData.image_alt}
                  placeholder="Enter image alt"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none"
                  disabled={isFormDisabled}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <TiptapEditor
                value={formData.content}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, content: html }))
                }
                isReadOnly={isFormDisabled}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/blogs/blog-list")}
                disabled={isSubmitting}
                className={`px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isFormDisabled}
                className={`px-6 py-1 text-sm rounded text-white ${isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} ${isSubmitting || isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                    ? "Update Blog"
                    : "Add Blog"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddBlog;
