import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CommonTable from "../../components/CommonTable";
import { getAllVolunteers } from "../../redux/slices/volunteer/volunteerSlice";

const columns = [
  // { key: "applicant_name", label: "Applicant Name" },
  {
    key: "applicant_name",
    label: "Applicant Name",
    render: (row) => (
      <Link
        to={`/volunteer/volunteer-overview/${row._id}`}
        state={{ data: row }}
        className="text-blue-600 hover:underline"
      >
        {row.title} {row.applicantName} {row.surname}
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
const ListVolunteer = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { volunteers, loading } = useSelector((state) => state.volunteer);

  useEffect(() => {
    dispatch(getAllVolunteers());
  }, [dispatch]);

  return (
    <div className=" ">
      {/* ================= HEADER ================= */}
      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10"></div>

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                Lists Volunteer Management
              </h2>
              <p className="text-sm text-blue-100">
                Manage and oversee all volunteer applications and details in one
                place.
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
        <CommonTable
          data={volunteers || []}
          columns={columns}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default ListVolunteer;
