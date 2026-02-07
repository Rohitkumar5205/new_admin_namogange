import React, { useState } from "react";
import { MdPrint, MdSearch } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";

/* ===== TABLE DATA ===== */
const tableData = [
  {
    id: 1,
    name: "Ann Sewa – Free Food Distribution",
    location: "Haridwar",
    category: "Ann Sewa",
    budget: "₹2,50,000",
  },
  {
    id: 2,
    name: "Ann Sewa – Community Kitchen",
    location: "Varanasi",
    category: "Ann Sewa",
    budget: "₹1,80,000",
  },
  {
    id: 3,
    name: "NGO Organic Farming Initiative",
    location: "Uttarakhand",
    category: "NGO Farms",
    budget: "₹3,20,000",
  },
  {
    id: 4,
    name: "Cow Shelter & Gaushala Support",
    location: "Mathura",
    category: "NGO Farms",
    budget: "₹1,50,000",
  },
  {
    id: 5,
    name: "Moksha Sewa – Last Rites Support",
    location: "Haridwar",
    category: "Moksha Sewa",
    budget: "₹95,000",
  },
  {
    id: 6,
    name: "Moksha Sewa – Antim Sanskar Assistance",
    location: "Prayagraj",
    category: "Moksha Sewa",
    budget: "₹1,10,000",
  },
  {
    id: 7,
    name: "Ann Sewa – School Meal Program",
    location: "Rishikesh",
    category: "Ann Sewa",
    budget: "₹2,00,000",
  },
  {
    id: 8,
    name: "NGO Farm – Natural खेती Project",
    location: "Dehradun",
    category: "NGO Farms",
    budget: "₹2,75,000",
  },
  {
    id: 9,
    name: "Moksha Sewa – Cremation Support",
    location: "Kashi",
    category: "Moksha Sewa",
    budget: "₹85,000",
  },
  {
    id: 10,
    name: "Ann Sewa – Emergency Food Relief",
    location: "Ayodhya",
    category: "Ann Sewa",
    budget: "₹1,60,000",
  },
];

const Table = () => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* ===== FILTER ===== */
  const filteredData = tableData.filter(
    (item) =>
      item.name?.toLowerCase().includes(search?.toLowerCase()) ||
      item.category?.toLowerCase().includes(search?.toLowerCase()) ||
      item.color?.toLowerCase().includes(search?.toLowerCase())
  );

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3; // show 1 2 3

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // First pages
      for (let i = 1; i <= maxVisible; i++) {
        pages.push(i);
      }

      // Ellipsis
      if (totalPages > maxVisible + 1) {
        pages.push("...");
      }

      // Last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="">
      {/* TOOLBAR */}
      <div className="flex flex-col lg:flex-row justify-between gap-4 bg-white px-3 py-2 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 text-sm">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border outline-none border-gray-400 shadow-md rounded-md px-2 py-1.5"
          >
            {[5, 10, 25, 50].map((n) => (
              <option key={n} value={n}>
                <span>Show</span> {n} <span>Entries</span>
              </option>
            ))}
          </select>
          <span>Entries</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 border outline-none border-gray-400 shadow-md rounded-lg text-sm hover:bg-gray-100"
          >
            <MdPrint /> Print
          </button>

          <button className="flex items-center gap-2 px-4 py-2 border outline-none  shadow-md rounded-lg text-sm text-[#F36B2A] border-[#F36B2A] hover:bg-[#F36B2A] hover:text-white">
            <FaFileExcel /> Excel
          </button>

          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search here..."
              className="pl-9 pr-4 py-2 border outline-none border-gray-400 shadow-md rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* ===== TABLE (DESIGN UNCHANGED) ===== */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-xl border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-sm bg-gray-50 border-b border-gray-300">
            <tr>
              <th className="px-4 py-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th className="px-6 py-3">Program / Initiative</th>
              <th className="px-6 py-3">Location</th>
              <th className="px-6 py-3">Service Type</th>
              <th className="px-6 py-3">Allocated Budget</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-300 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300"
                  />
                </td>
                <td className="px-6 py-3 font-medium text-gray-800">
                  {item.name}
                </td>
                <td className="px-6 py-3">{item.location}</td>
                <td className="px-6 py-3">{item.category}</td>
                <td className="px-6 py-3">{item.budget}</td>
                <td className="px-6 py-3">
                  <button className="text-blue-600 hover:underline font-medium">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4">
          <span className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredData.length === 0 ? 0 : startIndex + 1}–
              {Math.min(endIndex, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-base text-gray-800">
              {filteredData.length}
            </span>
          </span>

          <div className="flex items-center space-x-1 text-sm">
            {/* PREVIOUS */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 h-9 border border-gray-300 rounded-l-lg
        ${
          currentPage === 1
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
            >
              Prev
            </button>

            {/* PAGE NUMBERS */}
            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <span
                  key={index}
                  className="w-9 h-9 flex items-center justify-center border text-gray-400 border-gray-300"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 border border-gray-300
            ${
              currentPage === page
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "hover:bg-gray-100"
            }`}
                >
                  {page}
                </button>
              )
            )}

            {/* NEXT */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 h-9 border rounded-r-lg border-gray-300
        ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "hover:bg-gray-100"
        }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
