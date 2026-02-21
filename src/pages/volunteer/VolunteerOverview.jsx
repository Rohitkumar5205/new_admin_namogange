import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { FaWhatsapp, FaPrint, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import { getVolunteerById } from "../../redux/slices/volunteer/volunteerSlice";

const VolunteerOverview = () => {
  const forwordOpt = [
    "15th Edition Arogya Sangoshthi",
    "2nd Namo Gange Global Health Excellence Award",
  ];

  const statusOpt = [
    "Sent Details",
    "Follow-up Call",
    "Warm Client",
    "Est./PI Sent",
    "Adv. Recd",
    "Inv. Req.",
    "Visitor Pass Sent",
    "Not Interested",
    "Company Not Available",
    "Wrong Data",
    "Under PYMT Followups",
    "Reminder Reschedule",
  ];

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const imageRef = useRef(null);
  const documentRef = useRef(null);
  const [history, setHistory] = useState([]);

  const [formData, setFormData] = useState({
    message: "",
    image: null,
    document: null,
  });
  const [model, setModel] = useState(false);
  const menuRef = useRef();

  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { singleVolunteer } = useSelector((state) => state.volunteer);
  const printRef1 = useRef();

  const { data } = location.state || {};
  const selectedRows = data || singleVolunteer;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setModel(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newHistory = {
      user: "Admin",
      message: formData.message,
      image: formData.image ? formData.image.name : "",
      document: formData.document ? formData.document.name : "",
      time: new Date().toLocaleString(),
    };
    setHistory((prev) => [...prev, newHistory]);
    setFormData({ message: "", image: null, document: null });
    if (imageRef.current) imageRef.current.value = null;
    if (documentRef.current) documentRef.current.value = null;
    setModel(false);
  };

  useEffect(() => {
    if (!data && id) {
      dispatch(getVolunteerById(id));
    }
  }, [data, id, dispatch]);

  const handlePrint1 = useReactToPrint({
    content: () => printRef1.current,
  });

  const inpStyle =
    "w-full px-2 py-1.5 text-xs rounded font-semibold border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none";

  return (
    <>
      <div className="w-full h-auto ">
        {/* Header */}

        <div
          className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/10"></div>

          {/* Content */}
          <div className="relative flex justify-center items-center px-6 py-4 h-25">
            <div className="flex items-center gap-4">
              <div className="flex flex-col ">
                <h2 className="text-xl font-semibold text-center text-white ">
                  Volunteer Overview & Profile Management
                </h2>
                <p className="text-sm text-blue-100">
                  View and manage detailed volunteer profiles, activities, and
                  interactions in one place.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col p-5 space-y-3">
          {/* Client Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                {selectedRows?.profilePic || selectedRows?.profile_image ? (
                  <img
                    src={
                      selectedRows?.profilePic || selectedRows?.profile_image
                    }
                    alt="profile"
                    className="w-20 h-20 rounded-full mr-4 object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-24 h-24 text-gray-400 mr-4" />
                )}
                <h2 className="text-lg font-semibold text-gray-600">
                  {selectedRows?.title}{" "}
                  {selectedRows?.applicantName || selectedRows?.applicant_name}{" "}
                  {selectedRows?.surname} Information
                </h2>
              </div>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => navigate("/#")}
                  className="px-3 py-1 text-sm rounded text-gray-700 bg-white hover:bg-gray-300 border border-gray-300 cursor-pointer"
                >
                  Account
                </button>
                <button
                  onClick={() => navigate("/#")}
                  className="flex items-center justify-center px-2.5 py-1.5 rounded border border-gray-300 hover:bg-gray-100"
                >
                  <FaPencilAlt className="w-3 h-3" color="gray" />
                </button>
                <button
                  onClick={handlePrint1}
                  className="bg-white px-2.5 py-1.5 text-xs rounded cursor-pointer border border-gray-300 hover:bg-gray-100"
                >
                  <FaPrint color="gray" />
                </button>
              </div>
            </div>

            <hr className="w-full opacity-5 mb-3" />

            {/* table */}
            <div ref={printRef1} className="print:p-4 ">
              <table className="w-full whitespace-nowrap ">
                {/* First Contact */}
                <tbody>
                  <tr>
                    <th
                      colSpan={6}
                      className="bg-gray-300 px-2 py-1 text-[#3598dc] text-left"
                    >
                      Volunteer Personal Information
                    </th>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Volunteer ID</th>
                    <td className="px-2 py-2 ">{selectedRows?._id}</td>

                    <th className="px-2 text-left py-2">Volunteer Name</th>
                    <td className="px-2 py-2">
                      {" "}
                      {selectedRows?.title}{" "}
                      {selectedRows?.applicantName ||
                        selectedRows?.applicant_name}{" "}
                      {selectedRows?.surname}
                    </td>

                    <th className="px-2 text-left py-2">Gender </th>
                    <td className="px-2 py-2">{selectedRows?.gender}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Occupation</th>
                    <td className="px-2 py-2">{selectedRows?.occupation}</td>

                    <th className="px-2 text-left py-2">Designation</th>
                    <td className="px-2 py-2">{selectedRows?.designation}</td>

                    <th className="px-2 text-left py-2">Org Type</th>
                    <td className="px-2 py-2">
                      {selectedRows?.organisationType ||
                        selectedRows?.organisation_type}
                    </td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Email Address</th>
                    <td className="px-2 py-2">{selectedRows?.email}</td>

                    <th className="px-2 text-left py-2">Mobile No.</th>
                    <td className="px-2 py-2">{selectedRows?.mobile}</td>

                    <th className="px-2 text-left py-2">
                      Alternate Mobile No.{" "}
                    </th>
                    <td className="px-2 py-2">
                      {selectedRows?.alternateMobile ||
                        selectedRows?.alternate_mobile}
                    </td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Address</th>
                    <td className="px-2 py-2">{selectedRows?.address}</td>

                    <th className="px-2 text-left py-2">Country </th>
                    <td className="px-2 py-2">{selectedRows?.country}</td>

                    <th className="px-2 text-left py-2">State</th>
                    <td className="px-2 py-2">{selectedRows?.state}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">City</th>
                    <td className="px-2 py-2">{selectedRows?.city}</td>

                    <th className="px-2 text-left py-2">Pincode</th>
                    <td className="px-2 py-2">{selectedRows?.pincode}</td>

                    <th className="px-2 text-left py-2">Qualification</th>
                    <td className="px-2 py-2">{selectedRows?.qualification}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Father's Name</th>
                    <td className="px-2 py-2">
                      {selectedRows?.fatherName || selectedRows?.father_name}
                    </td>

                    <th className="px-2 text-left py-2">Date of Birth</th>
                    <td className="px-2 py-2">
                      {selectedRows?.dob
                        ? new Date(selectedRows.dob).toLocaleDateString()
                        : "N/A"}
                    </td>

                    <th className="px-2 text-left py-2">Aadhaar</th>
                    <td className="px-2 py-2">{selectedRows?.aadhaar}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Emergency Relation</th>
                    <td className="px-2 py-2">
                      {selectedRows?.emergencyRelation ||
                        selectedRows?.emergency_relation}
                    </td>

                    <th className="px-2 text-left py-2">Emergency Contact</th>
                    <td className="px-2 py-2">
                      {selectedRows?.emergencyContact ||
                        selectedRows?.emergency_contact}
                    </td>
                    <th className="px-2 text-left py-2"></th>
                    <td className="px-2 py-2"></td>
                  </tr>
                </tbody>

                {/*Source Coordinator Detail */}
                <tbody>
                  <tr>
                    <th
                      colSpan={6}
                      className="bg-gray-300 px-2 py-1 text-[#3598dc] text-left"
                    >
                      References & Other Details
                    </th>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Reference 1</th>
                    <td className="px-2 py-2">
                      {selectedRows?.reference1?.name ||
                        selectedRows?.ref1_name}{" "}
                      (
                      {selectedRows?.reference1?.mobile ||
                        selectedRows?.ref1_mobile}
                      )
                    </td>

                    <th className="px-2 py-2">Reference 2</th>
                    <td className="px-2 py-2">
                      {selectedRows?.reference2?.name ||
                        selectedRows?.ref2_name}{" "}
                      (
                      {selectedRows?.reference2?.mobile ||
                        selectedRows?.ref2_mobile}
                      )
                    </td>

                    <th className="px-2 py-2">Volunteering For</th>
                    <td className="px-2 py-2">
                      {selectedRows?.volunteeringFor ||
                        selectedRows?.volunteering_for}
                    </td>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Initiatives</th>
                    <td className="px-2 py-2" colSpan={5}>
                      {selectedRows?.initiatives?.join(", ")}
                    </td>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Networking For</th>
                    <td className="px-2 py-2">
                      {selectedRows?.networkingFor ||
                        selectedRows?.networking_for}
                    </td>

                    <th className="px-2 py-2">Area Of Interest</th>
                    <td className="px-2 py-2">
                      {selectedRows?.areaOfInterest ||
                        selectedRows?.area_of_interest}
                    </td>

                    <th className="px-2 py-2">Monetary Support</th>
                    <td className="px-2 py-2">
                      {selectedRows?.monetarySupport ||
                        selectedRows?.monetary_support}
                    </td>
                  </tr>
                </tbody>

                {/* Volunteer Information & Bank Details */}
                <tbody>
                  <tr>
                    <th
                      colSpan={6}
                      className="bg-gray-300 px-2 py-1 text-[#3598dc] text-left"
                    >
                      Volunteer Information & Bank Details
                    </th>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Area Of Region</th>
                    <td className="px-2 py-2">
                      {selectedRows?.areaOfRegion ||
                        selectedRows?.area_of_region}
                    </td>
                    <th className="px-2 py-2">Report To</th>
                    <td className="px-2 py-2">
                      {selectedRows?.reportTo || selectedRows?.report_to}
                    </td>
                    <th className="px-2 py-2">Volunteer Designation</th>
                    <td className="px-2 py-2">
                      {selectedRows?.volunteerDesignation ||
                        selectedRows?.volunteer_designation}
                    </td>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Bank Name</th>
                    <td className="px-2 py-2">
                      {selectedRows?.bankName || selectedRows?.bank_name}
                    </td>
                    <th className="px-2 py-2">Account No</th>
                    <td className="px-2 py-2">
                      {selectedRows?.accountNo || selectedRows?.account_no}
                    </td>
                    <th className="px-2 py-2">IFSC Code</th>
                    <td className="px-2 py-2">
                      {selectedRows?.ifscCode || selectedRows?.ifsc_code}
                    </td>
                  </tr>
                </tbody>

                {/* Volunteer Business Details */}
                <tbody>
                  <tr>
                    <th
                      colSpan={6}
                      className="bg-gray-300 px-2 py-1 text-[#3598dc] text-left"
                    >
                      Volunteer Business Details
                    </th>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Company Name</th>
                    <td className="px-2 py-2">
                      {selectedRows?.companyName || selectedRows?.company_name}
                    </td>
                    <th className="px-2 py-2">Business Address</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessAddress ||
                        selectedRows?.business_address}
                    </td>
                    <th className="px-2 py-2">Business Country</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessCountry ||
                        selectedRows?.business_country}
                    </td>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Business State</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessState ||
                        selectedRows?.business_state}
                    </td>
                    <th className="px-2 py-2">Business City</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessCity ||
                        selectedRows?.business_city}
                    </td>
                    <th className="px-2 py-2">Business Pincode</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessPincode ||
                        selectedRows?.business_pincode}
                    </td>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Business Designation</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessDesignation ||
                        selectedRows?.business_designation}
                    </td>
                    <th className="px-2 py-2">Business Contact No</th>
                    <td className="px-2 py-2">
                      {selectedRows?.businessContactNo ||
                        selectedRows?.business_contact_no}
                    </td>
                    <th className="px-2 py-2"></th>
                    <td className="px-2 py-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Review Form */}
          {showReviewForm && (
            <form className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2">
                <div className="">
                  <label className="text-sm font-medium text-gray-800 block mb-1">
                    Status
                  </label>
                  <select
                    className={inpStyle}
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option>Select Status</option>
                    {statusOpt.map((value, index) => (
                      <option key={index}>{value}</option>
                    ))}
                  </select>
                </div>

                {selectedStatus !== "" &&
                  selectedStatus !== "Not Interested" && (
                    <>
                      <div className="space-x-3">
                        <label className="text-sm font-medium text-gray-800 block mb-1">
                          Reminder Date & Time{" "}
                          <span className="text-red-500 mt-1">*</span>
                        </label>
                        <input
                          type="datetime-local"
                          name=""
                          id=""
                          className={inpStyle}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-800 block mb-1">
                          Forward To{" "}
                          <span className="text-red-500 mt-1">*</span>
                        </label>
                        <select
                          name=""
                          className="w-full px-2 py-1.5 rounded text-xs font-semibold border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                        >
                          <option value="">Select Here</option>
                          {forwordOpt.map((value, index) => (
                            <option key={index} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}

                <div>
                  <label className="text-sm font-medium text-gray-800 block mb-1">
                    Previous Status
                  </label>
                  <input
                    type="text"
                    name=""
                    id=""
                    className="w-full px-2 py-1.5 text-xs font-semibold 
              border border-gray-300 focus:ring-1
               focus:ring-blue-500 rounded focus:border-transparent focus:outline-none bg-gray-200"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-2 text-sm border rounded  border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  rows={4}
                  placeholder="Update Status..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 text-xs bg-[#3598dc] rounded text-white cursor-pointer">
                    SAVE
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Table */}
          <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex sm:flex col md:flex-row md:justify-between ">
              <h1 className="text-xl font-semibold text-gray-500">
                {" "}
                {selectedRows?.title}{" "}
                {selectedRows?.applicantName || selectedRows?.applicant_name}{" "}
                Conversation History
              </h1>
              <div className="flex gap-1">
                <button className="p-1.5 border border-gray-300 rounded bg-white cursor-pointer hover:bg-gray-50 text-blue-500">
                  <BsChatDots size={18} />
                </button>
                <button
                  onClick={() => setModel(true)}
                  className="p-1.5 border border-gray-300 rounded bg-white cursor-pointer hover:bg-gray-50 text-green-500"
                >
                  <FaWhatsapp size={18} />
                </button>
              </div>
            </div>
            <table className="w-full  my-2">
              <thead>
                <tr className="bg-gray-800 text-white">
                  <th className="w-[10%] text-xs font-normal px-6 py-2 text-left">
                    User
                  </th>
                  <th className="w-[80%] text-xs font-normal  py-2 text-left px-3">
                    Activity Description
                  </th>
                  <th className="w-[10%] text-xs font-normal px-6 py-2 text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-gray-100">
                  <td className="px-2 py-2 text-sm text-center ">
                    <FaUserCircle className="h-10 w-10 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-2 py-2 text-sm text-left">
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      <span className="text-[#3598dc] font-semibold">
                        Warm Client For 15th Edition Arogya Sangoshthi | Updated
                        By: Nishtha Sharma On 10 Jun 25 at 17:02
                      </span>

                      <a
                        onClick={() => setShowReviewForm(!showReviewForm)}
                        className="text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        | <IoIosNotifications size={18} /> Call The Client On 11
                        Jun 25 at 09:00
                      </a>

                      <a className="text-black font-semibold hover:underline cursor-pointer">
                        | Call The Client On 11 Jun 25 at 09:00
                      </a>

                      <span className="text-black font-semibold flex items-center gap-1">
                        | <IoIosNotifications size={18} /> Call The Client On 11
                        Jun 25 at 09:00
                      </span>
                    </div>
                    <span className="text-[#8896a0] text-sm font-semibold">
                      call not received
                    </span>
                  </td>

                  <td className="px-2 py-2 text-sm text-center ">
                    <button className="px-0.5 py-0.5 border border-[#337ab7] hover:border-[#1f5f97] cursor-pointer text-[#337ab7] hover:text-[#1f5f97]">
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
                <tr className="bg-gray-100">
                  <td className="px-2 py-2 text-sm text-center ">
                    <FaUserCircle className="h-10 w-10 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-2 py-2 text-sm text-left">
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      <span className="text-[#3598dc] font-semibold">
                        Sent Details For 15th Edition Arogya Sangoshthi |
                        Updated By: Nishtha Sharma On 10 Jun 25 at 17:02
                      </span>

                      <a
                        // onClick={() => setShowReviewForm(!showReviewForm)}
                        className="text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        | <IoIosNotifications size={18} /> Call The Client On 11
                        Jun 25 at 09:00
                      </a>

                      <a className="text-black font-semibold hover:underline cursor-pointer">
                        | Call The Client On 11 Jun 25 at 09:00
                      </a>

                      <span className="text-black font-semibold flex items-center gap-1">
                        | <IoIosNotifications size={18} /> Call The Client On 11
                        Jun 25 at 09:00
                      </span>
                    </div>
                    <span className="text-[#8896a0] text-sm font-semibold">
                      call not received
                    </span>
                  </td>

                  <td className="px-2 py-2 text-sm text-center ">
                    <button className="px-0.5 py-0.5 border border-[#337ab7] hover:border-[#1f5f97] cursor-pointer text-[#337ab7] hover:text-[#1f5f97]">
                      <MdDelete size={22} />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/*Model code */}
          {model && (
            <>
              <style>
                {`
        @keyframes modalSlideFromTop {
          0% {
            opacity: 0;
            transform: translate(10%, -60%);
          }
          100% {
            opacity: 1;
            transform: translate(10%, 0px);
          }
        }
      
        @keyframes modalSlideToTop {
          0% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -80px);
          }
        }
      `}
              </style>

              <div className="fixed inset-0 bg-black/10 backdrop-blur-[1px] z-40">
                <div
                  ref={menuRef}
                  className={`
          fixed left-1/2 -translate-x-1/2 top-10
          w-[90%] sm:w-[600px]
          bg-white px-5 py-3 rounded-sm shadow-lg shadow-gray-500 z-50
        `}
                  style={{
                    animation: "modalSlideFromTop 0.7s ease-out forwards",
                  }}
                >
                  <div>
                    <div className="flex justify-between px-2 text-center">
                      <h1 className="text-lg text-gray-600 font-serif ">
                        {selectedRows?.title}{" "}
                        {selectedRows?.applicantName ||
                          selectedRows?.applicant_name}{" "}
                        {selectedRows?.surname}
                      </h1>
                      <button
                        onClick={() => setModel(!model)}
                        className="py-0.5 px-3 bg-white hover:bg-gray-50 text-gray-600 cursor-pointer text-xl"
                      >
                        x
                      </button>
                    </div>
                  </div>

                  <hr className="w-full my-2 opacity-10" />

                  <form action="" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                      <div className="col-span-2">
                        <label className="text-sm font-semibold block mb-1">
                          Message
                        </label>
                        <textarea
                          name="message"
                          onChange={handleChange}
                          value={formData.message}
                          rows={3}
                          placeholder="Update Status......."
                          className={inpStyle}
                        ></textarea>
                      </div>

                      <div>
                        <label className="text-sm font-semibold block mb-1">
                          Image
                        </label>
                        <input
                          name="image"
                          ref={imageRef}
                          onChange={handleChange}
                          accept="image/*"
                          type="file"
                          className={`file:border file:border-gray-300 file:bg-gray-100 file:text-sm file:text-gray-800 file:px-2 file:cursor-pointer ${inpStyle}`}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold block mb-1">
                          Document
                        </label>
                        <input
                          name="document"
                          ref={documentRef}
                          onChange={handleChange}
                          type="file"
                          accept="application/pdf"
                          className={`file:border file:border-gray-300 file:bg-gray-100 file:text-sm file:text-gray-800 file:px-2 file:cursor-pointer ${inpStyle}`}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mb-2 mt-3">
                      <p className="text-red-500 text-xs font-normal">
                        Special Character not Allowed
                      </p>
                      <button className="px-2 py-1.5 bg-[#3598dc] hover:bg-[#2787c6] text-white cursor-pointer">
                        SAVE
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default VolunteerOverview;
