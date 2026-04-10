import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllDonations, deleteDonation } from "../../redux/slices/donation/donationSlice";
import { showSuccess, showError } from "../../utils/toastService";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const DonationList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { donations, loading } = useSelector((state) => state.donation);
  const { canWrite, canDelete } = useRoleRights(PageNames.DONATION_LIST || "DonationList");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    dispatch(getAllDonations());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      const user = JSON.parse(sessionStorage.getItem("user"));
      dispatch(deleteDonation({ id, user_id: user?._id }))
        .unwrap()
        .then(() => {
          showSuccess("Donation deleted successfully");
        })
        .catch((err) => {
          showError("Error deleting donation: " + err);
        });
    }
  };

  /* ===== PAGINATION LOGIC ===== */
  const totalPages = Math.ceil(donations?.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = donations?.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="">
      {/* HEADER */}
      <div className="relative overflow-hidden shadow-sm border border-gray-200 h-25 bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-white">Donation List</h2>
              <p className="text-sm text-blue-100">View and manage donation records.</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate("/donation/add-donation")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              Add Donation
            </button>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 font-medium">S.No</th>
                <th className="px-4 py-3 font-medium">Full Name</th>
                <th className="px-4 py-3 font-medium">Email / Phone</th>
                <th className="px-4 py-3 font-medium">Sewa Type</th>
                <th className="px-4 py-3 font-medium">Package</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">PAN</th>
                <th className="px-4 py-3 font-medium">Anonymous</th>
                <th className="px-4 py-3 font-medium">Added On</th>
                {(canWrite || canDelete) && <th className="px-4 py-3 font-medium">Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="10" className="text-center py-4">Loading...</td></tr>
              ) : currentData?.length === 0 ? (
                <tr><td colSpan="10" className="text-center py-4">No donations found.</td></tr>
              ) : (
                currentData?.map((item, index) => (
                  <tr key={item._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 font-medium">{item.fullName}</td>
                    <td className="px-4 py-3">
                      <div>{item.email}</div>
                      <div className="text-xs text-gray-400">{item.phone}</div>
                    </td>
                    <td className="px-4 py-3">{item.SewaType}</td>
                    <td className="px-4 py-3">{item.donationPackage}</td>
                    <td className="px-4 py-3 font-semibold text-green-600">₹{item.amount}</td>
                    <td className="px-4 py-3">{item.pan || "N/A"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] ${item.anonymous ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {item.anonymous ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">{new Date(item.createdAt).toLocaleDateString()}</td>
                    {(canWrite || canDelete) && (
                      <td className="px-4 py-3 flex gap-3">
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4">
              <span className="text-xs text-gray-500">
                Showing {startIndex + 1}–{Math.min(startIndex + itemsPerPage, donations.length)} of {donations.length}
              </span>
              <div className="flex gap-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="px-3 py-1 border rounded text-xs disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationList;
