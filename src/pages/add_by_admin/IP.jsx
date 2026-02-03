// c:\Projects\NamoGange\new_admin_namogange\src\pages\users\IP.jsx

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess, showError } from "../../utils/toastService";
import {
    createIP,
    getAllIPs,
    updateIP,
    deleteIP,
} from "../../redux/slices/add_by_admin/ipSlice";
import adminBanner from "../../assets/banners/bg.jpg";

const IP = () => {
    const dispatch = useDispatch();
    // Assuming the slice is named 'ip' and has 'ips' array
    const { ips, loading } = useSelector((state) => state.ip || {});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* ===== FORM STATE ===== */
    const [formData, setFormData] = useState({
        _id: null,
        ip_name: "",
        ip_address: "",
        remark: "",
        status: "Active",
    });

    const [isEdit, setIsEdit] = useState(false);
    const [search, setSearch] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const authUser = JSON.parse(localStorage.getItem("user"));
    const currentUserId = authUser?._id || authUser?.id || null;

    /* ===== FETCH DATA ===== */
    useEffect(() => {
        dispatch(getAllIPs());
    }, [dispatch]);

    const filteredData = (ips || []).filter(
        (item) =>
            (item.ip_name || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.ip_address || "").toLowerCase().includes(search.toLowerCase()) ||
            (item.remark || "").toLowerCase().includes(search.toLowerCase())
    );

    const resetForm = () => {
        setFormData({
            _id: null,
            ip_name: "",
            ip_address: "",
            remark: "",
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
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.ip_address.trim()) {
            showError("IP Address is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const ipData = {
                ip_name: formData.ip_name,
                ip_address: formData.ip_address,
                remark: formData.remark,
                status: formData.status,
            };

            if (isEdit) {
                await dispatch(
                    updateIP({
                        id: formData._id,
                        data: { ...ipData, updated_by: currentUserId },
                    })
                ).unwrap();
                showSuccess("IP updated successfully");
            } else {
                await dispatch(
                    createIP({
                        ...ipData,
                        created_by: currentUserId,
                        updated_by: currentUserId,
                    })
                ).unwrap();
                showSuccess("IP added successfully");
            }
            dispatch(getAllIPs());
            resetForm();
        } catch (error) {
            console.error(error);
            // showError("Operation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this IP?")) {
            dispatch(deleteIP({ id, user_id: currentUserId })).then(() => {
                showSuccess("IP deleted successfully");
                dispatch(getAllIPs());
            });
        }
    };

    return (
        <div className="space-y-6">
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
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="relative flex justify-center items-center px-6 py-4 h-25">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col text-center">
                            <h2 className="text-xl font-semibold text-white text-center">
                                IP Management
                            </h2>
                            <p className="text-sm text-blue-100">
                                Add or update IP addresses and their status.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="space-y-3 p-5">
                {/* ================= FORM ================= */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-base font-medium text-gray-800 mb-4">
                        {isEdit ? "Update IP" : "Add New IP"}
                    </h3>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-4 gap-3"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IP Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="ip_name"
                                placeholder="Enter IP Name"
                                value={formData.ip_name}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                IP Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="ip_address"
                                placeholder="Enter IP Address"
                                value={formData.ip_address}
                                onChange={handleChange}
                                required
                                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remark
                            </label>
                            <input
                                name="remark"
                                placeholder="Remark (Optional)"
                                value={formData.remark}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isSubmitting}
                                className={`px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`px-6 py-1.5 text-sm rounded text-white ${isEdit
                                    ? "bg-blue-600 hover:bg-blue-700"
                                    : "bg-green-600 hover:bg-green-700"
                                    } ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : isEdit
                                        ? "Update IP"
                                        : "Add IP"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ================= TABLE ================= */}
                <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-5 py-2 border-b border-gray-200 flex flex-wrap gap-4 justify-between">
                        <h3 className="text-base font-medium text-gray-800">IP List</h3>
                        <div className="flex gap-2">
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
                                <th className="px-4 py-3">S.No</th>
                                <th className="px-4 py-3">IP Name</th>
                                <th className="px-4 py-3">IP Address</th>
                                <th className="px-4 py-3">Remark</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (!ips || ips.length === 0) ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
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
                                        <td className="px-4 py-3">{item.ip_name}</td>
                                        <td className="px-4 py-3">{item.ip_address}</td>
                                        <td className="px-4 py-3">{item.remark || "-"}</td>
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
                                        <td className="px-4 py-3 flex gap-3">
                                            <button
                                                className="relative text-sm text-green-600 transition
after:absolute after:left-0 after:-bottom-0.5
after:h-[1.5px] after:w-0 after:bg-green-600
after:transition-all after:duration-300
hover:after:w-full"
                                                onClick={() => {
                                                    setFormData({
                                                        _id: item._id,
                                                        ip_name: item.ip_name,
                                                        ip_address: item.ip_address,
                                                        remark: item.remark || "",
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
                                        </td>
                                    </tr>
                                ))
                            )}
                            {!loading && currentData.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        No records found
                                    </td>
                                </tr>
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
                                className="px-3 h-8 text-gray-600 border border-gray-300 hover:bg-gray-50 rounded-l-lg disabled:opacity-50"
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
                                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
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

export default IP;