import React from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const data = [
  {
    id: 1,
    applicant_name: "Rahul Verma",
    mobile: "9876543210",
    email: "rahul@example.com",
    occupation: "Service",
    designation: "Manager",
    city: "Lucknow",
    state: "Uttar Pradesh",
  },
  {
    id: 2,
    applicant_name: "Amit Sharma",
    mobile: "9876543211",
    email: "amit@example.com",
    occupation: "Business",
    designation: "Director",
    city: "Gurgaon",
    state: "Haryana",
  },
];
const columns = [
  {
    key: "applicant_name",
    label: "Applicant Name",
    render: (row) => (
      <Link to="/#" className="text-blue-600 hover:underline">
        {row.applicant_name}
      </Link>
    ),
  },
  { key: "mobile", label: "Mobile No" },
  { key: "email", label: "Email ID" },
  { key: "occupation", label: "Occupation" },
  { key: "designation", label: "Designation" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
];
const ListMember = () => {
  const navigate = useNavigate();
  const { canRead: canAdd } = useRoleRights(PageNames.MEMBERS);

  return (
    <div className=" space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Member List Management
        </h2>
        {canAdd && (
          <button
            onClick={() => navigate("/member/add-member")}
            className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
          >
            Add Member
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />
    </div>
  );
};

export default ListMember;
