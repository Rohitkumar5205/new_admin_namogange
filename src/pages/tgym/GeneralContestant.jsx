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
  { key: "mobile", label: "Mobile No" },
  { key: "profession", label: "Profession" },
  { key: "enquiry_for", label: "Enquiry For" },
  { key: "source", label: "Source" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "status", label: "Status" },
  { key: "user_name", label: "User" },
  { key: "updated", label: "Updated Details" },
];

const data = [
  {
    id: 1,
    name: "Rahul Verma",
    mobile: "9876543210",
    profession: "Service",
    enquiry_for: "Singing",
    source: "Facebook",
    city: "Lucknow",
    state: "Uttar Pradesh",
    status: "Active",
    user_name: "Admin",
    updated: "12 Jan 2025",
  },
  {
    id: 2,
    name: "Amit Sharma",
    mobile: "9876543211",
    profession: "Business",
    enquiry_for: "Dancing",
    source: "Instagram",
    city: "Gurgaon",
    state: "Haryana",
    status: "Pending",
    user_name: "Coordinator",
    updated: "15 Jan 2025",
  },
  {
    id: 3,
    name: "Ravi Kumar",
    mobile: "9876543212",
    profession: "Student",
    enquiry_for: "Acting",
    source: "Website",
    city: "Delhi",
    state: "Delhi",
    status: "Inactive",
    user_name: "Admin",
    updated: "18 Jan 2025",
  },
];

const GeneralContestant = () => {
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
            General Contestants
          </h2>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => navigate("/tgym/add-contestant")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded"
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

export default GeneralContestant;
