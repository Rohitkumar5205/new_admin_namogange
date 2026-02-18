import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";
import { getAllColleges, deleteCollege } from "../../redux/slices/college/collegeSlice";
import { showSuccess, showError } from "../../utils/toastService";

const CollegeList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colleges, loading } = useSelector((state) => state.college);
  // console.log("Colleges from Redux Store:", colleges);
  const { user } = useSelector((state) => state.auth);
  const { canRead: canAdd, canWrite, canDelete } = useRoleRights(PageNames.ADD_COLLEGE);

  // Pagination state
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(getAllColleges());
  }, [dispatch]);

  const handleDelete = async (id) => {
      const authUser = user || JSON.parse(localStorage.getItem("user"));
      const userId = authUser?._id || authUser?.id;
      try {
        await dispatch(deleteCollege({ id, user_id: userId })).unwrap();
        showSuccess("College deleted successfully");
      } catch (error) {
        showError(error || "Failed to delete college");
      }
    
  };

  const handleEdit = (item) => {
    navigate("/collage/add-college", { state: item });
  };

  // Pagination logic
  const safeColleges = Array.isArray(colleges) ? colleges : [];
  const totalPages = Math.ceil(safeColleges.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = safeColleges.slice(startIndex, endIndex);

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
    <div className="">
      {/* ================= HEADER ================= */}
     
<div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                College List Management
              </h2>
              <p className="text-sm text-blue-100">
                Manage and oversee all college details and information in one place.
              </p>
            </div>
          </div>
          {canAdd && (
            <div>
              <button
                onClick={() => navigate("/collage/add-college")}
                className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
              >
                {" "}
                Add College
              </button>
            </div>
          )}
        </div>
      </div>

<div className="space-y-3 p-5">
      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-medium">S.No</th>
              <th className="px-4 py-3 font-medium">College Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Website</th>
              <th className="px-4 py-3 font-medium">City</th>
              <th className="px-4 py-3 font-medium">State</th>
              <th className="px-4 py-3 font-medium">Affiliated To</th>
              <th className="px-4 py-3 font-medium">Status</th>
              {(canWrite || canDelete) && <th className="px-4 py-3 font-medium">Action</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={item?._id || index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">{startIndex + index + 1}.</td>
                  <td className="px-4 py-3 font-medium">{item?.college_name || "N/A"}</td>
                  <td className="px-4 py-3">{item?.category || "N/A"}</td>
                  <td className="px-4 py-3 text-blue-500">
                    <a href={item?.website} target="_blank" rel="noreferrer">{item?.website}</a>
                  </td>
                  <td className="px-4 py-3">{item?.city}</td>
                  <td className="px-4 py-3">{item?.state}</td>
                  <td className="px-4 py-3">{item?.affilated_to}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${item?.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item?.status}
                    </span>
                  </td>
                  {(canWrite || canDelete) && (
                    <td className="px-4 py-3 flex gap-3">
                      {canWrite && (
                        <button
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>
                      )}
                      {canDelete && (
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDelete(item?._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-4">
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* ================= PAGINATION ================= */}
        <div className="flex justify-between items-center p-4">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}–{Math.min(endIndex, safeColleges.length)}{" "}
            of {safeColleges.length}
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
                <span key={i} className="px-3 h-8 border">…</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`px-3 h-8 border border-gray-300 hover:bg-gray-50 ${currentPage === p ? "bg-blue-50 text-blue-600 font-semibold" : ""}`}
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
    </div>
  );
};

export default CollegeList;
