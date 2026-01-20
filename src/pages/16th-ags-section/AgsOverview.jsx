import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
import { FaWhatsapp, FaPrint, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";

const AgsOverview = () => {
  const rows = [
    {
      id: 1,
      registration: { number: "TGMY-2021-536" },
      contestant: {
        Title: "Mr.",
        name: "Vikas",
        surname: "Mehra",
        status: "Active",
      },
      mobile: { number: "9812345678" },
      volunteer: { Title: "Mr.", name: "Rohit", surname: "Sharma" },
      profession: { name: "Video Editor" },
      gender: { name: "Male" },
      event: "Audition Delhi",
      category: "Senior",
      email_address: "vikas@gmail.com",
      alternate_mobile_number: "9812300000",
      address: "Sector 45",
      country: "India",
      pincode: "122003",
      contestants_type: "Individual",
      university: "MDU",
      college_name: "XYZ College",
      main_coordinator: "Rohit",
      sub_coordinator: "Amit",
      enquiry_for: "Audition",
      status: "Active",
      contest: { name: "TGMY" },
      enquiry: { for: "Audition" },
      source: { name: "Instagram" },
      city: { name: "Gurgaon" },
      state: { name: "Haryana" },
      fees: { amount: "400" },
      user: { name: "Admin" },
      updated: { date: "2025-02-01" },
    },
    {
      id: 2,
      registration: { number: "TGMY-2021-537" },
      contestant: {
        Title: "Ms.",
        name: "Kritika",
        surname: "Soni",
        status: "Pending",
      },
      mobile: { number: "9823456789" },
      volunteer: { Title: "Ms.", name: "Neha", surname: "Gupta" },
      profession: { name: "Makeup Artist" },
      gender: { name: "Female" },
      event: "Video Round",
      category: "Junior",
      email_address: "kritika@gmail.com",
      alternate_mobile_number: "9823400000",
      address: "Town Hall",
      country: "India",
      pincode: "313001",
      contestants_type: "Individual",
      university: "MLSU",
      college_name: "ABC College",
      main_coordinator: "Neha",
      sub_coordinator: "Pooja",
      enquiry_for: "Video Round",
      status: "Pending",
      contest: { name: "TGMY" },
      enquiry: { for: "Video Round" },
      source: { name: "Facebook" },
      city: { name: "Udaipur" },
      state: { name: "Rajasthan" },
      fees: { amount: "600" },
      user: { name: "Coordinator" },
      updated: { date: "2025-02-02" },
    },
  ];

  // option data

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

  // modal logic

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

  // Handle input change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // handleSubmit data logic
  const handleSubmit = (e) => {
    e.preventDefault();

    // ADD MODAL DATA INTO HISTORY TABLE
    const newHistory = {
      user: "Admin", // or login user name
      message: formData.message,
      image: formData.image ? formData.image.name : "",
      document: formData.document ? formData.document.name : "",
      time: new Date().toLocaleString(),
    };

    setHistory((prev) => [...prev, newHistory]);

    // Reset modal inputs
    setFormData({ message: "", image: null, document: null });

    if (imageRef.current) imageRef.current.value = null;
    if (documentRef.current) documentRef.current.value = null;

    setModel(false); // Close modal after submit
  };

  // useNavigation logic
  const navigate = useNavigate();

  const { id } = useParams();
  const selectedRows = rows.find((item) => item.id === Number(id));
  const printRef1 = useRef();
  //   const handlePrint1 = useReactToPrint({
  //     content: () => printRef1.current,
  //   });
  const handlePrint1 = () => {
    window.print();
  };

  console.log("selectedRows..", selectedRows);

  const inpStyle =
    "w-full px-2 py-1.5 text-xs rounded font-semibold border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none";

  return (
    <>
      <div className="w-full h-auto ">
        {/* Header */}

        <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              Individual Data
            </h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col mt-4 gap-4">
          {/* Client Details Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 w-full">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold text-gray-600">
                {selectedRows?.contestant?.Title}{" "}
                {selectedRows?.contestant?.name}{" "}
                {selectedRows?.contestant?.surname}
                {selectedRows?.contestant?.surname} Information
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    // navigate(`/16th-ags-section/ags-payment/${selectedRows.id}`, {
                    //   state: selectedRows,
                    // })
                    navigate("/16th-ags-section/ags-payment ")
                  }
                  className="px-3 py-1 text-sm text-gray-700 bg-white hover:bg-gray-300 border border-gray-300 cursor-pointer"
                >
                  Account
                </button>
                <button
                  onClick={() =>
                    // navigate(
                    //   `/16th-ags-section/ags-payment/${selectedRows.id}`,
                    //   {
                    //     state: selectedRows,
                    //   }
                    // )
                    navigate("/16th-ags-section/ags-edit-data")
                  }
                  className="flex items-center justify-center px-2.5 py-1.5 border border-gray-300 hover:bg-gray-100"
                >
                  <FaPencilAlt className="w-3 h-3" color="gray" />
                </button>
                {/* <button
                  onClick={handlePrint1}
                  className="bg-white px-2.5 py-1.5 text-xs cursor-pointer border border-gray-300 hover:bg-gray-100"
                >
                  <FaPrint color="gray" />
                </button> */}
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
                      Contestant Personal Information
                    </th>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Registration No.</th>
                    <td className="px-2 py-2 ">
                      {selectedRows?.registration?.number}
                    </td>

                    <th className="px-2 text-left py-2">Contestant Name</th>
                    <td className="px-2 py-2">
                      {" "}
                      {selectedRows?.contestant?.name}
                    </td>

                    <th className="px-2 text-left py-2">Gender </th>
                    <td className="px-2 py-2">{selectedRows?.gender?.name}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Event</th>
                    <td className="px-2 py-2">{selectedRows?.event}</td>

                    <th className="px-2 text-left py-2">Profession</th>
                    <td className="px-2 py-2">
                      {selectedRows?.profession?.name}
                    </td>

                    <th className="px-2 text-left py-2">Category</th>
                    <td className="px-2 py-2">{selectedRows?.category}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Email Address</th>
                    <td className="px-2 py-2">{selectedRows?.email_address}</td>

                    <th className="px-2 text-left py-2">Mobile No.</th>
                    <td className="px-2 py-2">
                      {selectedRows?.mobile?.number}
                    </td>

                    <th className="px-2 text-left py-2">
                      Alternate Mobile No.{" "}
                    </th>
                    <td className="px-2 py-2">
                      {selectedRows?.alternate_mobile_number}
                    </td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">Address</th>
                    <td className="px-2 py-2">{selectedRows?.address}</td>

                    <th className="px-2 text-left py-2">Country </th>
                    <td className="px-2 py-2">{selectedRows?.country}</td>

                    <th className="px-2 text-left py-2">State</th>
                    <td className="px-2 py-2">{selectedRows?.state?.name}</td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">City</th>
                    <td className="px-2 py-2">{selectedRows?.city?.name}</td>

                    <th className="px-2 text-left py-2">Pincode</th>
                    <td className="px-2 py-2">{selectedRows?.pincode}</td>

                    <th className="px-2 text-left py-2">Contestants Type</th>
                    <td className="px-2 py-2">
                      {selectedRows?.contestants_type}
                    </td>
                  </tr>
                  <tr className="text-left text-sm ">
                    <th className="px-2 text-left py-2">University</th>
                    <td className="px-2 py-2">{selectedRows?.university}</td>

                    <th className="px-2 text-left py-2">College Name</th>
                    <td className="px-2 py-2">{selectedRows?.college_name}</td>
                  </tr>
                </tbody>

                {/*Source Coordinator Detail */}
                <tbody>
                  <tr>
                    <th
                      colSpan={6}
                      className="bg-gray-300 px-2 py-1 text-[#3598dc] text-left"
                    >
                      Source Coordinator Detail
                    </th>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Main Coordinator | Referral</th>
                    <td className="px-2 py-2">
                      {selectedRows?.main_coordinator}
                    </td>

                    <th className="px-2 py-2">Sub Coordinator | Source</th>
                    <td className="px-2 py-2">
                      {selectedRows?.sub_coordinator}
                    </td>

                    <th className="px-2 py-2">Enquiry For</th>
                    <td className="px-2 py-2">{selectedRows?.enquiry_for}</td>
                  </tr>
                  <tr className="text-left text-sm">
                    <th className="px-2 py-2">Status</th>
                    <td className="px-2 py-2">{selectedRows?.status}</td>
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
                          className="w-full px-2 py-1 text-xs font-semibold border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none"
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
               focus:ring-blue-500 focus:border-transparent focus:outline-none bg-gray-200"
                    readOnly
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="text-sm font-medium text-gray-800 block mb-1">
                  Description
                </label>
                <textarea
                  className="w-full px-2 text-sm border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                  rows={4}
                  placeholder="Update Status..."
                ></textarea>
                <div className="flex justify-end mt-2">
                  <button className="px-4 py-2 text-xs bg-[#3598dc] text-white cursor-pointer">
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
                {selectedRows?.volunteer?.Title} {selectedRows?.volunteer?.name}{" "}
                {selectedRows?.volunteer?.surname} Conversation History
              </h1>
              <div className="flex gap-2">
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

                <tr>
                  <td className="px-2 py-2 text-sm text-center ">
                    <FaUserCircle className="h-10 w-10 text-gray-400 mx-auto" />
                  </td>
                  <td className="px-2 py-2 text-sm text-left">
                    <div className="flex flex-wrap items-center gap-1 text-xs">
                      <span className="text-[#3598dc] font-semibold">
                        Warm Client For 15th Edition Arogya Sangoshthi | Updated
                        By: Nishtha Sharma On 10 Jun 25 at 17:02
                      </span>

                      <a className="text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer">
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
              {/* KEYFRAMES inside SAME component */}

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
                {/* MODAL BOX */}
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
                        Mrs Anoop Shahgal
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
                      {/* Status Textarea */}
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

                      {/* Image Upload */}
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

                      {/* Document Upload */}
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

export default AgsOverview;
