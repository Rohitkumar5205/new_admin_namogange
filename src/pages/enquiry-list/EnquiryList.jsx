import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllEnquiryLists } from "../../redux/slices/enquiry-list/enquiryListSlice";
import CommonTable from "../../components/CommonTable";

const columns = [
  {
    key: "name",
    label: "Full Name",
    render: (row) => (
      <Link to="/dashboard" className="text-blue-600 hover:underline">
        {row.name}
      </Link>
    ),
  },
  { key: "email", label: "Email Id" },
  { key: "mobile", label: "Mobile No" },
  { key: "message", label: "Message" },
];

const EnquiryList = () => {
  const dispatch = useDispatch();
  const { enquiries } = useSelector((state) => state.enquiryList);

  useEffect(() => {
    dispatch(getAllEnquiryLists());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Enquiry List Management
        </h2>
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={enquiries} columns={columns} />
    </div>
  );
};

export default EnquiryList;
