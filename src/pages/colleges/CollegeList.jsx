import React from "react";
import { useNavigate } from "react-router-dom";
// import CommonTable from "../../components/CommonTable";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const data = [
  {
    id: 1,
    college_name: "IIT Delhi",
    category: "Education",
    website: "https://home.iitd.ac.in/",
    address: "Hauz Khas",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110016",
    affilated_to: "Ministry of Education",
    status: "Active",
  },
  {
    id: 2,
    college_name: "Banaras Hindu University",
    category: "Education",
    website: "https://www.bhu.ac.in/",
    address: "Varanasi",
    country: "India",
    state: "Uttar Pradesh",
    city: "Varanasi",
    pincode: "221005",
    affilated_to: "UGC",
    status: "Active",
  },
  {
    id: 3,
    college_name: "Jawaharlal Nehru University",
    category: "Education",
    website: "https://www.jnu.ac.in/",
    address: "New Delhi",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110016",
    affilated_to: "Ministry of Education",
    status: "Active",
  },
  {
    id: 4,
    college_name: "Jawaharlal Nehru University",
    category: "Education",
    website: "https://www.jnu.ac.in/",
    address: "New Delhi",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110016",
    affilated_to: "Ministry of Education",
    status: "Active",
  },
  {
    id: 5,
    college_name: "Jawaharlal Nehru University",
    category: "Education",
    website: "https://www.jnu.ac.in/",
    address: "New Delhi",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110016",
    affilated_to: "Ministry of Education",
    status: "Active",
  },
  {
    id: 6,
    college_name: "Jawaharlal Nehru University",
    category: "Education",
    website: "https://www.jnu.ac.in/",
    address: "New Delhi",
    country: "India",
    state: "Delhi",
    city: "New Delhi",
    pincode: "110016",
    affilated_to: "Ministry of Education",
    status: "Active",
  },
];
// const columns = [
//   { key: "college_name", label: "College Name" },
//   { key: "category", label: "Category" },
//   { key: "website", label: "Website" },
//   { key: "city", label: "City" },
//   { key: "state", label: "State" },
//   { key: "affilated_to", label: "Affiliated To" },
//   { key: "status", label: "Status" },
// ];
const CollegeList = () => {
  const navigate = useNavigate();
  const { canRead: canAdd, canWrite, canDelete } = useRoleRights(PageNames.ADD_COLLEGE);

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          College List Management
        </h2>

        {canAdd && (
          <button
            onClick={() => navigate("/collage/add-college")}
            className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
          >
            {" "}
            Add College
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">College Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Website</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">State</th>
              <th className="px-4 py-3">Affiliated To</th>
              <th className="px-4 py-3">Status</th>
              {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3">{index + 1}.</td>
                <td className="px-4 py-3 font-medium">{item.college_name}</td>
                <td className="px-4 py-3">{item.category}</td>
                <td className="px-4 py-3 text-blue-500">
                  <a href={item.website} target="_blank" rel="noreferrer">{item.website}</a>
                </td>
                <td className="px-4 py-3">{item.city}</td>
                <td className="px-4 py-3">{item.state}</td>
                <td className="px-4 py-3">{item.affilated_to}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {item.status}
                  </span>
                </td>
                {(canWrite || canDelete) && (
                  <td className="px-4 py-3 flex gap-3">
                    {canWrite && (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => navigate("/collage/add-college", { state: { id: item.id } })}
                      >
                        Edit
                      </button>
                    )}
                    {canDelete && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => alert("Delete functionality not implemented for mock data")}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CollegeList;
