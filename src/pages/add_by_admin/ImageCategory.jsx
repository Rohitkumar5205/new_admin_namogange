import React, { useState } from "react";

/* ===== TABLE DATA ===== */
const tableData = [
  {
    id: 1,
    title: "Ganga Aarti",
    category: "Religious",
    order_by: 1,
    image: "/placeholder.png",
    status: "Active",
  },
  {
    id: 2,
    title: "Tree Plantation",
    category: "Environment",
    order_by: 2,
    image: "/placeholder.png",
    status: "Inactive",
  },
];

const ImageCategory = () => {
  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    category: "",
    order_by: "",
    image: null,
    status: "Active",
  });

  const [data, setData] = useState(tableData);
  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION (SAME AS YOUR CODE) ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

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

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      setData(
        data.map((item) =>
          item.id === formData.id
            ? {
                ...formData,
                image:
                  typeof formData.image === "string"
                    ? formData.image
                    : URL.createObjectURL(formData.image),
              }
            : item
        )
      );
    } else {
      setData([
        ...data,
        {
          ...formData,
          id: Date.now(),
          image: formData.image
            ? URL.createObjectURL(formData.image)
            : "/placeholder.png",
        },
      ]);
    }

    setFormData({
      id: null,
      title: "",
      category: "",
      order_by: "",
      image: null,
      status: "Active",
    });
    setIsEdit(false);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add Image Category Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update Image Category content.
        </p>
      </div>

      {/* ================= FORM (DESIGN SAME) ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Image Category" : "Add New Image Category"}
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
              placeholder="Enter title"
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select Category</option>
              <option value="Religious">Religious</option>
              <option value="Environment">Environment</option>
              <option value="Social">Social</option>
            </select>
          </div>

          {/* ORDER BY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Order By <span className="text-red-500">*</span>
            </label>
            <select
              name="order_by"
              value={formData.order_by}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select</option>
              {Array.from({ length: 50 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image File
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-1 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: null,
                  title: "",
                  category: "",
                  order_by: "",
                  image: null,
                  status: "Active",
                });
                setIsEdit(false);
              }}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-1.5 text-sm rounded text-white ${
                isEdit ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {isEdit ? "Update Image Category" : "Add Image Category"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE (DESIGN SAME) ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">
            Image Category List
          </h3>
        </div>{" "}
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{startIndex + index + 1}.</td>
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3">{item.order_by}</td>
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
                <td className="px-4 py-3 flex gap-3">
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
                    onClick={() =>
                      setData(data.filter((d) => d.id !== item.id))
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* ================= PAGINATION (SAME DESIGN) ================= */}
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

export default ImageCategory;
