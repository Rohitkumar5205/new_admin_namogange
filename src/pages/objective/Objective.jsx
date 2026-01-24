import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchObjectives,
  createObjectiveThunk,
  updateObjectiveThunk,
  deleteObjectiveThunk,
} from "../../redux/slices/objective/objectiveSlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";

const Objective = () => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    _id: null,
    title: "",
    slug: "",
    image: null,
    meta_keywords: "",
    meta_desc: "",
    desc: "",
    created_by: "",
    updated_by: "",
    status: "Active",
  });

  // redux logic
  const { data, loading } = useSelector((state) => state.objectives);
  const [isEdit, setIsEdit] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("user"));
  // const currentUserId = authUser?.id || null;
  // const currentUserName = authUser?.username || "";

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(fetchObjectives());
  }, [dispatch]);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "title") {
      const slug = value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setFormData({ ...formData, title: value, slug: slug });
    } else {
      setFormData({ ...formData, [name]: files ? files[0] : value });
    }
  };
  const resetForm = () => {
    setFormData({
      _id: null,
      title: "",
      slug: "",
      image: null,
      meta_keywords: "",
      meta_desc: "",
      desc: "",
      created_by: "",
      updated_by: "",
      status: "Active",
    });

    setIsEdit(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleDelete = (id) => {
    const currentUserId = authUser?.id || null;
    dispatch(deleteObjectiveThunk({ id: id, user_id: currentUserId })).then(
      () => {
        showSuccess("Objective deleted successfully ");
        dispatch(fetchObjectives());
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title?.trim()) {
      showError("Title is required.");
      return;
    }

    if (!formData.slug?.trim()) {
      showError("Slug is required.");
      return;
    }

    if (!formData.desc || formData.desc === "<p><br></p>") {
      showError("Description is required.");
      return;
    }

    if (!isEdit && !formData.image) {
      showError("Image is required.");
      return;
    }

    setIsSubmitting(true);

    const dataToSend = new FormData();
    dataToSend.append("title", formData.title);
    dataToSend.append("slug", formData.slug);
    dataToSend.append("status", formData.status);
    dataToSend.append("meta_keywords", formData.meta_keywords);
    dataToSend.append("meta_desc", formData.meta_desc);
    dataToSend.append("desc", formData.desc);

    if (formData.image instanceof File) {
      dataToSend.append("image", formData.image);
    }

    // const currentUserId = "66ec23d89309636c42738591";
    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";
    try {
      if (isEdit) {
        dataToSend.append("updated_by", currentUserName);
        dataToSend.append("user_id", currentUserId);

        await dispatch(
          updateObjectiveThunk({ id: formData._id, formData: dataToSend })
        ).unwrap();

        showSuccess("Objective updated successfully");
      } else {
        dataToSend.append("created_by", currentUserName);
        dataToSend.append("updated_by", currentUserName);
        dataToSend.append("user_id", currentUserId);
        await dispatch(createObjectiveThunk(dataToSend)).unwrap();
        showSuccess("Objective added successfully");
      }

      await dispatch(fetchObjectives()).unwrap();
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
  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

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
        className="relative overflow-hidden rounded shadow-sm border border-gray-200 h-25"
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
                {" "}
                Objective Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update Objective content including title, slug,
                description and status.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Objective" : "Add New Objective"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Objective Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter banner title"
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            {/* SLUG */}
            <div>
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
            </div>

            {/* IMAGE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image
              </label>
              <input
                key={formData._id || "new"}
                type="file"
                name="image"
                onChange={handleChange}
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
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            {/* META KEYWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Keyword
              </label>
              <input
                type="text"
                name="meta_keywords"
                value={formData.meta_keywords}
                onChange={handleChange}
                placeholder="Enter meta keywords"
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>

              <Editor
                value={formData.desc}
                onTextChange={(e) =>
                  setFormData({ ...formData, desc: e.htmlValue })
                }
                style={{
                  height: "180px",
                  borderRadius: "4px", // rounded
                  borderBottom: "1px solid #e5e7eb", // border-gray-200
                  overflow: "hidden", // corners properly clip ho
                }}
                className="w-full text-sm outline-none"
              />
            </div>
            {/* META DESCRIPTION */}
            <div className="md:col-span-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Description
              </label>
              <textarea
                name="meta_desc"
                value={formData.meta_desc}
                onChange={handleChange}
                placeholder="Enter meta description"
                rows={2}
                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-3 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className={`px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-1 text-sm rounded text-white ${
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting
                  ? "Processing..."
                  : isEdit
                  ? "Update Objective"
                  : "Add Objective"}{" "}
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">
              Objective List
            </h3>
          </div>

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b  border-gray-200">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Objective Title</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading && data?.length === 0 ? (
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
                    <td className="px-4 py-3 text-gray-500">{item.slug}</td>
                    <td className="px-4 py-3">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt="Objective"
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
                              slug: item.slug,
                              image: item.image,
                              meta_keywords: item.meta_keywords,
                              meta_desc: item.meta_desc,
                              desc: item.desc,
                              created_by: item.created_by,
                              updated_by: item.updated_by,
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
              )}
            </tbody>
          </table>

          {/* ================= PAGINATION ================= */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}–{Math.min(endIndex, data.length)} of{" "}
              {data?.length || 0}
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

export default Objective;
