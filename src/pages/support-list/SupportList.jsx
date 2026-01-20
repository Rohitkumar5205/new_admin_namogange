import React from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";

const data = [
  {
    id: 1,
    full_name: "Rahul Verma",
    email: "rahul@example.com",
    mobile: "9876543210",
    dob: "1990-05-15",
    support_type: "Donation",
    address: "123, Green Park",
    city: "New Delhi",
    state: "Delhi",
    preferred_contribution: "Monetary",
  },
  {
    id: 2,
    full_name: "Amit Sharma",
    email: "amit@example.com",
    mobile: "9876543211",
    dob: "1985-08-20",
    support_type: "Volunteer",
    address: "456, Blue Street",
    city: "Mumbai",
    state: "Maharashtra",
    preferred_contribution: "Non-Monetary",
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
  { key: "dob", label: "Date of Birth" },
  { key: "support_type", label: "Support Type" },
  { key: "address", label: "Full Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "preferred_contribution", label: "Preferred Contribution" },
];
const SupportList = () => {
  return (
    <div className=" space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Support List Management
        </h2>
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />
    </div>
  );
};

export default SupportList;
