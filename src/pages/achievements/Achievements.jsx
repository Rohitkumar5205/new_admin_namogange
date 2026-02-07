import React, { useState, useEffect } from "react";
import { Editor } from "primereact/editor";
import { useDispatch, useSelector } from "react-redux";
import adminBanner from "../../assets/banners/bg.jpg";
import {
    createAchievement,
    getAllAchievements,
    updateAchievement,
    deleteAchievement,
} from "../../redux/slices/achievements/achievementSlice";
import { showSuccess, showError } from "../../utils/toastService";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const Achievements = () => {
    const dispatch = useDispatch();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        _id: null,
        title: "",
        link: "",
        slug: "",
        image: null,
        meta_keywords: "",
        meta_desc: "",
        desc: "",
        created_by: "",
        updated_by: "",
        status: "Active",
    });

    const [isEdit, setIsEdit] = useState(false);
    const authUser = JSON.parse(localStorage.getItem("user"));
    const { achievements, loading } = useSelector((state) => state.achievements);

    /* ===== FETCH DATA ===== */
    useEffect(() => {
        dispatch(getAllAchievements());
    }, [dispatch]);
    const { canRead, canWrite, canDelete, isFormDisabled } = useRoleRights(PageNames.ACHIEVEMENTS);

    /* ===== PAGINATION STATE ===== */
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

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
            link: "",
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
        if (window.confirm("Are you sure you want to delete this achievement?")) {
            const currentUserId = authUser?.id || null;
            dispatch(deleteAchievement({ id: id, user_id: currentUserId })).then(
                () => {
                    showSuccess("Achievement deleted successfully");
                    dispatch(getAllAchievements());
                }
            );
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title?.trim()) {
            showError("Title is required.");
            return;
        }

        setIsSubmitting(true);

        const dataToSend = new FormData();
        dataToSend.append("title", formData.title);
        dataToSend.append("slug", formData.slug);
        dataToSend.append("link", formData.link);
        dataToSend.append("status", formData.status);
        dataToSend.append("meta_keywords", formData.meta_keywords);
        dataToSend.append("meta_desc", formData.meta_desc);
        dataToSend.append("desc", formData.desc);

        if (formData.image instanceof File) {
            dataToSend.append("image", formData.image);
        }

        const currentUserId = authUser?.id || null;
        const currentUserName = authUser?.username || "";

        try {
            if (isEdit) {
                dataToSend.append("updated_by", currentUserName);
                dataToSend.append("user_id", currentUserId);
                await dispatch(
                    updateAchievement({ id: formData._id, formData: dataToSend })
                ).unwrap();
                showSuccess("Achievement updated successfully");
            } else {
                dataToSend.append("created_by", currentUserName);
                dataToSend.append("user_id", currentUserId);
                await dispatch(createAchievement(dataToSend)).unwrap();
                showSuccess("Achievement added successfully");
            }

            await dispatch(getAllAchievements()).unwrap();
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
    const totalPages = Math.ceil((achievements?.length || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = achievements?.slice(startIndex, endIndex);

    const getPageNumbers = () => {
        const pages = [];
        // const maxVisible = 3;

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (currentPage > 2) pages.push("...");
            if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
            if (currentPage < totalPages - 1) pages.push("...");
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
                <div className="absolute inset-0 bg-white/10"></div>
                <div className="relative flex justify-center items-center px-6 py-4 h-25">
                    <div className="flex flex-col text-center">
                        <h2 className="text-xl font-semibold text-white text-center">
                            Achievements Management
                        </h2>
                        <p className="text-sm text-blue-100">
                            Add or update Achievements content.
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-3 p-5">
                {/* ================= FORM ================= */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-base font-medium text-gray-800 mb-4">
                        {isEdit ? "Update Achievement" : "Add New Achievement"}
                    </h3>

                    <form
                        onSubmit={handleSubmit}
                        className={`grid grid-cols-1 md:grid-cols-3 gap-3 ${isFormDisabled ? "opacity-60 pointer-events-none" : ""}`}
                    >
                        {/* TITLE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Achievements Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter achievement title"
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                disabled={isFormDisabled}
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
                                disabled={isFormDisabled}
                                className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>
                        {/* LINK */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Link
                            </label>
                            <input
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="Enter link"
                                disabled={isFormDisabled}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
                                disabled={isFormDisabled}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
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
                                disabled={isFormDisabled}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* META DESCRIPTION */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Meta Description
                            </label>
                            <textarea
                                name="meta_desc"
                                value={formData.meta_desc}
                                onChange={handleChange}
                                placeholder="Enter meta description"
                                rows={1}
                                disabled={isFormDisabled}
                                className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div className="md:col-span-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <Editor
                                value={formData.desc}
                                onTextChange={(e) =>
                                    setFormData({ ...formData, desc: e.htmlValue })
                                }
                                style={{ height: "160px" }}
                                readOnly={isFormDisabled}
                                className="w-full text-sm outline-none"
                            />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="md:col-span-4 flex justify-end gap-3 mt-2">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={isSubmitting || isFormDisabled}
                                className={`px-5 py-1.5 text-sm text-white border border-gray-300 rounded bg-blue-500 hover:bg-blue-600 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
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
                                        ? "Update Achievement"
                                        : "Add Achievement"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* ================= TABLE ================= */}
                <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
                    <div className="px-5 py-2 border-b bg-gray-200 border-gray-200">
                        <h3 className="text-base font-medium text-gray-800">
                            Achievements List
                        </h3>
                    </div>

                    <table className="w-full text-sm text-left text-gray-600">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 py-3">S.No</th>
                                <th className="px-4 py-3">Title</th>
                                {/* <th className="px-4 py-3">Link</th> */}
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Status</th>
                                {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
                            </tr>
                        </thead>

                        <tbody>
                            {loading && achievements?.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">
                                        Loading...
                                    </td>
                                </tr>
                            ) : (
                                currentData?.map((item, index) => (
                                    <tr
                                        key={item._id}
                                        className="border-b border-gray-200 hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">{startIndex + index + 1}.</td>
                                        <td className="px-4 py-3 font-medium">{item.title}</td>
                                        {/* <td className="px-4 py-3 text-blue-600 underline">
                                            {item.link}
                                        </td> */}
                                        <td className="px-4 py-3">
                                            <img
                                                src={item.image || "/placeholder.png"}
                                                alt="Achievement"
                                                className="h-10 w-20 object-cover rounded border border-gray-300"
                                            />
                                        </td>
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
                                                            className="text-green-600 hover:underline"
                                                            onClick={() => {
                                                                setFormData({
                                                                    _id: item._id,
                                                                    title: item.title,
                                                                    link: item.link,
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
                        </tbody>
                    </table>

                    {/* ================= PAGINATION ================= */}
                    <div className="flex justify-between items-center p-4">
                        <span className="text-sm text-gray-500">
                            Showing {startIndex + 1}–
                            {Math.min(endIndex, achievements?.length || 0)} of{" "}
                            {achievements?.length || 0}
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

export default Achievements;