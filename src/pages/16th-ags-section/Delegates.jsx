import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
import { Editor } from "primereact/editor";

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

const Delegates = () => {
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
    <div className=" space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <div>
          <h2 className="text-lg font-medium text-gray-800">Delegates Data</h2>
        </div>
        <div className="flex gap-2">
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            ADD NEW DATA
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            WEB REGISTRATION
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            NEW DATA
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            WARM DATA
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            HOT DATA
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            COLD DATA
          </button>
          <button className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded">
            MASTER DATA
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />

      {/* form  */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
        >
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>

            <Editor
              value={formData.description}
              name="description"
              required
              onTextChange={(e) =>
                setFormData({ ...formData, description: e.htmlValue })
              }
              style={{
                height: "150px",
                borderRadius: "4px", // rounded
                borderBottom: "1px solid #e5e7eb", // border-gray-200
                overflow: "hidden", // corners properly clip ho
              }}
              className="w-full text-sm outline-none"
            />
          </div>
          {/* <div className="md:col-span-2 "> */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {/* </div> */}
          <div className="md:col-span-3 flex justify-end gap-6 mt-2">
            <button
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              RESEND TICKET
            </button>
            <button
              type="submit"
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              SEND
            </button>
            <button
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              WHATSAPP HISTORY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Delegates;
