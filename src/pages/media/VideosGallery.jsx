import React, { useState } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

/* ===== TABLE DATA ===== */
const tableData = [
  {
    id: 1,
    title: "Ann Sewa – Free Food Distribution",
    date: "2025-01-10",
    category: "Ann Sewa",
    orderBy: 1,
    location: "Haridwar",
    image: "/images/banner1.jpg",
    status: "Active",
  },
  {
    id: 2,
    title: "Community Kitchen",
    date: "2025-01-12",
    category: "Ann Sewa",
    orderBy: 2,
    location: "Varanasi",
    image: "/images/banner2.jpg",
    status: "Inactive",
  },
];
const CATEGORY_OPTIONS = [
  "Ann Sewa",
  "NGO Farms",
  "Moksha Sewa",
  "Education",
  "Health Care",
];

const VideosGallery = () => {
  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    date: "",
    category: "",
    orderBy: "",
    location: "",
    videoLink: "",
    status: "Active",
  });

  const [data, setData] = useState(tableData);
  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const newEntry = {
    ...formData,
    id: Date.now(),
  };
  const updatedData = data.map((item) =>
    item.id === formData.id ? { ...formData } : item
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      // UPDATE
      const updatedData = data.map((item) =>
        item.id === formData.id ? { ...formData } : item
      );
      setData(updatedData);
      alert("Banner updated successfully ✅");
      console.log("UPDATED DATA 👉", formData);
    } else {
      // ADD
      const newEntry = {
        ...formData,
        id: Date.now(),
        videoLink: formData.videoLink,
      };
      setData([...data, newEntry]);
      alert("Banner added successfully ✅");
      console.log("ADDED DATA 👉", newEntry);
    }

    // RESET
    setFormData({
      id: null,
      title: "",
      date: "",
      category: "",
      orderBy: "",
      location: "",
      image: null,
      status: "Active",
    });
    setIsEdit(false);
  };

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(data.length / itemsPerPage);
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
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Videos Gallery Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update videos gallery content including title, image, link and
          status.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Video Gallery" : "Add Video Gallery"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
              required
            />
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
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* ORDER BY (1–50) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order By
            </label>
            <select
              name="orderBy"
              value={formData.orderBy}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="">Select Order</option>
              {Array.from({ length: 50 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Video Link <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="videoLink"
              value={formData.videoLink}
              required
              onChange={handleChange}
              placeholder="https://youtube.com/embed/xxxx"
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* ACTION BUTTONS */}
          <div className="md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: null,
                  title: "",
                  date: "",
                  category: "",
                  orderBy: "",
                  location: "",
                  image: null,
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
              className={`px-6 py-1.5 text-sm rounded-md text-white ${
                isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isEdit ? "Update Image" : "Add Image"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">
            Video Gallery List
          </h3>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Video Link</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3">{item.date}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.orderBy}</td>
                <td className="px-4 py-3">{item.location}</td>
                <td className="px-4 py-3">
                  {item.videoLink ? (
                    <iframe
                      src={item.videoLink}
                      title="video"
                      className="w-32 h-20 rounded border"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <span className="text-gray-400 text-xs">No Video</span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      item.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      className="text-green-600"
                      onClick={() => {
                        setFormData(item);
                        setIsEdit(true);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="text-red-600"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this banner?"
                          )
                        ) {
                          setData(data.filter((d) => d.id !== item.id));
                          alert("Banner deleted successfully ❌");
                          console.log("DELETED ID 👉", item.id);
                        }
                      }}
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
            Showing {startIndex + 1}–{Math.min(endIndex, data.length)} of{" "}
            {data.length}
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

export default VideosGallery;
