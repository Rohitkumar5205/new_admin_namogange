import React from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";

const data = [
  {
    id: 1,
    applicant_name: "Mr. Rahul Verma",
    mobile: "9876543210",
    email: "rahul@example.com",
    occupation: "Service",
    organisation_type: "Private",
    designation: "Manager",
    city: "Lucknow",
    state: "Uttar Pradesh",
  },
  {
    id: 2,
    applicant_name: "Mr. Amit Kumar",
    mobile: "9876543211",
    email: "amit@example.com",
    occupation: "Business",
    organisation_type: "Private",
    designation: "Director",
    city: "Gurgaon",
    state: "Haryana",
  },
];
const columns = [
  // { key: "applicant_name", label: "Applicant Name" },
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
  { key: "organisation_type", label: "Organisation Type" },
  { key: "designation", label: "Designation" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
];
const ListVolunteer = () => {
  const navigate = useNavigate();

  return (
    <div className=" ">
      {/* ================= HEADER ================= */}
        <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex items-center gap-3">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                Lists Volunteer Management
              </h2>
              <p className="text-sm text-blue-100">
                Manage and oversee all volunteer applications and details in one place.
              </p>
            </div>
          </div>
          {/* {canAdd && ( */}
            <div>
              <button
                onClick={() => navigate("/volunteer/add-volunteer")}
                className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
              >
                {" "}
                Add Volunteer
              </button>
            </div>
           {/* )} */}
        </div>
      </div>
 <div className="space-y-3 p-5">
      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />
      </div>
    </div>
  );
};

export default ListVolunteer;
