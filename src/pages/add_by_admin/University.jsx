import React, { useState } from "react";
import { MdVisibility, MdEdit, MdDelete } from "react-icons/md";

/* ===== TABLE DATA ===== */
const tableData = [
  { id: 1, title: "Farmer", status: "Active" },
  { id: 2, title: "Teacher", status: "Active" },
  { id: 3, title: "Businessman", status: "Inactive" },
];

const University = () => {
  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    id: null,
    title: "",
    country: "",
    state: "",
    city: "",
    status: "Active",
  });
  const [search, setSearch] = useState("");
  const [data, setData] = useState(tableData);
  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION STATE ===== */
  // const itemsPerPage = 5;
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      // UPDATE
      const updated = data.map((item) =>
        item.id === formData.id
          ? {
              ...formData,
              image:
                typeof formData.image === "string"
                  ? formData.image
                  : URL.createObjectURL(formData.image),
            }
          : item
      );

      setData(updated);
      alert("University updated successfully ✅");
      console.log("UPDATED 👉", formData);
    } else {
      // ADD
      const newBanner = {
        ...formData,
        id: Date.now(),
        image: formData.image
          ? URL.createObjectURL(formData.image)
          : "/placeholder.png",
      };

      setData([...data, newBanner]);
      alert("University added successfully ✅");
      console.log("ADDED 👉", newBanner);
    }

    // RESET FORM
    setFormData({
      id: null,
      title: "",
      status: "Active",
    });
    setIsEdit(false);
  };
  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== PAGINATION LOGIC ===== */
  // const totalPages = Math.ceil(data.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;
  // const currentData = data.slice(startIndex, endIndex);
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
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add University Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update University content details including contact & location,
          status.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update University" : "Add New University"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter banner title"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
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
            >
              <option value="">Select City</option>
              <option value="India">Lucknow</option>
              <option value="India">Gurgaon</option>
              <option value="India">Chandigarh</option>
            </select>
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
                  title: "",
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
        <div className="px-5 py-2 border-b border-gray-200 flex flex-wrap gap-4 justify-between">
          <h3 className="text-base font-medium text-gray-800">
            University List
          </h3>
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
          <thead className="bg-gray-50 border-b  border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">University Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{item.id}.</td>
                <td className="px-4 py-3 font-medium">{item.title}</td>

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

export default University;
