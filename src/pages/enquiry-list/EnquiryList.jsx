import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAllEnquiryLists } from "../../redux/slices/enquiry-list/enquiryListSlice";
import CommonTable from "../../components/CommonTable";
import adminBanner from "../../assets/banners/bg.jpg";

const columns = [
  {
    key: "name",
    label: "Full Name",
    render: (row) => (
      <Link
        to={`/overview/profile/${row._id}`}
        state={{ data: row, type: "enquiry" }}
        className="text-blue-600 hover:underline"
      >
        {row.name}
      </Link>
    ),
  },
  { key: "email", label: "Email Id" },
  { key: "mobile", label: "Mobile No" },
  { key: "message", label: "Message" },
];

const EnquiryList = () => {
  const dispatch = useDispatch();
  const { enquiries } = useSelector((state) => state.enquiryList);

  useEffect(() => {
    dispatch(getAllEnquiryLists());
  }, [dispatch]);

  return (
    <div className="">
      {/* ================= HEADER ================= */}
        <div
              className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-white/10"></div>
      
              {/* Content */}
              <div className="relative flex justify-center items-center px-6 py-4 h-25">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col ">
                    <h2 className="text-xl font-semibold text-center text-white ">
                     Enquiry List Management
                    </h2>
                    <p className="text-sm text-blue-100">
                      Manage and view all user enquiries in one place.
                    </p>
                  </div>
                </div>
               
              </div>
            </div>

      {/* ================= TABLE ================= */}
       <div className="space-y-3 p-5">
      <CommonTable data={enquiries} columns={columns} />
      </div>
    </div>
  );
};

export default EnquiryList;
