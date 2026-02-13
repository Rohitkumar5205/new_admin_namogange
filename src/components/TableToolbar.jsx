import React, { useState } from "react";
import { MdPrint, MdSearch } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";

const tableData = [
  {
    id: 1,
    name: "Ann Sewa ",
    location: "Haridwar",
    category: "Ann Sewa",
    budget: "₹2,50,000",
    createdBy: "Admin",
  },
  {
    id: 2,
    name: "Ann Sewa ",
    location: "Varanasi",
    category: "Ann Sewa",
    budget: "₹1,80,000",
    createdBy: "Admin",
  },
  {
    id: 3,
    name: "NGO Organic ",
    location: "Uttarakhand",
    category: "NGO Farms",
    budget: "₹3,20,000",
    createdBy: "Rishi Kumar",
  },
  {
    id: 4,
    name: "Cow Shelter ",
    location: "Mathura",
    category: "NGO Farms",
    budget: "₹1,50,000",
    createdBy: "Rohit Kumar",
  },
  {
    id: 5,
    name: "Moksha Sewa ",
    location: "Haridwar",
    category: "Moksha Sewa",
    budget: "₹95,000",
    createdBy: "Admin",
  },
  {
    id: 6,
    name: "Moksha Sewa ",
    location: "Prayagraj",
    category: "Moksha Sewa",
    budget: "₹1,10,000",
    createdBy: "Admin",
  },
  {
    id: 7,
    name: "Ann Sewa ",
    location: "Rishikesh",
    category: "Ann Sewa",
    budget: "₹2,00,000",
    createdBy: "Admin",
  },
  {
    id: 8,
    name: "NGO Farm ",
    location: "Dehradun",
    category: "NGO Farms",
    budget: "₹2,75,000",
    createdBy: "Admin",
  },
  {
    id: 9,
    name: "Moksha Sewa",
    location: "Kashi",
    category: "Moksha Sewa",
    budget: "₹85,000",
    createdBy: "Admin",
  },
  {
    id: 10,
    name: "Ann Sewa ",
    location: "Ayodhya",
    category: "Ann Sewa",
    budget: "₹1,60,000",
    createdBy: "Admin",
  },
];

const TableToolbar = () => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc", // asc | desc
  });
  const [columnSearch, setColumnSearch] = useState({
    name: "",
    location: "",
    category: "",
    budget: "",
    createdBy: "",
  });

  const filteredData = tableData.filter((item) => {
    const globalSearch = search.toLowerCase();

    const matchesGlobalSearch =
      item.name.toLowerCase().includes(globalSearch) ||
      item.location.toLowerCase().includes(globalSearch) ||
      item.category.toLowerCase().includes(globalSearch) ||
      item.budget.toLowerCase().includes(globalSearch) ||
      item.createdBy.toLowerCase().includes(globalSearch);

    const matchesColumnSearch =
      item.name.toLowerCase().includes(columnSearch.name.toLowerCase()) &&
      item.location
        .toLowerCase()
        .includes(columnSearch.location.toLowerCase()) &&
      item.category
        .toLowerCase()
        .includes(columnSearch.category.toLowerCase()) &&
      item.budget.toLowerCase().includes(columnSearch.budget.toLowerCase()) &&
      item.createdBy
        .toLowerCase()
        .includes(columnSearch.createdBy.toLowerCase());

    return matchesGlobalSearch && matchesColumnSearch;
  });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aVal = a[sortConfig.key]?.toString().toLowerCase();
    const bVal = b[sortConfig.key]?.toString().toLowerCase();

    if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  /* PAGINATION on SORTED DATA */
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

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
              <th className="px-4 py-3 font-medium">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                />
              </th>
              <th
                className="px-6 py-3 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("name")}
              >
                Program / Initiative{" "}
                <span className="ml-1 text-xs">
                  <SortIcon column="name" />
                </span>
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("location")}
              >
                Location{" "}
                <span className="ml-1 text-xs">
                  <SortIcon column="location" />
                </span>
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("category")}
              >
                Service Type{" "}
                <span className="ml-1 text-xs">
                  <SortIcon column="category" />
                </span>
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("budget")}
              >
                Allocated Budget{" "}
                <span className="ml-1 text-xs">
                  <SortIcon column="budget" />
                </span>
              </th>

              <th
                className="px-6 py-3 cursor-pointer select-none whitespace-nowrap"
                onClick={() => handleSort("createdBy")}
              >
                Created By{" "}
                <span className="ml-1 text-xs">
                  <SortIcon column="createdBy" />
                </span>
              </th>
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
                    className="w-4 h-4 rounded border-gray-300 "
                  />
                </td>
                <td className="px-6 py-3 font-medium text-gray-800 whitespace-nowrap">
                  {item.name}
                </td>
                <td className="px-6 py-3 whitespace-nowrap">{item.location}</td>
                <td className="px-6 py-3 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-3 whitespace-nowrap">{item.budget}</td>
                <td className="px-6 py-3 whitespace-nowrap">
                  {item.createdBy}
                </td>
              </tr>
            ))}

            {/* SEARCH ROW – EXACT SAME COLUMNS AS HEADER */}
            <tr className="bg-white border-t border-gray-300">
              {/* Checkbox column – EMPTY */}
              <td className="px-2 py-1"></td>

              {/* Program / Initiative */}
              <td className="px-2 py-1">
                <input
                  placeholder="Search Program"
                  value={columnSearch.name}
                  onChange={(e) =>
                    setColumnSearch({ ...columnSearch, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-sm"
                />
              </td>

              {/* Location */}
              <td className="px-2 py-1">
                <input
                  placeholder="Search Location"
                  value={columnSearch.location}
                  onChange={(e) =>
                    setColumnSearch({
                      ...columnSearch,
                      location: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-sm"
                />
              </td>

              {/* Service Type */}
              <td className="px-2 py-1">
                <input
                  placeholder="Search Service Type"
                  value={columnSearch.category}
                  onChange={(e) =>
                    setColumnSearch({
                      ...columnSearch,
                      category: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-sm"
                />
              </td>

              {/* Allocated Budget */}
              <td className="px-2 py-1">
                <input
                  placeholder="Search Budget"
                  value={columnSearch.budget}
                  onChange={(e) =>
                    setColumnSearch({ ...columnSearch, budget: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-sm"
                />
              </td>

              {/* Created By */}
              <td className="px-2 py-1">
                <input
                  placeholder="Search Created By"
                  value={columnSearch.createdBy}
                  onChange={(e) =>
                    setColumnSearch({
                      ...columnSearch,
                      createdBy: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded outline-none px-2 py-1 text-sm"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex flex-col md:flex-row border-t border-gray-300 items-center justify-between gap-4 px-4 py-2">
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
              className={`px-3 h-8 border border-gray-300 rounded-l-lg
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
                  className="w-9 h-8 flex items-center justify-center border text-gray-400 border-gray-300"
                >
                  …
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-8 h-8 border border-gray-300
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
              className={`px-3 h-8 border rounded-r-lg border-gray-300
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

export default TableToolbar;
