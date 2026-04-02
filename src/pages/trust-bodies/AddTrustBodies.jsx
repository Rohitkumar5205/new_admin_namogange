import React, { useState, useEffect, useRef } from "react";
import TiptapEditor from "../../components/TiptapEditor";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createTrustBody,
  updateTrustBody,
} from "../../redux/slices/trustbody/trustBodySlice";
import { showSuccess, showError } from "../../utils/toastService";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";
import { motion } from "framer-motion";

const AddTrustBodies = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.trustBody || {});
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    designation: "",
    slug: "",
    image: "",
    imagePreview: "",
    image_alt: "",
    status: "Active",
    description: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const authUser = JSON.parse(sessionStorage.getItem("user"));
  const fileInputRef = useRef(null);

  const { isFormDisabled } = useRoleRights(PageNames.ADD_TRUST_BODIES);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setFormData({
        _id: location.state._id || location.state.id,
        name: location.state.name || "",
        designation: location.state.designation || "",
        slug: location.state.slug || "",
        image: null,
        imagePreview: location.state.image || "",
        image_alt: location.state.image_alt || "",
        status: location.state.status || "Active",
        description: location.state.description || "",
      });
    }
  }, [location.state]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files?.[0]) {
      const file = files[0];
      const maxSize = 10 * 1024 * 1024; // 10MB

      if (file.size > maxSize) {
        showError("Image size must be less than 10MB");
        e.target.value = ""; // Input field clear karne ke liye
        setFormData({ ...formData, image: null, imagePreview: "" });
        return;
      }

      setFormData({
        ...formData,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    } else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Name is required");
      return;
    }

    const currentUserId = authUser?.id;
    const currentUserName = authUser?.username;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("designation", formData.designation);
    data.append("status", formData.status);
    data.append("description", formData.description || "");
    data.append("image_alt", formData.image_alt || "");
    if (formData.image instanceof File) {
      data.append("image", formData.image);
    }
    if (currentUserId) data.append("user_id", currentUserId);
    if (currentUserName) {
      data.append(isEdit ? "updated_by" : "created_by", currentUserName);
    }

    try {
      if (isEdit) {
        await dispatch(
          updateTrustBody({
            id: formData._id,
            data: data,
          }),
        ).unwrap();
        showSuccess("Trust Body updated successfully ✅");
      } else {
        await dispatch(createTrustBody(data)).unwrap();
        showSuccess("Trust Body added successfully ✅");
      }

      navigate("/trust-bodies/trust-bodies-list");
    } catch (err) {
      console.error(err);
      showError(err?.message || "Something went wrong");
    }
  };

  const getPlainText = (html, maxLength = 50) => {
    if (!html) return "";

    const div = document.createElement("div");
    div.innerHTML = html;

    let text = div.textContent || "";

    if (text.length > maxLength) {
      text = text.slice(0, maxLength) + "...";
    }

    return text;
  };

  return (
    <div className="">
      {/* ================= HEADER ================= */}

      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <motion.div
            className="flex gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                Trust Bodies Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update Occupation content including name and status.
              </p>
            </div>
          </motion.div>
          <div>
            <button
              onClick={() => navigate("/trust-bodies/trust-bodies-list")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              {" "}
              Trust Bodies List
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <motion.div
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Trust Body" : "Add New Trust Body"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 pointer-events-none" : ""}`}
          >
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
                required
              />
            </div>
            {/* slug */}
            {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Enter slug"
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div> */}

            {/* DESIGNATION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Designation <span className="text-red-500">*</span>
              </label>
              <select
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="">Select Designation</option>
                <option value="Trustee">Trustee</option>
                <option value="Member">Member</option>
                <option value="President">President</option>
              </select>
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image (Size: 389x187) <span className="text-red-500">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                disabled={isFormDisabled}
                required={!isEdit}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
              {/* Image Preview Section */}
              {formData.imagePreview && (
                <div className="mt-3 p-1 border rounded bg-gray-50 inline-block shadow-sm">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="h-24 w-auto object-cover rounded"
                  />
                </div>
              )}
            </div>

            {/* Image Alt Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image Alt
              </label>
              <input
                type="text"
                name="image_alt"
                value={formData.image_alt}
                placeholder="Enter image alt"
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
                disabled={isFormDisabled}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 py-2 px-3 bg-gray-50 border-b">
                Description
              </label>

              <TiptapEditor
                value={formData.description}
                onChange={(html) =>
                  setFormData((prev) => ({ ...prev, description: html }))
                }
                isReadOnly={isFormDisabled}
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    name: "",
                    designation: "",
                    slug: "",
                    image: "",
                    imagePreview: "",
                    image_alt: "",
                    status: "Active",
                    description: "",
                  });
                  setIsEdit(false);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
                disabled={isFormDisabled}
                className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || isFormDisabled}
                className={`px-6 py-1 text-sm rounded text-white ${
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddTrustBodies;
