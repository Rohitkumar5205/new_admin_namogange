import React, { useState, useEffect } from "react";
import {
  createProfession,
  getAllProfessions,
  updateProfession,
  deleteProfession,
} from "../../redux/slices/add_by_admin/professionSlice";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const Profession = () => {
  const dispatch = useDispatch();
  const { professions, loading } = useSelector((state) => state.profession);
  // console.log("professions...", professions);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    status: "Active",
  });

  const [isEdit, setIsEdit] = useState(false);
  const authUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(getAllProfessions());
  }, [dispatch]);

  const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.ADD_PROFESSION);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      status: "Active",
    });
    setIsEdit(false);
  };
  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Profession title is required.");
      return;
    }
    setIsSubmitting(true);
    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";
    try {
      if (isEdit) {
        await dispatch(
          updateProfession({
            id: formData._id,
            data: {
              name: formData.name,
              status: formData.status,
              updated_by: currentUserName,
              user_id: currentUserId,
            },
          })
        ).unwrap();
        showSuccess("Profession updated successfully ✅");
      } else {
        await dispatch(
          createProfession({
            name: formData.name,
            status: formData.status,
            created_by: currentUserName,
            user_id: currentUserId,
          })
        ).unwrap();
        showSuccess("Profession added successfully ");
      }
      dispatch(getAllProfessions());
      resetForm();
    } catch (error) {
      console.error("Failed to save profession:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    const currentUserId = authUser?.id || null;
    dispatch(deleteProfession({ id, user_id: currentUserId })).then(() => {
      showSuccess("Profession deleted successfully ");
      dispatch(getAllProfessions());
    });
  };

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil((professions?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = professions?.slice(startIndex, endIndex) || [];

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
                Profession Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update Profession content including title, image, link
                and status.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5 ">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Profession" : "Add New Profession"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {/* TITLE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profession Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter banner title"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
                required
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
                disabled={isFormDisabled}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-1 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={handleCancel}
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
                    ? "Update Profession"
                    : "Add Profession"}{" "}
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
            <h3 className="text-base font-medium text-gray-800">
              Profession List
            </h3>
          </div>

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b  border-gray-200">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Profession Title</th>
                <th className="px-4 py-3">Status</th>
                {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading && professions?.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
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
                    <td className="px-4 py-3 font-medium">{item.name}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-medium
          ${item.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                          }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    {(canWrite || canDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {canWrite && (
                            <button
                              className="relative text-sm text-green-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-green-600
after:transition-all after:duration-300
hover:after:w-full"
                              onClick={() => {
                                setFormData({
                                  _id: item._id,
                                  name: item.name,
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
                              className="relative text-sm text-red-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-red-600
after:transition-all after:duration-300
hover:after:w-full"
                              onClick={() => handleDelete(item._id)}
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
              {Math.min(endIndex, professions?.length || 0)} of{" "}
              {professions?.length || 0}
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

export default Profession;
