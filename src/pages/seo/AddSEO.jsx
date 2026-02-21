import React, { useState } from "react";
import { Editor } from "primereact/editor";
import { showSuccess, showError } from "../../utils/toastService";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createSeo, updateSeo } from "../../redux/slices/seo/seoSlice";
import { PAGES_LIST } from "../../utils/pagesList";

const AddSEO = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.seo || {});
  const [isEdit, setIsEdit] = useState(false);
  const [formData, setFormData] = useState({
    page_name: "",
    page_path: "",
    metaTitle: "",
    metaKeywords: "",
    metaDescription: "",
    openGraphTags: "",
    schemaMarkup: "",
    status: "Active",
  });
  const authUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = authUser?._id || authUser?.id || null;
  const currentUserName = authUser?.username || "";
  React.useEffect(() => {
    if (state) {
      setIsEdit(true);
      setFormData({
        ...formData,
        ...state,
        page_name: state.page_name || "",
        page_path: state.page_path || "",
      });
    }
  }, [state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditorChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.page_path) {
      showError("Please select a page to continue.");
      return;
    }

    const dataToSend = {
      ...formData,
      user_id: currentUserId,
      section: "SEO",
      message: isEdit
        ? `SEO Updated (${formData.page_name})`
        : `SEO Created (${formData.page_name})`,
    };

    try {
      if (isEdit) {
        await dispatch(
          updateSeo({ id: state._id, formData: dataToSend }),
        ).unwrap();
        showSuccess("SEO updated successfully!");
      } else {
        await dispatch(createSeo(dataToSend)).unwrap();
        showSuccess("SEO added successfully!");
      }
      navigate("/seo/seo-list");
    } catch (error) {
      console.error("Failed to save SEO:", error);
      const msg =
        error?.message || error?.data?.message || "Failed to save data";
     
      showError(msg);
    }
  };

  const resetForm = () => {
    setFormData({
      page: "",
      metaTitle: "",
      metaKeywords: "",
      metaDescription: "",
      openGraphTags: "",
      schemaMarkup: "",
      status: "Active",
    });
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div>
      {/* ================= HEADER ================= */}

      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white">
                SEO Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update SEO meta tags for website pages.
              </p>
            </div>
          </div>
          <div>
            {/* {canAdd && ( */}
            <button
              onClick={() => navigate("/seo/seo-list")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              {" "}
              SEO List
            </button>
            {/* )} */}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-base font-medium text-gray-800 mb-2">
            SEO Information
          </h3>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Page <span className="text-red-500">*</span>
              </label>
              <select
                name="page_path"
                value={formData.page_path}
                onChange={(e) => {
                  const selected = PAGES_LIST.find(
                    (p) => p.path === e.target.value,
                  );
                  setFormData({
                    ...formData,
                    page_name: selected?.name || "",
                    page_path: selected?.path || "",
                  });
                }}
                className={inputClass}
              >
                <option value="">Select Page</option>
                {PAGES_LIST.map((p) => (
                  <option key={p.path} value={p.path}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="metaTitle"
                  value={formData.metaTitle}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Keywords <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="metaKeywords"
                  value={formData.metaKeywords}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="metaDescription"
                value={formData.metaDescription}
                onChange={handleChange}
                className={inputClass}
                rows="1"
                required
              ></textarea>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Open Graph Tags (HTML/Text){" "}
                <span className="text-red-500">*</span>
              </label>
              <Editor
                value={formData.openGraphTags}
                onTextChange={(e) =>
                  handleEditorChange("openGraphTags", e.htmlValue)
                }
                style={{
                  height: "120px",
                  borderRadius: "4px", // rounded
                  borderBottom: "1px solid #e5e7eb", // border-gray-200
                  overflow: "hidden", // corners properly clip ho
                }}
                className="w-full text-sm outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Schema Markup (JSON-LD) <span className="text-red-500">*</span>
              </label>
              <Editor
                value={formData.schemaMarkup}
                onTextChange={(e) =>
                  handleEditorChange("schemaMarkup", e.htmlValue)
                }
                style={{
                  height: "120px",
                  borderRadius: "4px", // rounded
                  borderBottom: "1px solid #e5e7eb", // border-gray-200
                  overflow: "hidden", // corners properly clip ho
                }}
                className="w-full text-sm outline-none"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-1 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate("/seo/seo-list")}
                className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className={`px-6 py-1 text-sm rounded text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
              >
                {loading ? "Processing..." : isEdit ? "Update SEO" : "Add SEO"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSEO;
