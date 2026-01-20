import React, { useState } from "react";
import { Editor } from "primereact/editor";

/* ===== INITIAL TABLE DATA ===== */
const tableData = [
  {
    id: 1,
    name: "Ganga Aarti",
    date: "2025-01-15",
    reporting_point: "Har Ki Pauri",
    coordinator_contact: "9876543210",
    reporting_time: "06:00 AM",
    HSN_code: "HSN001",
    link: "https://example.com",
    description: "Morning Aarti Event",
    status: "Active",
  },
];

const Event = () => {
  /* ===== FORM STATE ===== */
  const [form, setForm] = useState({
    id: null,
    name: "",
    date: "",
    reporting_point: "",
    coordinator_contact: "",
    reporting_time: "",
    HSN_code: "",
    link: "",
    description: "",
    status: "Active",
  });

  const [data, setData] = useState(tableData);
  const [isEdit, setIsEdit] = useState(false);

  /* ===== PAGINATION STATE ===== */
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      setData(data.map((d) => (d.id === form.id ? { ...form } : d)));
      alert("Event updated successfully ✅");
    } else {
      setData([...data, { ...form, id: Date.now() }]);
      alert("Event added successfully ✅");
    }

    setForm({
      id: null,
      name: "",
      date: "",
      reporting_point: "",
      coordinator_contact: "",
      reporting_time: "",
      HSN_code: "",
      link: "",
      description: "",
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
          Add Event Management
        </h2>
        <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update Event content including reporting details.
        </p>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Event" : "Add New Event"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Event Name"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reporting Point <span className="text-red-500">*</span>
            </label>
            <input
              name="reporting_point"
              value={form.reporting_point}
              onChange={handleChange}
              type="text"
              placeholder="Reporting Point"
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordinator Contact <span className="text-red-500">*</span>
            </label>

            <input
              name="coordinator_contact"
              type="tel"
              placeholder="Coordinator Contact"
              value={form.coordinator_contact}
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]{10}"
              onChange={(e) => {
                const onlyNumbers = e.target.value.replace(/[^0-9]/g, "");
                if (onlyNumbers.length <= 10) {
                  handleChange({
                    target: {
                      name: "coordinator_contact",
                      value: onlyNumbers,
                    },
                  });
                }
              }}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reporting Time <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="reporting_time"
              placeholder="HH:MM"
              value={form.reporting_time}
              maxLength={5}
              onChange={(e) => {
                let value = e.target.value;

                // allow only digits and :
                value = value.replace(/[^0-9:]/g, "");

                // prevent multiple :
                if ((value.match(/:/g) || []).length > 1) return;

                setForm((prev) => ({
                  ...prev,
                  reporting_time: value,
                }));
              }}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HSN Code <span className="text-red-500">*</span>
            </label>
            <input
              name="HSN_code"
              type="text"
              value={form.HSN_code}
              onChange={handleChange}
              placeholder="HSN Code"
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Link <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="link"
              value={form.link}
              onChange={handleChange}
              placeholder="Event Link"
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              required
              value={form.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>

            <Editor
              value={form.description}
              name="description"
              onTextChange={(e) =>
                setForm({ ...form, description: e.htmlValue })
              }
              style={{
                height: "200px",
                borderRadius: "4px", // rounded
                borderBottom: "1px solid #e5e7eb", // border-gray-200
                overflow: "hidden", // corners properly clip ho
              }}
              className="w-full text-sm outline-none"
            />
          </div>

          <div className="md:col-span-4 flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={() => {
                setForm({
                  id: null,
                  name: "",
                  date: "",
                  reporting_point: "",
                  coordinator_contact: "",
                  reporting_time: "",
                  HSN_code: "",
                  link: "",
                  description: "",
                  status: "Active",
                });
                setIsEdit(false);
              }}
              className="px-5 py-1.5 border text-sm rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-1.5 text-sm rounded text-white ${
                isEdit ? "bg-blue-600" : "bg-green-600"
              }`}
            >
              {isEdit ? "Update Event" : "Add Event"}
            </button>
          </div>
        </form>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">Events List</h3>
        </div>
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b  border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{startIndex + i + 1}.</td>
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.date}</td>
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
                  <button
                    className="text-green-600 mr-3"
                    onClick={() => {
                      setForm(item);
                      setIsEdit(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => {
                      if (window.confirm("Delete this event?")) {
                        setData(data.filter((d) => d.id !== item.id));
                      }
                    }}
                  >
                    Delete
                  </button>
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

export default Event;
