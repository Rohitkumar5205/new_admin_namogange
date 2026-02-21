import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { showSuccess } from "../../utils/toastService";
import CommonTable from "../../components/CommonTable";
import { getAllSupports } from "../../redux/slices/support/supportSlice";

const columns = [
  {
    key: "name",
    label: "Full Name",
    render: (row) => (
      <Link
        to={`/overview/profile/${row._id}`}
        state={{ data: row, type: "support" }}
        className="text-blue-600 hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  { key: "email", label: "Email Id" },
  { key: "mobile", label: "Mobile No" },
  { key: "supportType", label: "Support Type" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "prefferedContribution", label: "Preferred Contribution" },
];
const SupportList = () => {
  const dispatch = useDispatch();
  const { supports } = useSelector((state) => state.support);
  console.log("support", supports);

  useEffect(() => {
    dispatch(getAllSupports());
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
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex items-center gap-4">
            <div className="flex flex-col text-center">
              <h2 className="text-xl font-semibold text-gray-700 text-center">
                {" "}
                Support List Management
              </h2>
              <p className="text-sm text-blue-100">
                Manage and view all user supports in one place.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-5">
        {/* ================= TABLE ================= */}
        <CommonTable data={supports || []} columns={columns} />
      </div>
    </div>
  );
};

export default SupportList;
