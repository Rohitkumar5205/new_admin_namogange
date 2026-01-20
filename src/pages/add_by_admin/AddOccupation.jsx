import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOccupations,
  createOccupation,
  updateOccupation,
  deleteOccupation,
} from "../../redux/slices/add_by_admin/occupationSlice";
import { showSuccess, showError } from "../../utils/toastService";

const AddOccupation = () => {
  const dispatch = useDispatch();
  const { occupations, loading } = useSelector((state) => state.occupation);

  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    name: "",
    status: "Active",
  });

  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  const currentUserId = "66ec23d89309636c42738591";

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllOccupations());
  }, [dispatch]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Occupation name is required");
      return;
    }

    try {
      if (isEdit) {
        await dispatch(
          updateOccupation({
            id: formData._id,
            data: {
              name: formData.name,
              status: formData.status,
              updated_by: currentUserId,
            },
          })
        ).unwrap();

        showSuccess("Occupation updated successfully ✅");
      } else {
        await dispatch(
          createOccupation({
            name: formData.name,
            status: formData.status,
            created_by: currentUserId,
            updated_by: currentUserId,
          })
        ).unwrap();

        showSuccess("Occupation added successfully ✅");
      }

      resetForm();
      setCurrentPage(1);
    } catch (err) {
      showError("Something went wrong");
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteOccupation({ id, user_id: currentUserId }));
    showSuccess("Occupation deleted successfully");
    dispatch(getAllOccupations());
  };

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(occupations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = occupations.slice(startIndex, endIndex);

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
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add Occupation Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update Occupation content including name, image, link and
          status.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Occupation" : "Add New Occupation"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {/* name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Occupation name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter banner name"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="md:col-span-1 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: null,
                  name: "",
                  status: "Active",
                });
                setIsEdit(false);
              }}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-1.5 text-sm rounded text-white ${
                isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isEdit ? "Update Occupation" : "Add Occupation"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">
            Occupation List
          </h3>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b  border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Occupation name</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item._id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{index + 1}.</td>
                <td className="px-4 py-3 font-medium">{item.name}</td>

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
                        setFormData(item);
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
            ))}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, occupations.length)} of{" "}
            {occupations.length}
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
  );
};

export default AddOccupation;
