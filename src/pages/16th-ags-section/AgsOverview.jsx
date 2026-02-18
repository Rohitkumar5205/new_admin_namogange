import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAgsDelegateById,
  clearSingleAgsDelegate,
} from "../../redux/slices/ags/agsDelegateSlice";
// import { useReactToPrint } from "react-to-print";
import { FaWhatsapp, FaPrint, FaPencilAlt, FaUserCircle } from "react-icons/fa";
import { BsChatDots } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import { IoIosNotifications } from "react-icons/io";
import {
  createClientStatus,
  getAllClientStatuses,
  deleteClientStatus,
} from "../../redux/slices/ags/clientStatusSlice";
import { showSuccess, showError } from "../../utils/toastService";
import { updateAgsDelegate } from "../../redux/slices/ags/agsDelegateSlice";
import { getAllEvents } from "../../redux/slices/add_by_admin/eventSlice";

const AgsOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { singleDelegate } = useSelector((state) => state.agsDelegate);
  // console.log("Single Delegate from Redux Store:", singleDelegate);
  const { user } = useSelector((state) => state.auth);
  const { clientStatuses } = useSelector((state) => state.clientStatus);
  // console.log("Client Statuses from Redux Store:", clientStatuses);
  const { events } = useSelector((state) => state.event);
  console.log("Events from Redux Store:", events);

  // Filter client statuses for the current delegate
  const matchedClientStatuses = clientStatuses?.filter(
    (status) => status.client_id === singleDelegate?._id,
  );
  console.log(
    "Matched Client Statuses for this Delegate:",
    matchedClientStatuses,
  );
  // option data

  const statusOpt = [
    "Warm Client",
    "Hot Client",
    "Registration Done",
    "Payment Refunded",
    "Not Interested",
  ];

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    selected_event: "",
    reminder_date_time: "",
    desc: "",
    created_by: "",
    updated_by: "",
  });

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
    dispatch(getAllClientStatuses());
    dispatch(getAllEvents());
  }, [dispatch]);

  useEffect(() => {
    if (id) {
      dispatch(getAgsDelegateById(id));
    }
    return () => {
      dispatch(clearSingleAgsDelegate());
    };
  }, [id, dispatch]);

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

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    const authUser = user || JSON.parse(localStorage.getItem("user"));
    const userId = authUser?._id || authUser?.id;
    const userName = authUser?.username || authUser?.name || "Admin";

    if (!userId) {
      showError("Authentication error. Please log in again.");
      return;
    }
    if (!selectedStatus) {
      showError("Please select a status.");
      return;
    }
    if (!reviewData.selected_event) {
      showError("Please select an event.");
      return;
    }

    const payload = {
      user_id: userId, // For activity log
      client_id: id,
      selected_status: selectedStatus,
      selected_event: reviewData.selected_event,
      previous_status: singleDelegate?.status || "N/A",
      desc: reviewData.desc,
      reminder_date_time: null,
      created_by: userName,
      updated_by: userName,
    };

    if (selectedStatus === "Warm Client" || selectedStatus === "Hot Client") {
      if (!reviewData.reminder_date_time) {
        showError("Reminder Date & Time is required for this status.");
        return;
      }
      payload.reminder_date_time = reviewData.reminder_date_time;
    }

    try {
      await dispatch(createClientStatus(payload)).unwrap();

      // Update Delegate with new Client Status
      const delegateUpdateData = {
        clientStatus: selectedStatus,
        updatedStatusBy: userName,
        user_id: userId,
      };
      // Add .get() method to support Redux slice expecting FormData
      delegateUpdateData.get = (key) => delegateUpdateData[key];

      await dispatch(
        updateAgsDelegate({ id, formData: delegateUpdateData }),
      ).unwrap();

      showSuccess("Client status updated successfully!");
      setSelectedStatus("");
      setReviewData({
        selected_status: "",
        selected_event: "",
        reminder_date_time: "",
        desc: "",
      });
      setShowReviewForm(false);
      dispatch(getAgsDelegateById(id)); // Refetch delegate to show history
    } catch (err) {
      showError(err?.message || err || "Failed to update client status.");
      console.error("Failed to update client status:", err);
    }
  };

  const handleDeleteStatus = (statusId) => {
    const authUser = user || JSON.parse(localStorage.getItem("user"));
    const userId = authUser?._id || authUser?.id;
    dispatch(
      deleteClientStatus({ id: statusId, user_id: userId, client_id: id }),
    );
    showSuccess("Client status deleted successfully!");
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

  const printRef1 = useRef();
  //   const handlePrint1 = useReactToPrint({
  //     content: () => printRef1.current,
  //   });
  const handlePrint1 = () => {
    window.print();
  };

  const inpStyle =
    "w-full px-2 py-1.5 text-xs rounded font-normal border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none";

  return (
    <>
      <div className="w-full h-auto ">
        {/* Header */}

        <div
          className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-white/10"></div>

          {/* Content */}
          <div className="relative flex justify-center items-center px-6 py-4 h-25">
            <div className="flex items-center gap-4">
              <div className="flex flex-col text-center">
                <h2 className="text-xl font-semibold text-white text-center">
                  Individual Data
                </h2>
                <p className="text-sm text-blue-100">
                  View and manage individual contestant data, including personal
                  details, registration information, and communication history.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          {/* Main Content */}
          <div className="flex flex-col  gap-4">
            {/* Client Details Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-2 w-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-normal text-gray-600">
                  {singleDelegate?.title} {singleDelegate?.firstName}{" "}
                  {singleDelegate?.lastName} Information
                </h2>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      navigate(`/16th-ags-section/ags-payment/${id}`, {
                        state: {
                          singleDelegate,
                          matchedClientStatuses,
                        },
                      })
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
                      navigate(`/16th-ags-section/ags-edit-data/${id}`)
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
                        className="bg-gray-300 font-medium px-2 py-1 text-[#3598dc] text-left"
                      >
                        Contestant Personal Information
                      </th>
                    </tr>
                    <tr className="text-left text-sm ">
                      <th className="px-2 text-left py-1 font-medium">
                        Registration No.
                      </th>
                      <td className="px-2 py-1 ">{singleDelegate?._id}</td>

                      <th className="px-2 text-left py-1 font-medium">
                        Contestant Name
                      </th>
                      <td className="px-2 py-1">
                        {" "}
                        {singleDelegate?.firstName} {singleDelegate?.lastName}
                      </td>
                      <th className="px-2 text-left py-1 font-medium">Event</th>
                      <td className="px-2 py-1">{singleDelegate?.event}</td>
                    </tr>
                    <tr className="text-left text-sm ">
                      <th className="px-2 text-left py-1 font-medium">
                        Profession
                      </th>
                      <td className="px-2 py-1">
                        {singleDelegate?.profession}
                      </td>

                      <th className="px-2 text-left py-1 font-medium">
                        Category
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.category}</td>
                      <th className="px-2 text-left py-1 font-medium">
                        Email Address
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.email}</td>
                    </tr>
                    <tr className="text-left text-sm ">
                      <th className="px-2 text-left py-1 font-medium">
                        Mobile No.
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.mobile}</td>

                      <th className="px-2 text-left py-1 font-medium">
                        Alternate Mobile No.{" "}
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.alternate}</td>
                      <th className="px-2 text-left py-1 font-medium">
                        Address
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.address}</td>
                    </tr>
                    <tr className="text-left text-sm ">
                      <th className="px-2 text-left py-1 font-medium">
                        Country{" "}
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.country}</td>

                      <th className="px-2 text-left py-1 font-medium">State</th>
                      <td className="px-2 py-1">{singleDelegate?.state}</td>
                      <th className="px-2 text-left py-1 font-medium">City</th>
                      <td className="px-2 py-1">{singleDelegate?.city}</td>
                    </tr>
                    <tr className="text-left text-sm ">
                      <th className="px-2 text-left py-1 font-medium">
                        Pincode
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.pin}</td>

                      <th className="px-2 text-left py-1 font-medium">
                        Contestants Type
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.mode}</td>
                      <th className="px-2 text-left py-1 font-medium">
                        University
                      </th>
                      <td className="px-2 py-1">
                        {singleDelegate?.university}
                      </td>
                    </tr>
                    <tr className="text-left text-sm ">
                      <th className="px-2 text-left py-1 font-medium">
                        College Name
                      </th>
                      <td className="px-2 py-1">{singleDelegate?.college}</td>
                    </tr>
                  </tbody>

                  {/*Source Coordinator Detail */}
                  <tbody>
                    <tr>
                      <th
                        colSpan={6}
                        className="bg-gray-300 px-2 font-medium py-1 mt-2 text-[#3598dc] text-left"
                      >
                        Source Coordinator Detail
                      </th>
                    </tr>
                    <tr className="text-left text-sm">
                      <th className="px-2 py-1 font-medium">
                        Main Coordinator | Referral
                      </th>
                      <td className="px-2 py-1">
                        {singleDelegate?.coordinator}
                      </td>

                      {/* <th className="px-2 py-1">Sub Coordinator | Source</th>
                    <td className="px-2 py-1">
                      {singleDelegate?.source}
                    </td> */}

                      <th className="px-2 py-1 font-medium">Enquiry For</th>
                      <td className="px-2 py-1">
                        {singleDelegate?.enquiryFor}
                      </td>
                      <th className="px-2 py-1 font-medium">Client Status</th>
                      <td className="px-2 py-1">
                        {singleDelegate?.clientStatus || " - "}
                      </td>
                    </tr>
                    <tr className="text-left text-sm"></tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Review Form */}
            {(showReviewForm || matchedClientStatuses?.length === 0) && (
              <form
                onSubmit={handleReviewSubmit}
                className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-4 gap-2">
                  <div className="">
                    <label className="text-sm font-normal text-gray-800 block mb-1">
                      Status
                    </label>
                    <select
                      name="selected_status"
                      id="selected_status"
                      required
                      className={inpStyle}
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">Select Status</option>
                      {statusOpt.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </select>
                  </div>

                  {(selectedStatus === "Warm Client" ||
                    selectedStatus === "Hot Client") && (
                    <div className="space-x-3">
                      <label className="text-sm font-normal text-gray-800 block mb-1">
                        Reminder Date & Time{" "}
                        <span className="text-red-500 mt-1">*</span>
                      </label>
                      <input
                        type="datetime-local"
                        name="reminder_date_time"
                        className={inpStyle}
                        value={reviewData.reminder_date_time}
                        onChange={handleReviewChange}
                      />
                    </div>
                  )}

                  {selectedStatus !== "" && (
                    <div>
                      <label className="text-sm font-normal text-gray-800 block mb-1">
                        Select Event{" "}
                        <span className="text-red-500 mt-1">*</span>
                      </label>
                      <select
                        name="selected_event"
                        className="w-full px-2 py-1.5 rounded text-xs font-normal border border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                        value={reviewData.selected_event}
                        onChange={handleReviewChange}
                        required
                      >
                        <option value="">Select Here</option>
                        {events?.map((value, index) => (
                          <option key={index} value={value.name}>
                            {value?.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-normal text-gray-800 block mb-1">
                      Previous Status
                    </label>
                    <input
                      type="text"
                      // value={singleDelegate?.status || ""}
                      value={
                        matchedClientStatuses?.[0]?.selected_status || "N/A"
                      }
                      className="w-full px-2 py-1.5 text-xs font-normal 
              border border-gray-300 focus:ring-1
               focus:ring-blue-500 rounded focus:border-transparent focus:outline-none bg-gray-200"
                      readOnly
                      disabled
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-normal text-gray-800 block mb-1">
                    Description
                  </label>
                  <textarea
                    name="desc"
                    className="w-full px-2 text-sm border rounded  border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-transparent focus:outline-none"
                    rows={4}
                    placeholder="Update Status..."
                    value={reviewData.desc}
                    onChange={handleReviewChange}
                  ></textarea>
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 text-xs bg-[#3598dc] rounded text-white cursor-pointer"
                    >
                      SAVE
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Table */}
            <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex sm:flex col md:flex-row md:justify-between ">
                <h1 className="text-lg font-normal text-gray-500">
                  {" "}
                  Conversation History
                </h1>
                <div className="flex gap-1">
                  <button className="p-1.5 border border-gray-300 rounded bg-white cursor-pointer hover:bg-gray-50 text-blue-500">
                    <BsChatDots size={16} />
                  </button>
                  <button
                    onClick={() => setModel(true)}
                    className="p-1.5 border border-gray-300 rounded bg-white cursor-pointer hover:bg-gray-50 text-green-500"
                  >
                    <FaWhatsapp size={16} />
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
                  {matchedClientStatuses && matchedClientStatuses.length > 0 ? (
                    matchedClientStatuses.map((status, index) => (
                      <tr key={status._id} className="bg-gray-100">
                        <td className="px-2 py-2 text-sm text-center ">
                          <FaUserCircle className="h-10 w-10 text-gray-400 mx-auto" />
                        </td>
                        <td className="px-2 py-2 text-sm text-left">
                          <div className="flex flex-wrap items-center gap-1 text-xs">
                            <span className="text-[#3598dc] font-semibold">
                              {status?.selected_status || "No status"} For{" "}
                              {status?.selected_event} | Updated By:{" "}
                              {status?.updated_by} On{" "}
                              {new Date(status.updatedAt).toLocaleString()}
                            </span>
                            {index === 0 && (
                              <a
                                onClick={() =>
                                  setShowReviewForm(!showReviewForm)
                                }
                                className="text-red-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                              >
                                | <IoIosNotifications size={18} /> Call The
                                Client{" "}
                                {new Date(status.createdAt).toLocaleString()}
                              </a>
                            )}
                          </div>
                          <span className="text-[#8896a0] text-sm font-semibold">
                            {status.desc || "No description provided."}
                          </span>
                        </td>

                        <td className="px-2 py-2 text-sm text-center ">
                          <button
                            onClick={() => handleDeleteStatus(status._id)}
                            className="px-0.5 py-0.5 border border-[#337ab7] hover:border-[#1f5f97] cursor-pointer text-[#337ab7] hover:text-[#1f5f97]"
                          >
                            <MdDelete size={22} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center py-4 text-gray-500"
                      >
                        No conversation history found.
                      </td>
                    </tr>
                  )}
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
      </div>
    </>
  );
};

export default AgsOverview;
