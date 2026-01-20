import React from "react";
import { useNavigate,Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";

const data = [
  {
    id: 1,
    full_name: "Rahul Verma",
    email: "rahul@example.com",
    mobile: "9876543210",
    message: "I want to inquire about membership details.",
  },
  {
    id: 2,
    full_name: "Amit Sharma",
    email: "amit@example.com",
    mobile: "9876543211",
    message: "How can I donate to the trust?",
  },
  {
    id: 3,
    full_name: "Neha Verma",
    email: "neha@example.com",
    mobile: "9876543212",
    message: "I'm interested in volunteering for the trust.",
  },
  {
    id: 4,
    full_name: "Suresh Singh",
    email: "suresh@example.com",
    mobile: "9876543213",
    message: "I want to learn more about the trust's mission.",
  },
  {
    id: 5,
    full_name: "Rohit Kumar",
    email: "rohit@example.com",
    mobile: "9876543214",
    message: "I'm interested in becoming a member of the trust.",
  },
  {
    id: 6,
    full_name: "Amit Sharma",
    email: "amit@example.com",
    mobile: "9876543215",
    message: "I'm interested in volunteering for the trust.",
  },
];
const columns = [
  {
    key: "full_name",
    label: "Full Name",
    render: (row) => (
      <Link to="/#" className="text-blue-600 hover:underline">
        {row.full_name}
      </Link>
    ),
  },
  { key: "email", label: "Email Id" },
  { key: "mobile", label: "Mobile No" },
  { key: "message", label: "Message" },
];
const EnquiryList = () => {
  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Enquiry List Management
        </h2>

        {/* <button
          onClick={() => navigate("/collage/add-college")}
          className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
        >
          {" "}
          Add College
        </button> */}
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />
    </div>
  );
};

export default EnquiryList;
