import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";

const columns = [
  {
    key: "delegate",
    label: "Delegate Details",
    render: (row) => (
      <Link to="/16th-ags-section/ags-overview" className="text-blue-600 hover:underline">
        {row.delegate}
      </Link>
    ),
  },
  { key: "category", label: "Category" },
  { key: "registration", label: "Registration For" },
  { key: "association", label: "Association" },
  { key: "mobile", label: "Mobile No" },
  { key: "registration", label: "Registration Details" },
  { key: "OrganizationInstitution", label: "Organization/Institution" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "updated", label: "Updated Details" },
];

const data = [
  {
    id: 1,
    delegate: "Rahul Verma",
    category: "Donation",
    registration: "Donation",
    association: "Donation",
    mobile: "9876543210",
    registration: "Donation",
    OrganizationInstitution: "Donation",
    city: "Lucknow",
    state: "Uttar Pradesh",
    updated: "Updated Details",
  },
  {
    id: 2,
    delegate: "Amit Sharma",
    category: "Volunteer",
    registration: "Volunteer",
    association: "Volunteer",
    mobile: "9876543211",
    registration: "Volunteer",
    OrganizationInstitution: "Volunteer",
    city: "Gurgaon",
    state: "Haryana",
    updated: "Updated Details",
  },
];

const NewData = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    description: "",
    image: null,
    document: null,
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
    <div className=" ">
      {/* ================= HEADER ================= */}
     
       <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-white/10">

        {/* Content */}
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex  gap-3">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
                Web Registration Management
              </h2>
             
            </div>
          </div>
         <div className="flex gap-1">
          <button
              onClick={() => navigate("/16th-ags-section/ags-add-data")}
           className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded">
            ADD NEW DATA
          </button>
          <button
              onClick={() => navigate("/16th-ags-section/web-enquiry")}
           className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded">
            WEB REGISTRATION
          </button>
       
          <button
              onClick={() => navigate("/16th-ags-section/warm-data")}
           className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded">
            WARM DATA
          </button>
          <button
              onClick={() => navigate("/16th-ags-section/hot-data")}
           className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded">
            HOT DATA
          </button>
          <button
              onClick={() => navigate("/16th-ags-section/delegate-list")}
           className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded">
           CONFIRM DATA
          </button>
          <button
              onClick={() => navigate("/16th-ags-section/master-delegate-data")}
           className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-2 rounded">
            MASTER DATA
          </button>
        </div>
        </div>
      </div>
      </div>

<div className="space-y-3 p-5">
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
          {/* <div className="md:col-span-3 "> */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="document"
              onChange={handleFileChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-1 flex justify-end gap-6 mt-7">
            <button
              type="submit"
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              POST
            </button>
          </div>
          {/* </div> */}
        </form>
      </div>
      </div>
    </div>
  );
};

export default NewData;
