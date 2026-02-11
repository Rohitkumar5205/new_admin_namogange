import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllMembers } from "../../redux/slices/membership/memberSlice";
import CommonTable from "../../components/CommonTable";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const columns = [
  {
    key: "applicantName",
    label: "Applicant Name",
    render: (row) => (
      <Link
        to={`/member/member-overview/${row._id}`}
        state={{ data: row }}
        className="text-blue-600 hover:underline"
      >
        {row.applicantName || row.applicant_name} {row.surname}
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
  const dispatch = useDispatch();
  const { members } = useSelector((state) => state.member);
  const { canRead: canAdd } = useRoleRights(PageNames.ADD_MEMBER);

  useEffect(() => {
    dispatch(getAllMembers());
  }, [dispatch]);

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
          <div className="flex items-center gap-4">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                 Member Management Lists
              </h2>
              <p className="text-sm text-blue-100">
                  Manage and view all members in one place.
              </p>
            </div>
          </div>
          {canAdd && (
            <div>
              <button
                onClick={() => navigate("/member/add-member")}
                className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
              >
                {" "}
                Add Member
              </button>
            </div>
          )}
        </div>
      </div>
      
<div className="space-y-3 p-5">
      {/* ================= TABLE ================= */}
      <CommonTable data={members || []} columns={columns} />
      </div>
    </div>
  );
};

export default ListMember;
