import React, { useState } from "react";

/* ===== TABLE DATA ===== */
const tableData = [
  {
    id: 1,
    name: "Rohit Kumar",
    mobile: "9876543210",
    email: "rohit@gmail.com",
    address: "Haridwar",
    country: "India",
    state: "Uttarakhand",
    city: "Haridwar",
    pincode: "249401",
    status: "Active",
  },
];

const Source = () => {
  /* ===== FORM STATE ===== */
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    mobile: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    status: "Active",
  });

  const [data, setData] = useState(tableData);
  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION STATE (SAME AS BEFORE) ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== INPUT CHANGE ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // mobile – only 10 digits
    if (name === "mobile" && !/^\d{0,10}$/.test(value)) return;

    // pincode – only 6 digits
    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;

    setFormData({ ...formData, [name]: value });
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      setData(data.map((d) => (d.id === formData.id ? formData : d)));
      alert("Source updated successfully ✅");
    } else {
      setData([...data, { ...formData, id: Date.now() }]);
      alert("Source added successfully ✅");
    }

    setFormData({
      id: null,
      name: "",
      mobile: "",
      email: "",
      address: "",
      country: "",
      state: "",
      city: "",
      pincode: "",
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
          Source / Sub Coordinator Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update source details including contact & location.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Source" : "Add New Source"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
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

          {/* PIN CODE */}
          <div>
            <label className="block text-sm  text-gray-700 font-medium mb-1">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              maxLength={6}
              placeholder="Enter pincode"
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* BUTTONS */}
          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  id: null,
                  name: "",
                  mobile: "",
                  email: "",
                  address: "",
                  country: "",
                  state: "",
                  city: "",
                  pincode: "",
                  status: "Active",
                });
                setIsEdit(false);
              }}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
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
              {isEdit ? "Update Source" : "Add Source"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">Source List</h3>
        </div>

        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">City</th>
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
                <td className="px-4 py-3">{index + 1}.</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.mobile}</td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.status}</td>
                <td className="px-4 py-3">
                  <button
                    className="text-green-600 mr-3"
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

        {/* ================= PAGINATION (SAME STYLE) ================= */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, data.length)} of{" "}
            {data.length}
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
                  className={`px-3 h-8 border ${
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
              className="px-3 h-8 border border-gray-300 rounded-r-lg"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Source;
