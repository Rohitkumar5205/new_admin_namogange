import React, { useState } from "react";
import { MdPrint, MdSearch } from "react-icons/md";
import { FaFileExcel } from "react-icons/fa";

const CommonTable = ({ data = [], columns = [], showCheckbox = true }) => {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [columnSearch, setColumnSearch] = useState({});

  /* ================= FILTER ================= */
  const filteredData = data.filter((item) => {
    const globalMatch = columns.some((col) =>
      item[col.key]?.toString().toLowerCase().includes(search.toLowerCase())
    );

    const columnMatch = columns.every((col) =>
      columnSearch[col.key]
        ? item[col.key]
            ?.toString()
            .toLowerCase()
            .includes(columnSearch[col.key].toLowerCase())
        : true
    );

    return globalMatch && columnMatch;
  });

  /* ================= SORT ================= */
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aVal = a[sortConfig.key]?.toString().toLowerCase();
    const bVal = b[sortConfig.key]?.toString().toLowerCase();
    return sortConfig.direction === "asc"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sortedData.slice(startIndex, endIndex);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return "↕";
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const getPageNumbers = () => {
    const pages = [];
    const visible = 3;

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + visible - 1, totalPages);

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push("...");
    }

    for (let i = start; i <= end; i++) pages.push(i);

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="w-full     min-w-[1150px]
      max-w-[1100px]">
      
      <div className="w-full bg-white shadow-sm rounded border border-gray-200 ">
        <div className="flex flex-col lg:flex-row justify-between gap-4 bg-gray-200 px-3 py-2  border-b border-gray-200 ">
        <div className="flex items-center gap-2 text-sm">
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
className="
    border border-gray-300
    ring-0 ring-gray-300
    rounded-md
    bg-gray-50
    px-2 py-1
    text-sm
    shadow-sm
    focus:outline-none
    focus:ring-0 focus:ring-blue-500
    focus:border-blue-500
  "          >
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
            className="flex items-center gap-2 px-4 py-1 border border-gray-300 shadow-md rounded text-sm bg-gray-50 hover:bg-gray-300"
          >
            <MdPrint /> Print
          </button>

          <button className="flex items-center gap-2 px-4 py-1 border shadow-md rounded text-sm text-[#F36B2A] border-[#F36B2A] bg-gray-50 hover:bg-[#F36B2A] hover:text-white">
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
              className="pl-9 pr-4 py-1 border outline-none border-gray-300 bg-gray-50 shadow-md rounded text-sm"
            />
          </div>
        </div>
      </div>
        {/* ================= TABLE SCROLL AREA ================= */}
<div className="relative w-full overflow-x-auto border-t border-b border-gray-200">
  <table className="min-w-full w-max table-auto text-sm text-left text-gray-600 border-collapse">

    {/* ================= HEADER ================= */}
    <thead className="sticky top-0 z-20 bg-gray-50 border-b border-gray-300">
      <tr>
        {showCheckbox && (
          <th className="sticky left-0 z-30 w-12 bg-gray-50 px-2 py-3">
            <input type="checkbox" />
          </th>
        )}

        {columns.map((col) => (
          <th
            key={col.key}
            onClick={() => handleSort(col.key)}
            className="
              px-4 py-3
              cursor-pointer select-none
              font-medium text-gray-800
              whitespace-nowrap
            "
          >
            {col.label}
            <span className="ml-1 text-xs">
              <SortIcon column={col.key} />
            </span>
          </th>
        ))}
      </tr>
    </thead>

    {/* ================= BODY ================= */}
    <tbody>
      {currentData.map((row, i) => (
        <tr
          key={i}
          className="border-b border-gray-300 hover:bg-gray-50"
        >
          {showCheckbox && (
            <td className="sticky left-0 z-10 w-12 bg-white px-2 py-1.5">
              <input type="checkbox" />
            </td>
          )}

          {columns.map((col) => (
            <td
              key={col.key}
              className="px-4 py-1.5 text-sm font-normal text-gray-600 whitespace-nowrap "
            >
              {col.render ? col.render(row) : row[col.key]}
            </td>
          ))}
        </tr>
      ))}

      {/* ================= EMPTY STATE ================= */}
      {filteredData.length === 0 && (
        <tr>
          <td
            colSpan={columns.length + (showCheckbox ? 1 : 0)}
            className="text-center py-6 text-gray-400"
          >
            No data found
          </td>
        </tr>
      )}

      {/* ================= COLUMN SEARCH ================= */}
      <tr className="sticky bottom-0 z-20 bg-white border-t border-gray-300">
        {showCheckbox && <td className="sticky left-0 bg-white" />}

        {columns.map((col) => (
          <td key={col.key} className="px-3 py-1">
            <input
              placeholder={`Search ${col.label}`}
              onChange={(e) =>
                setColumnSearch({
                  ...columnSearch,
                  [col.key]: e.target.value,
                })
              }
              className="
                w-30
                border border-gray-300
                rounded
                px-2 py-0.5
                text-sm
                focus:outline-none
                focus:ring-1 focus:ring-blue-500
              "
            />
          </td>
        ))}
      </tr>
    </tbody>
  </table>
</div>

        {/* ================= PAGINATION (NO SCROLL) ================= */}
        <div className="flex flex-col md:flex-row border-t border-gray-300 items-center justify-between gap-4 px-4 py-2">
          <span className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-800">
              {filteredData.length === 0 ? 0 : startIndex + 1}–
              {Math.min(endIndex, filteredData.length)}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-800">
              {filteredData.length}
            </span>
          </span>

          <div className="flex items-center space-x-1 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 h-8 border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Prev
            </button>

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
                  className={`w-8 h-8 border border-gray-300 ${
                    currentPage === page
                      ? "bg-blue-50 text-blue-600 font-semibold"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}

            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 h-8 border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonTable;
