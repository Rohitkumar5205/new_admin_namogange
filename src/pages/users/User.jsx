import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toastService";
import {
  createUserThunk,
  getAllUsersThunk,
  updateUserThunk,
  deleteUserThunk,
} from "../../redux/slices/user/userSlice";

const User = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);
  console.log("Users..:", users);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    _id: null,
    first_name: "",
    last_name: "",
    mobile: "",
    email: "",
    username: "",
    password: "",
    confirm_password: "",
    designation: "",
    department: "",
    role: "",
    status: "Active",
  });

  const [isEdit, setIsEdit] = useState(false);
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const currentUserId = "66ec23d89309636c42738591"; // Placeholder

  /* ===== FETCH DATA ===== */
  useEffect(() => {
    dispatch(getAllUsersThunk());
  }, [dispatch]);

  const filteredData = (users || []).filter(
    (item) =>
      (item.first_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.last_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.username || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      _id: null,
      first_name: "",
      last_name: "",
      mobile: "",
      email: "",
      username: "",
      password: "",
      confirm_password: "",
      designation: "",
      department: "",
      role: "",
      status: "Active",
    });
    setIsEdit(false);
  };

  /* ===== PAGINATION STATE ===== */
  const [currentPage, setCurrentPage] = useState(1);

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

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // only numbers for mobile
    if (name === "mobile" && value && !/^\d*$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEdit && formData.password !== formData.confirm_password) {
      showError("Password and Confirm Password do not match");
      return;
    }

    const requiredFields = [
      "first_name",
      "last_name",
      "mobile",
      "email",
      "username",
      "designation",
      "department",
      "role",
    ];
    if (!isEdit) {
      requiredFields.push("password", "confirm_password");
    }
    for (const field of requiredFields) {
      if (!formData[field] || !formData[field].trim()) {
        showError(`${field.replace("_", " ")} is required`);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile: formData.mobile,
        email: formData.email,
        username: formData.username,
        designation: formData.designation,
        department: formData.department,
        role: formData.role,
        status: formData.status,
      };

      if (isEdit) {
        if (formData.password) {
          userData.password = formData.password;
        }
        await dispatch(
          updateUserThunk({
            id: formData._id,
            data: { ...userData, updated_by: currentUserId },
          })
        ).unwrap();
        showSuccess("User updated successfully");
      } else {
        userData.password = formData.password;
        await dispatch(
          createUserThunk({
            ...userData,
            created_by: currentUserId,
            updated_by: currentUserId,
          })
        ).unwrap();
        showSuccess("User added successfully");
      }
      dispatch(getAllUsersThunk());
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      dispatch(deleteUserThunk({ id, user_id: currentUserId })).then(() => {
        showSuccess("User deleted successfully");
        dispatch(getAllUsersThunk());
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add User Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update user details and roles.
        </p>
      </div>

      {/* ================= FORM (DESIGN SAME) ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update User" : "Add New User"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              name="first_name"
              placeholder="First Name"
              value={formData.first_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm "
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              name="last_name"
              placeholder="Last Name"
              value={formData.last_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile No <span className="text-red-500">*</span>
            </label>
            <input
              name="mobile"
              placeholder="Mobile No"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="Email ID"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required={!isEdit}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              name="confirm_password"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirm_password}
              onChange={handleChange}
              required={!isEdit}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">Select Designation</option>
              <option value="Manager">Manager</option>
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">Select Department</option>
              <option value="IT">IT</option>
              <option value="Sales">Sales</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {" "}
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className=" flex justify-end gap-6  mt-6 md:col-span-4">
            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting}
              className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-1.5 text-sm rounded text-white ${
                isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting
                ? "Processing..."
                : isEdit
                ? "Update User"
                : "Add User"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-2 border-b border-gray-200 flex flex-wrap gap-4 justify-between">
          <h3 className="text-base font-medium text-gray-800">Users List</h3>
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
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && users?.length === 0 ? (
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
                  <td className="px-4 py-3">
                    {item.first_name} {item.last_name}
                  </td>
                  <td className="px-4 py-3">{item.username}</td>
                  <td className="px-4 py-3">{item.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${
                        item.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-3">
                    <button
                      className="relative text-sm text-blue-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-blue-600
after:transition-all after:duration-300
hover:after:w-full"
                      onClick={() => navigate(`/users/user/${item._id}`)}
                    >
                      View
                    </button>

                    <button
                      className="relative text-sm text-green-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-green-600
after:transition-all after:duration-300
hover:after:w-full"
                      onClick={() => {
                        setFormData({
                          ...item,
                          password: "",
                          confirm_password: "",
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, filteredData.length)}{" "}
            of {filteredData.length}
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

export default User;
