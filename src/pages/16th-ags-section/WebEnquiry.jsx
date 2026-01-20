import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
import { Editor } from "primereact/editor";

const data = [
  {
    id: 1,
    delegate_name: "Rahul Verma",
    mobile: "9876543210",
    profession: "Service",
    category: "Donation",
    college: "ABC College",
    source: "Social Media",
    event: "Deal For|Event",
    status: "Pending",
    city: "Lucknow",
    state: "Uttar Pradesh",
    updated: "Updated Details",
  },
  {
    id: 2,
    delegate_name: "Amit Sharma",
    mobile: "9876543211",
    profession: "Business",
    category: "Volunteer",
    college: "XYZ College",
    source: "Website",
    event: "Deal For|Event",
    status: "Pending",
    city: "Gurgaon",
    state: "Haryana",
    updated: "Updated Details",
  },
  {
    id: 3,
    delegate_name: "Ravi Kumar",
    mobile: "9876543212",
    profession: "Service",
    category: "Donation",
    college: "PQR College",
    source: "Social Media",
    event: "Deal For|Event",
    status: "Pending",
    city: "Delhi",
    state: "Delhi",
    updated: "Updated Details",
  },
  {
    id: 4,
    delegate_name: "Amit Kumar",
    mobile: "9876543213",
    profession: "Business",
    category: "Volunteer",
    college: "XYZ College",
    source: "Website",
    event: "Deal For|Event",
    status: "Pending",
    city: "Mumbai",
    state: "Maharashtra",
    updated: "Updated Details",
  },
  {
    id: 5,
    delegate_name: "Ravi Kumar",
    mobile: "9876543214",
    profession: "Service",
    category: "Donation",
    college: "PQR College",
    source: "Social Media",
    event: "Deal For|Event",
    status: "Pending",
    city: "Delhi",
    state: "Delhi",
    updated: "Updated Details",
  },
  {
    id: 6,
    delegate_name: "Amit Kumar",
    mobile: "9876543215",
    profession: "Business",
    category: "Volunteer",
    college: "XYZ College",
    source: "Website",
    event: "Deal For|Event",
    status: "Pending",
    city: "Mumbai",
    state: "Maharashtra",
    updated: "Updated Details",
  },
];
const columns = [
  {
    key: "delegate_name",
    label: "Delegate Name",
    render: (row) => (
      <Link
        to="/16th-ags-section/ags-overview"
        className="text-blue-600 hover:underline"
      >
        {row.delegate_name}
      </Link>
    ),
  },
  { key: "mobile", label: "Mobile No" },
  { key: "profession", label: "Profession" },
  { key: "category", label: "Category" },
  { key: "college", label: "College" },
  { key: "source", label: "Source" },
  { key: "event", label: "Deal For|Event" },
  { key: "status", label: "Status" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "updated", label: "Updated Details" },
];
const SupportList = () => {
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
    <div className=" space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Web Enquire Management
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/16th-ags-section/ags-add-data")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            ADD NEW DATA
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
            CONFIRM DELEGATES
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

          <div className="md:col-span-1 flex justify-end gap-6 mt-7">
            <button
              type="submit"
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              SEND
            </button>
            <button
              // type="submit"
              className="px-4 py-1 text-sm rounded text-white 
                 bg-blue-400 hover:bg-blue-500"
            >
              WHATSAPP HISTORY
            </button>
          </div>
          {/* </div> */}
        </form>
      </div>
    </div>
  );
};

export default SupportList;
