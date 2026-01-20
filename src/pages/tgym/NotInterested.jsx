// export default NotInterested

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";

const columns = [
  {
    key: "name",
    label: "Contestant Name",
    render: (row) => (
      <Link to="/tgym/tgym-overview" className="text-blue-600 hover:underline">
        {row.name}
      </Link>
    ),
  },
  { key: "reg_no", label: "Reg No" },
  { key: "mobile", label: "Mobile No" },
  { key: "profession", label: "Profession" },
  { key: "gender", label: "Gender" },
  { key: "contest", label: "Contest" },
  { key: "enquiry_name", label: "Event" },
  { key: "Event", label: "Event" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "user_name", label: "User" },
  { key: "contestant_state", label: "Contestant Status" },
  { key: "Receipt No", label: "Receipt No" },
  { key: "fees", label: "Fees" },
  { key: "updated", label: "Updated Details" },
];

const data = [
  {
    id: 1,
    name: "Rahul Verma",
    reg_no: "Donation",
    mobile: "9876543210",
    profession: "Service",
    gender: "Donation",
    contest: "Donation",
    enquiry_name: "Donation",
    Event: "Donation",
    city: "Lucknow",
    state: "Uttar Pradesh",
    user_name: "Donation",
    contestant_state: "Donation",
    Receipt_No: "Donation",
    fees: "Donation",
    updated: "Donation",
  },
];

const NotInterested = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Data submitted successfully!");
    setFormData({ description: "", image: null, document: null });
    // Reset file inputs visually
    e.target.reset();
  };
  return (
    <div className=" space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Not Interested Contestants
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => navigate("/tgym/add-contestant")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            ADD CONTESTANTS DATA
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />

      {/* form  */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
        >
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message <span className="text-red-500">*</span>
            </label>

            <textarea
              value={formData.description}
              name="description"
              placeholder="Enter your message here..."
              required
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              style={{ height: "100px" }}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-3 flex justify-end gap-6 ">
            <button
              type="submit"
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              POST
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotInterested;
