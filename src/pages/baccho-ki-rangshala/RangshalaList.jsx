// import React from "react";

// const RangshalaList = () => {
//   return (
//     <div>
//       <h2> Rangshala List Page</h2>
//     </div>
//   );
// };

// export default RangshalaList;

import React from "react";
import { useNavigate } from "react-router-dom";
import CommonTable from "../../components/CommonTable";
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
const columns = [
  { key: "college_name", label: "College Name" },
  { key: "category", label: "Category" },
  { key: "website", label: "Website" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "affilated_to", label: "Affiliated To" },
  { key: "status", label: "Status" },
];
const RangshalaList = () => {
  const navigate = useNavigate();
  const { canRead: canAdd, canWrite, canDelete } = useRoleRights(PageNames.ADD_RANGSHALA);

  return (
    <div className="">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Rangshala List Management
        </h2>

        {canAdd && (
          <button
            onClick={() => navigate("/baccho-ki-rangshala/add-rangshala")}
            className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
          >
            {" "}
            Add Rangshala
          </button>
        )}
      </div>

      {/* ================= TABLE ================= */}
      <CommonTable data={data} columns={columns} />
    </div>
  );
};

export default RangshalaList;
