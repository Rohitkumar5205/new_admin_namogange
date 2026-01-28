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
      <Link to="/dashboard" className="text-blue-600 hover:underline">
        {row.name}
      </Link>
    ),
  },
  { key: "email", label: "Email Id" },
  { key: "mobile", label: "Mobile No" },
  { key: "dob", label: "Date of Birth" },
  { key: "supportType", label: "Support Type" },
  { key: "fullAddress", label: "Full Address" },
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
    <div className=" space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Support List Management
        </h2>
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={supports || []} columns={columns} />
    </div>
  );
};

export default SupportList;
