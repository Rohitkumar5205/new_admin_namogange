import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCallTarget,
  getAllCallTargets,
  updateCallTarget,
  deleteCallTarget,
} from "../../redux/slices/add_by_admin/callTargetSlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const EMPLOYEE_LIST = [
  "Rohit Kumar",
  "Amit Sharma",
  "Neha Verma",
  "Suresh Singh",
];

const Target = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.callTarget);
  const authUser = JSON.parse(localStorage.getItem("user"));

  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    employee: "",
    date: "",
    call_target: "",
    status: "Active",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllCallTargets());
  }, [dispatch]);

  const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.ADD_TARGET);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // call target – only numbers
    if (name === "call_target" && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      employee: "",
      date: "",
      call_target: "",
      status: "Active",
    });
    setIsEdit(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";
    e.preventDefault();

    try {
      if (isEdit) {
        await dispatch(
          updateCallTarget({
            id: formData._id,
            data: {
              employee: formData.employee,
              date: formData.date,
              call_target: formData.call_target,
              status: formData.status,
              updated_by: currentUserName,
              user_id: currentUserId,
            },
          })
        ).unwrap();
        showSuccess("Target updated successfully ✅");
      } else {
        await dispatch(
          createCallTarget({
            employee: formData.employee,
            date: formData.date,
            call_target: formData.call_target,
            status: formData.status,
            created_by: currentUserName,
            user_id: currentUserId,
          })
        ).unwrap();
        showSuccess("Target added successfully ✅");
      }
      dispatch(getAllCallTargets());
      resetForm();
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      showError("Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDelete = (id) => {
    const currentUserId = authUser?.id || null;
    if (window.confirm("Are you sure you want to delete this target?")) {
      dispatch(deleteCallTarget({ id, user_id: currentUserId })).then(() => {
        showSuccess("Target deleted successfully ❌");
        dispatch(getAllCallTargets());
      });
    }
  };
  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil((list?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = list?.slice(startIndex, endIndex) || [];

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
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-white text-center">
                Target Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update call targets for employees.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Target" : "Add New Target"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {/* SELECT EMPLOYEE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Employee <span className="text-red-500">*</span>
              </label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="">Select Employee</option>
                {EMPLOYEE_LIST.map((emp) => (
                  <option key={emp} value={emp}>
                    {emp}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* CALL TARGET */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Call Target <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="call_target"
                value={formData.call_target}
                onChange={handleChange}
                placeholder="Enter call target"
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
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
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
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
                    ? "Update Target"
                    : "Add Target"}{" "}
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Target List</h3>
          </div>

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">S.No</th>
                <th className="px-4 py-3 font-medium">Employee</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Call Target</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(canWrite || canDelete) && <th className="px-4 py-3 font-medium">Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading && list?.length === 0 ? (
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
                    <td className="px-4 py-3">{startIndex + index + 1}</td>

                    <td className="px-4 py-3 font-medium">{item.employee}</td>
                    <td className="px-4 py-3">{item.date}</td>
                    <td className="px-4 py-3">{item.call_target}</td>
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
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
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
                                  employee: item.employee,
                                  date: item.date,
                                  call_target: item.call_target,
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

          {/* ================= PAGINATION (UNCHANGED) ================= */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}–{Math.min(endIndex, list?.length || 0)}{" "}
              of {list?.length || 0}
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

export default Target;
