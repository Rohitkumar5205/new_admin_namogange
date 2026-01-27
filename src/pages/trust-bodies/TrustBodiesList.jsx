import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllTrustBodies,
  deleteTrustBody,
} from "../../redux/slices/trustbody/trustBodySlice";
import { showSuccess, showError } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";

const TrustBodiesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list, loading } = useSelector((state) => state.trustBody || {});
  const authUser = JSON.parse(localStorage.getItem("user"));

  // Fetch data on mount
  useEffect(() => {
    dispatch(getAllTrustBodies());
  }, [dispatch]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  /* ===== FILTER DATA ===== */
  const filteredData = (list || []).filter(
    (item) =>
      (item.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (item.designation || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ===== PAGINATION LOGIC ===== */
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

      <div
        className="relative overflow-hidden rounded shadow-sm border border-gray-200 h-25"
        style={{
          backgroundImage: `url(${adminBanner})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex items-center gap-3">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-white text-center">
                Lists Trust Bodies Management
              </h2>
              <p className="text-sm text-blue-100">
                Add or update Trust Bodies content including title, image, link
                and status.{" "}
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate("/trust-bodies/add-trust-bodies")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              {" "}
              Add Trust Bodies
            </button>
          </div>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        {/* <div className="px-5 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-800">
            Trust Bodies List
          </h3>
        </div> */}
        <div className="px-5 py-2 border-b border-gray-200 flex flex-wrap gap-4 justify-between">
          <h3 className="text-base font-medium text-gray-800">
            Trust Bodies List
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Designation</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Image</th>{" "}
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (!list || list.length === 0) ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4">
                  No data found
                </td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr
                  key={item._id || index}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{startIndex + index + 1}.</td>
                  <td className="px-4 py-3 font-medium">{item.name}</td>
                  <td className="px-4 py-3">{item.designation}</td>
                  <td className="px-4 py-3">{item.slug}</td>
                  <td className="px-4 py-3">
                    <img
                      src={item.image}
                      className="h-10 w-20 object-cover rounded border"
                      alt="img"
                    />
                  </td>

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
                          navigate("/trust-bodies/add-trust-bodies", {
                            state: item,
                          });
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
                          dispatch(
                            deleteTrustBody({
                              id: item._id,
                              user_id: authUser?.id,
                            })
                          ).then(() => {
                            showSuccess("Trust Body deleted successfully");
                          });
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
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

export default TrustBodiesList;
