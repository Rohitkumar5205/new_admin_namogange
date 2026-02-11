import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  createTrustBody,
  updateTrustBody,
} from "../../redux/slices/trustbody/trustBodySlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

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
    status: "Active",
    description: "",
  });

  const [isEdit, setIsEdit] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("user"));

  const { isFormDisabled } = useRoleRights(PageNames.ADD_TRUST_BODIES);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setFormData({
        _id: location.state._id || location.state.id,
        name: location.state.name || "",
        designation: location.state.designation || "",
        slug: location.state.slug || "",
        image: null || "",
        status: location.state.status || "Active",
        description: location.state.description || "",
      });
    }
  }, [location.state]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
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
          })
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

  return (
    <div className="">
      {/* ================= HEADER ================= */}

      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex  gap-3">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                Trust Bodies Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update Occupation content including name and status.
              </p>
            </div>
          </div>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
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
                Image
              </label>
              <input
                type="file"
                name="image"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <Editor
                value={formData.description}
                name="description"
                readOnly={isFormDisabled}
                onTextChange={(e) =>
                  setFormData({ ...formData, description: e.htmlValue })
                }
                style={{
                  height: "200px",
                  borderRadius: "4px", // rounded
                  borderBottom: "1px solid #e5e7eb", // border-gray-200
                  overflow: "hidden", // corners properly clip ho
                }}
                className="w-full text-sm outline-none"
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
                    status: "Active",
                    description: "",
                  });
                  setIsEdit(false);
                }}
                disabled={isFormDisabled}
                className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || isFormDisabled}
                className={`px-6 py-1 text-sm rounded text-white ${isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading ? "Processing..." : isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTrustBodies;
