import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createSource,
  getAllSources,
  updateSource,
  deleteSource,
} from "../../redux/slices/add_by_admin/sourceSlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const Source = () => {
  const dispatch = useDispatch();
  const { sources, loading } = useSelector((state) => state.source);
  const authUser = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    mobile: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    status: "Active",
  });

  const [search, setSearch] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== PAGINATION STATE (SAME AS BEFORE) ===== */
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllSources());
  }, [dispatch]);

  const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.ADD_SOURCE);

  /* ===== INPUT CHANGE ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // mobile – only 10 digits
    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    // pinCode – only 6 digits
    if (name === "pinCode" && !/^\d{0,6}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    const currentUserId = authUser?.id || null;
    const currentUserName = authUser?.username || "";

    try {
      if (isEdit) {
        await dispatch(
          updateSource({
            id: formData._id,
            data: {
              ...formData,
              updated_by: currentUserName,
              user_id: currentUserId,
            },
          })
        ).unwrap();
        showSuccess("Source updated successfully ✅");
      } else {
        await dispatch(
          createSource({
            ...formData,
            created_by: currentUserName,
            user_id: currentUserId,
          })
        ).unwrap();
        showSuccess("Source added successfully ✅");
      }
      dispatch(getAllSources());
      resetForm();
    } catch (err) {
      console.error(err);
      showError(err || "Something went wrong!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      name: "",
      mobile: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pinCode: "",
      status: "Active",
    });
    setIsEdit(false);
  };
  const handleDelete = (id) => {
    const currentUserId = authUser?.id || null;
    dispatch(deleteSource({ id, user_id: currentUserId })).then(() => {
      showSuccess("Source deleted successfully");
      dispatch(getAllSources());
    });
  };

  const filteredData = (sources || []).filter((item) =>
    (item.name || "").toLowerCase().includes(search.toLowerCase())
  );
  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

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
                Source / Sub Coordinator Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update source details including contact & location.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update Source" : "Add New Source"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {/* NAME */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
                required
              />
            </div>

            {/* MOBILE */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Mobile No <span className="text-red-500">*</span>
              </label>
              <input
                name="mobile"
                type="text"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                placeholder="Enter mobile number"
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* COUNTRY */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
            </div>

            {/* STATE */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <select
                required
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="">Select State</option>
                <option value="India">Uttar Pradesh</option>
                <option value="India">Haryana</option>
                <option value="India">Punjab</option>
              </select>
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm text-gray-700 font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              >
                <option value="">Select City</option>
                <option value="India">Lucknow</option>
                <option value="India">Gurgaon</option>
                <option value="India">Chandigarh</option>
              </select>
            </div>

            {/* PIN CODE */}
            <div>
              <label className="block text-sm  text-gray-700 font-medium mb-1">
                Pin Code <span className="text-red-500">*</span>
              </label>
              <input
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                maxLength={6}
                placeholder="Enter pinCode"
                required
                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                disabled={isFormDisabled}
              />
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm  text-gray-700 font-medium mb-1">
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
            <div className="md:col-span-3 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={resetForm}
                disabled={isSubmitting || isFormDisabled}
                className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
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
                    ? "Update Source"
                    : "Add Source"}
              </button>
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-3 border-b border-gray-200 flex flex-wrap gap-4 justify-between">
            <h3 className="text-base font-medium text-gray-800">Source List</h3>
            <div className="flex gap-3">
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 shadow-md rounded px-2 py-1 text-sm"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>
                    Show {n} Entries
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-gray-300 shadow-md rounded px-2 py-1 text-sm"
              />
            </div>
          </div>

          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">S.No</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Mobile</th>
                <th className="px-4 py-3 font-medium">City</th>
                <th className="px-4 py-3 font-medium">Status</th>
                {(canWrite || canDelete) && <th className="px-4 py-3 font-medium">Action</th>}
              </tr>
            </thead>

            <tbody>
              {loading && sources?.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">{startIndex + index + 1}.</td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">{item.mobile}</td>
                    <td className="px-4 py-3">{item.city}</td>
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
                        {canWrite && (
                          <button
                            className="text-green-600 mr-3"
                            onClick={() => {
                              setFormData({
                                _id: item._id,
                                name: item.name,
                                mobile: item.mobile,
                                email: item.email,
                                address: item.address,
                                country: item.country,
                                state: item.state,
                                city: item.city,
                                pinCode: item.pinCode,
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

          {/* ================= PAGINATION (SAME STYLE) ================= */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">
              Showing {startIndex + 1}–{Math.min(endIndex, filteredData.length)}{" "}
              of {filteredData.length}
            </span>

            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 h-8 border border-gray-300 rounded-l-lg"
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
                    className={`px-3 h-8 border ${currentPage === p
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
                className="px-3 h-8 border border-gray-300 rounded-r-lg"
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

export default Source;
