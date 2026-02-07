import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { Editor } from "primereact/editor";
import { createBlog, updateBlog } from "../../redux/slices/blog/blogSlice";
import { showSuccess, showError } from "../../utils/toastService";
import { getAllCategories } from "../../redux/slices/add_by_admin/categorySlice";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const AddBlog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const authUser = JSON.parse(localStorage.getItem("user"));
  const { categories } = useSelector((state) => state.category);

  // Check if we are in edit mode
  const isEdit = Boolean(location.state?.blog);
  const blogToEdit = location.state?.blog;

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    image: null,
    content: "",
    status: "Active",
    meta_keyword: "",
    meta_description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isFormDisabled } = useRoleRights(PageNames.ADD_BLOG);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isEdit && blogToEdit) {
      setFormData({
        title: blogToEdit.title || "",
        category: blogToEdit.category || "",
        author: blogToEdit.author || "",
        image: blogToEdit.image || null,
        content: blogToEdit.description || "",
        status: blogToEdit.status || "Active",
        meta_keyword: blogToEdit.meta_keyword || "",
        meta_description: blogToEdit.meta_description || "",
      });
    }
  }, [isEdit, blogToEdit]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleEditorChange = (e) => {
    if (e.source === "user") {
      setFormData((prev) => ({ ...prev, content: e.htmlValue }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content || !formData.author) {
      showError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("category", formData.category);
    dataToSend.append("author", formData.author);
    dataToSend.append("description", formData.content);
    dataToSend.append("status", formData.status);
    dataToSend.append("user_id", authUser?.id);
    dataToSend.append("meta_keyword", formData.meta_keyword);
    dataToSend.append("meta_description", formData.meta_description);

    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image);
    }

    try {
      if (isEdit) {
        await dispatch(
          updateBlog({ id: blogToEdit._id, formData: dataToSend })
        ).unwrap();
        showSuccess("Blog updated successfully");
      } else {
        await dispatch(createBlog(dataToSend)).unwrap();
        showSuccess("Blog created successfully");
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
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex flex-col text-center">
            <h2 className="text-xl font-semibold text-white text-center">
              {isEdit ? "Update Blog" : "Add New Blog"}
            </h2>
            <p className="text-sm text-blue-100">
              {isEdit
                ? "Modify existing blog details."
                : "Create a new blog post."}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-3 p-5">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className={`grid grid-cols-1 gap-6 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}>
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
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keyword
                </label>
                <input
                  type="text"
                  name="meta_keyword"
                  placeholder="Enter meta keyword"
                  value={formData.meta_keyword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  name="meta_description"
                  placeholder="Enter meta description"
                  value={formData.meta_description}
                  onChange={handleChange}
                  rows={1}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
              </div>
            </div>


            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content <span className="text-red-500">*</span>
              </label>
              <Editor
                value={formData.content}
                onTextChange={handleEditorChange}
                style={{ height: "160px" }}
                className="w-full text-sm outline-none"
                readOnly={isFormDisabled}
              />
            </div>

            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => navigate("/blogs/blog-list")} disabled={isSubmitting} className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}>Cancel</button>
              <button type="submit" disabled={isSubmitting || isFormDisabled} className={`px-6 py-1 text-sm rounded text-white ${isEdit ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"} ${isSubmitting || isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}>{isSubmitting ? "Processing..." : isEdit ? "Update Blog" : "Add Blog"}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;