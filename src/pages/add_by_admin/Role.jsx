// c:\Projects\NamoGange\new_admin_namogange\src\pages\add_by_admin\Role.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    createRole,
    getAllRoles,
    updateRole,
    deleteRole,
} from "../../redux/slices/add_by_admin/roleSlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const Role = () => {
    const dispatch = useDispatch();
    // Using || {} to prevent crash if slice hasn't been added to store yet
    const { roles, loading } = useSelector((state) => state.role || {});
    const authUser = JSON.parse(localStorage.getItem("user"));

    const [formData, setFormData] = useState({
        _id: null,
        role: "",
        role_name: "",
        status: "Active",
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ===== FILTER & PAGINATION STATE ===== */
    const [statusFilter, setStatusFilter] = useState("All");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [tableSearch, setTableSearch] = useState({
        role: "",
        role_name: "",
        status: "",
    });

    /* ===== FETCH DATA ===== */
    useEffect(() => {
        dispatch(getAllRoles());
    }, [dispatch]);

    const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.ADD_ROLE);

    /* ===== HANDLERS ===== */
    const handleTableSearchChange = (e) => {
        const { name, value } = e.target;
        setTableSearch({ ...tableSearch, [name]: value });
        setCurrentPage(1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const resetForm = () => {
        setFormData({
            _id: null,
            role: "",
            role_name: "",
            status: "Active",
        });
        setIsEdit(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const currentUserId = authUser?.id || null;
        const currentUserName = authUser?.username || "";

        try {
            if (isEdit) {
                await dispatch(
                    updateRole({
                        id: formData._id,
                        data: {
                            ...formData,
                            updated_by: currentUserName,
                            user_id: currentUserId,
                        },
                    })
                ).unwrap();
                showSuccess("Role updated successfully");
            } else {
                await dispatch(
                    createRole({
                        ...formData,
                        created_by: currentUserName,
                        user_id: currentUserId,
                    })
                ).unwrap();
                showSuccess("Role added successfully");
            }
            await dispatch(getAllRoles());
            resetForm();
        } catch (err) {
            console.error(err);
            showError("Something went wrong!");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        const currentUserId = authUser?.id || null;
        if (window.confirm("Are you sure you want to delete this role?")) {
            dispatch(deleteRole({ id, user_id: currentUserId })).then(() => {
                showSuccess("Role deleted successfully");
                dispatch(getAllRoles());
            });
        }
    };

    /* ===== FILTER LOGIC ===== */
    const safeRoles = roles || [];

    const filteredData = safeRoles.filter((item) => {
        // STATUS FILTER
        const statusMatch =
            statusFilter === "All" ? true : item.status === statusFilter;

        // TOP SEARCH
        const globalSearchMatch =
            item.role?.toLowerCase().includes(search.toLowerCase()) ||
            item.role_name?.toLowerCase().includes(search.toLowerCase());

        // TABLE COLUMN SEARCH
        const tableSearchMatch =
            item.role?.toLowerCase().includes(tableSearch.role.toLowerCase()) &&
            item.role_name
                ?.toLowerCase()
                .includes(tableSearch.role_name.toLowerCase()) &&
            item.status?.toLowerCase().includes(tableSearch.status.toLowerCase());

        return statusMatch && globalSearchMatch && tableSearchMatch;
    });

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
                className="relative overflow-hidden  shadow-sm border border-gray-200 h-25"
                style={{
                    backgroundImage: `url(${adminBanner})`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="relative flex justify-center items-center px-6 py-4 h-25">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col text-center">
                            <h2 className="text-xl font-semibold text-white text-center">
                                Role Management
                            </h2>
                            <p className="text-sm text-blue-100">
                                Add or update user roles and permissions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-3 p-5">
                {/* ================= FORM ================= */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-base font-medium text-gray-800 mb-4">
                        {isEdit ? "Update Role" : "Add New Role"}
                    </h3>

                    <form
                        onSubmit={handleSubmit}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="role"
                                placeholder="Enter Role (e.g. ADMIN)"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                disabled={isFormDisabled}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="role_name"
                                placeholder="Enter Role Name (e.g. Administrator)"
                                value={formData.role_name}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                disabled={isFormDisabled}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                required
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm"
                                disabled={isFormDisabled}
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="md:col-span-3 flex justify-end gap-3 mt-4">
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
                                        ? "Update Role"
                                        : "Add Role"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ================= TABLE ================= */}
                <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-5 py-2 border-b border-gray-200 flex flex-wrap gap-4 justify-between items-center">
                        <h3 className="text-base font-medium text-gray-800">Role List</h3>

                        <div className="flex gap-2 items-center">
                            <select
                                value={itemsPerPage}
                                onChange={(e) => {
                                    setItemsPerPage(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="border border-gray-300 shadow-sm rounded px-2 py-1 text-sm outline-none"
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
                                className="border border-gray-300 shadow-sm rounded px-2 py-1 text-sm outline-none"
                            />
                        </div>

                        <div className="flex gap-2">
                            {["All", "Active", "Inactive"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                    className={`px-4 py-1 border shadow-sm rounded text-sm transition-colors
                  ${statusFilter === status
                                            ? status === "Active"
                                                ? "bg-green-600 text-white border-green-600"
                                                : status === "Inactive"
                                                    ? "bg-red-600 text-white border-red-600"
                                                    : "bg-blue-600 text-white border-blue-600"
                                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3">S.No</th>
                                <th className="px-4 py-3">Role</th>
                                <th className="px-4 py-3">Role Name</th>
                                <th className="px-4 py-3">Status</th>
                                {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {loading && (!roles || roles.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : currentData.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No data found
                                    </td>
                                </tr>
                            ) : (
                                currentData.map((item, index) => (
                                    <tr
                                        key={item._id || index}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">{startIndex + index + 1}.</td>
                                        <td className="px-4 py-3 font-medium">{item.role}</td>
                                        <td className="px-4 py-3">{item.role_name}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full font-medium ${item.status === "Active"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        {(canWrite || canDelete) && (
                                            <td className="px-4 py-3">
                                                <div className="flex gap-3">
                                                    {canWrite && (
                                                        <button
                                                            className="text-green-600 hover:underline"
                                                            onClick={() => {
                                                                setFormData({
                                                                    _id: item._id,
                                                                    role: item.role,
                                                                    role_name: item.role_name,
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
                                                            className="text-red-600 hover:underline"
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

                            {/* ===== SEARCH ROW ===== */}
                            <tr className="border-t border-gray-300 bg-gray-50">
                                <td className="px-2 py-1"></td>

                                <td className="px-2 py-1">
                                    <input
                                        placeholder="Search Role"
                                        value={tableSearch.role}
                                        onChange={handleTableSearchChange}
                                        name="role"
                                        className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-xs"
                                    />
                                </td>

                                <td className="px-2 py-1">
                                    <input
                                        placeholder="Search Name"
                                        value={tableSearch.role_name}
                                        onChange={handleTableSearchChange}
                                        name="role_name"
                                        className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-xs"
                                    />
                                </td>

                                <td className="px-2 py-1">
                                    <input
                                        placeholder="Search Status"
                                        value={tableSearch.status}
                                        onChange={handleTableSearchChange}
                                        name="status"
                                        className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-xs"
                                    />
                                </td>

                                <td className="px-2 py-1"></td>
                            </tr>
                        </tbody>
                    </table>

                    {/* ================= PAGINATION ================= */}
                    <div className="flex justify-between items-center px-4 py-2 border-t border-gray-200">
                        <span className="text-sm text-gray-500">
                            Showing {startIndex + 1}–{Math.min(endIndex, filteredData.length)}{" "}
                            of {filteredData.length}
                        </span>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-l-lg disabled:opacity-50"
                            >
                                Prev
                            </button>

                            {getPageNumbers().map((p, i) =>
                                p === "..." ? (
                                    <span key={i} className="px-3 h-8 border flex items-center">
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
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-r-lg disabled:opacity-50"
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

export default Role;