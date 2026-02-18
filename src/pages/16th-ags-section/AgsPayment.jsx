import React, { useRef, useState, useEffect } from "react";
import { showSuccess, showWarning, showError } from "../../utils/toastService";
import { FaMessage } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useReactToPrint } from "react-to-print";
import { getAllBanks } from "../../redux/slices/add_by_admin/bankSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  createAgsPayment,
  previewRegistrationNo,
  clearPreviewRegistration,
  getAllAgsPayments,
  deleteAgsPayment,
  updateAgsPayment,
} from "../../redux/slices/ags/agsPaymentSlice";

const AgsPayment = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { banks } = useSelector((state) => state.bank);
  const { previewRegistration, payments } = useSelector(
    (state) => state.payments,
  );
  const singleDelegate = location.state?.singleDelegate;
  const matchedClientStatuses = location.state?.matchedClientStatuses;
  
  // Filter payments for the current client
  const matchedPayments = payments?.filter(
    (payment) => payment.client_id === id,
  );

  const activePayments = matchedPayments?.filter(
    (p) => p.payment_status === "Active",
  );
  const cancelledPayments = matchedPayments?.filter(
    (p) => p.payment_status === "Cancelled",
  );

  // State
  const [paymentMode, setPaymentMode] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setFormData] = useState({
    paymentFor: "",
    Seminar_day: "",
    registration_no: "",
    adhar_noORpan_no: "",
    amount: "",
    bank_name: "",
    cheque_no: "",
    date_Of_issue: "",
    branch: "",
    paytm_no: "",
    transaction_id: "",
    UPI_ID: "",
    bank_Reference_No: "",
    order_no: "",
    payment_status: "Active",
  });
  useEffect(() => {
    dispatch(getAllBanks());
    dispatch(getAllAgsPayments());
  }, [dispatch]);

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const AADHAR_REGEX = /^\d{12}$/;
  const REGISTRATION_REGEX = /^[A-Za-z0-9-_/]{3,20}$/;
  const PAYTM_REGEX = /^\d{10}$/;
  const TRANSACTION_REGEX = /^[A-Za-z0-9_-]{6,30}$/;

  const validateForm = () => {
    // Common required fields

    if (!form.paymentFor) return "Payment For is required";
    if (!form.Seminar_day) return "Seminar Day is required";
    // if (!form.registration_no.trim()) return "Registration Number is required";

    // if (!REGISTRATION_REGEX.test(form.registration_no))
    //   return "Invalid Registration Number format";
    if (!form.adhar_noORpan_no.trim())
      return "Aadhar or PAN number is required";

    if (
      !AADHAR_REGEX.test(form.adhar_noORpan_no) &&
      !PAN_REGEX.test(form.adhar_noORpan_no)
    ) {
      return "Enter valid Aadhar (12 digits) or PAN (ABCDE1234F)";
    }
    if (!form.amount.trim()) return "Amount is required";
    if (!paymentMode) return "Please select a Payment Mode";

    // Amount validation
    if (isNaN(form.amount) || Number(form.amount) <= 0) {
      return "Amount must be a valid number";
    }

    // Payment mode based validation
    if (paymentMode === "cheque payment") {
      if (!form.bank_name) return "Bank Name is required";
      if (!form.cheque_no) return "Cheque No is required";
      if (!form.date_Of_issue) return "Date of Issue is required";
      if (!form.branch.trim()) return "Branch is required";
    }

    if (paymentMode === "paytm") {
      if (form.paytm_no && !PAYTM_REGEX.test(form.paytm_no))
        return "Paytm Number must be 10 digits";
      if (form.transaction_id && !TRANSACTION_REGEX.test(form.transaction_id))
        return "Invalid Transaction ID format";
      if (!form.UPI_ID.trim()) return "UPI ID is required";
    }

    if (paymentMode === "NEFT/RTGS") {
      if (!form.bank_Reference_No) return "Bank Reference No is required";
    }

    if (paymentMode === "payment getway") {
      if (!form.order_no) return "Order No is required";
    }

    return null; // ✅ No errors
  };

  const handleSeminarChange = (e) => {
    const value = e.target.value;

    if (!value) {
      setFormData((prev) => ({
        ...prev,
        Seminar_day: value,
        registration_no: "",
      }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      Seminar_day: value,
      registration_no: "", // clear old value
    }));

    if (value) {
      dispatch(previewRegistrationNo(value));
    }
    showSuccess("Registration Number has been generated.");
  };

  const handleDelete = (paymentId) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      const authUser = user || JSON.parse(localStorage.getItem("user"));
      const userId = authUser?._id || authUser?.id;
      dispatch(deleteAgsPayment({ id: paymentId, user_id: userId }))
        .unwrap()
        .then(() => showSuccess("Payment deleted successfully"))
        .catch((err) => showError(err || "Failed to delete payment"));
    }
  };

  const handleCancelPayment = (paymentId) => {
    if (window.confirm("Are you sure you want to cancel this payment?")) {
      const authUser = user || JSON.parse(localStorage.getItem("user"));
      const userId = authUser?._id || authUser?.id;
      dispatch(
        updateAgsPayment({
          id: paymentId,
          formData: { payment_status: "Cancelled", user_id: userId },
        }),
      )
        .unwrap()
        .then(() => {
          showSuccess("Payment cancelled successfully");
          dispatch(getAllAgsPayments());
        })
        .catch((err) => showError(err || "Failed to cancel payment"));
    }
  };

  const handleEdit = (payment) => {
    setFormData({
      paymentFor: payment.paymentFor || "",
      Seminar_day: payment.Seminar_day || "",
      registration_no: payment.registration_no || "",
      adhar_noORpan_no: payment.adhar_noORpan_no || "",
      amount: payment.amount || "",
      bank_name: payment.bank_name || "",
      cheque_no: payment.cheque_no || "",
      date_Of_issue: payment.date_Of_issue
        ? payment.date_Of_issue.split("T")[0]
        : "",
      branch: payment.branch || "",
      paytm_no: payment.paytm_no || "",
      transaction_id: payment.transaction_id || "",
      UPI_ID: payment.UPI_ID || "",
      bank_Reference_No: payment.bank_Reference_No || "",
      order_no: payment.order_no || "",
      payment_status: payment.payment_status || "Active",
    });
    setPaymentMode(payment.paymentMode || "");
    setIsEdit(true);
    setEditId(payment._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //data submit logic
  const handleSubmit = async (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      showWarning(error); // ❌ Stop submit
      return;
    }

    const authUser = user || JSON.parse(localStorage.getItem("user"));
    const userId = authUser?._id || authUser?.id;
    const userName = authUser?.name || authUser?.username || "Unknown User";

    if (!userId) {
      showError("Authentication error. Please log in again.");
      return;
    }

    const payload = {
      ...form,
      registration_no: isEdit ? form.registration_no : previewRegistration,
      paymentMode,
      user_id: userId,
      client_id: id, // Assuming id from params is the client_id
      created_by: userName,
      updated_by: userName,
      payment_status: "Active",
    };

    try {
      if (isEdit) {
        await dispatch(
          updateAgsPayment({ id: editId, formData: payload }),
        ).unwrap();
        showSuccess("Payment updated successfully!");
      } else {
        await dispatch(createAgsPayment(payload)).unwrap();
        showSuccess("Payment created successfully!");
      }
      handleReset();
      setPaymentMode("");
      dispatch(clearPreviewRegistration());
    } catch (err) {
      showError(err?.message || err || "Failed to save payment.");
    }
  };

  // For empty fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // form reseting
  const handleReset = () => {
    setFormData({
      paymentFor: "",
      Seminar_day: "",
      registration_no: "",
      adhar_noORpan_no: "",
      amount: "",
      bank_name: "",
      cheque_no: "",
      date_Of_issue: "",
      branch: "",
      paytm_no: "",
      transaction_id: "",
      UPI_ID: "",
      bank_Reference_No: "",
      order_no: "",
      payment_status: "Active",
    });
    setIsEdit(false);
    setEditId(null);
  };

  // Print Logic
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Document PDF",
  });

  const inpstyle =
    "w-full px-2 py-1.5 text-xs border border-gray-300 focus:ring-1 rounded focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const inpstyleOption =
    "w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none";

  return (
    <>
      <div className="w-full h-auto">
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
                  AGS Individual Data
                </h2>
                <p className="text-sm text-blue-100">
                  Manage and review individual payment details for AGS,
                  including registration information, payment history, and
                  transaction records.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 p-5">
          {/*main container */}
          <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 p-4">
            <h1 className="text-gray-800 font-normal text-xl">
              {isEdit ? "Update Payment" : "Payment"}
            </h1>
            <hr className="w-full opacity-10 my-2" />
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-3 my-2">
                {/* Payment For */}
                <div className="col-span-2">
                  <label className="text-sm font-normal mb-1 block">
                    Payment For
                  </label>
                  <select
                    name="paymentFor"
                    value={form.paymentFor}
                    onChange={handleChange}
                    className={inpstyleOption}
                  >
                    <option value="">Select Here</option>
                    {[
                      "For Seminar Only",
                      "For Paper Presentation Only",
                      "For Poster Presentation Only",
                    ].map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Seminar day  */}
                <div className="col-span-2">
                  <label className="text-sm font-normal mb-1 block">
                    Seminar day
                  </label>
                  <select
                    name="Seminar_day"
                    value={form.Seminar_day}
                    className={inpstyleOption}
                    onChange={handleSeminarChange}
                  >
                    <option value="">Select Here</option>
                    {[
                      "For 1st Day",
                      "For 2nd Day",
                      "For 3rd Day",
                      "For All Days",
                    ].map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Registration No. */}
                <div className="col-span-2">
                  <label className="text-sm font-normal mb-1 block">
                    Registration No.
                  </label>
                  <input
                    type="text"
                    name="registration_no"
                    className={inpstyle}
                    value={
                      isEdit ? form.registration_no : previewRegistration || ""
                    }
                    disabled
                  />
                </div>
                {/* Adhar No./Pan no. */}
                <div className="col-span-3">
                  <label className="text-sm font-normal mb-1 block">
                    Adhar No./Pan no.
                  </label>
                  <input
                    type="text"
                    name="adhar_noORpan_no"
                    className={inpstyle}
                    value={form.adhar_noORpan_no}
                    onChange={handleChange}
                    placeholder="Enter Adhar No./Pan no."
                  />
                </div>
                {/* Amount */}
                <div className="col-span-3">
                  <label className="text-sm font-normal mb-1 block">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    className={inpstyle}
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Enter Amount"
                  />
                </div>
              </div>

              {/*Payment mode section */}
              <div className="flex items-center gap-2 my-3">
                <hr className="grow border-gray-300 opacity-70" />
                <h1 className="text-red-500 font-medium text-base whitespace-nowrap">
                  Payment Mode
                </h1>
                <hr className="grow border-gray-300 opacity-70" />
              </div>
              <div>
                <div>
                  <div className="inline-flex gap-6 mb-3">
                    <label className="text-sm font-normal flex gap-1">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cash payment"
                        checked={paymentMode === "cash payment"}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      />
                      Cash Payment
                    </label>
                    <label className="text-sm font-normal flex gap-1">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="cheque payment"
                        checked={paymentMode === "cheque payment"}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      />
                      Cheque Payment
                    </label>
                    <label className="text-sm font-normal flex gap-1">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="paytm"
                        checked={paymentMode === "paytm"}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      />
                      Paytm
                    </label>
                    <label className="text-sm font-normal flex gap-1">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="NEFT/RTGS"
                        checked={paymentMode === "NEFT/RTGS"}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      />
                      NEFT/RTGS
                    </label>
                    <label className="text-sm font-normal flex gap-1">
                      <input
                        type="radio"
                        name="paymentMode"
                        value="payment getway"
                        checked={paymentMode === "payment getway"}
                        onChange={(e) => setPaymentMode(e.target.value)}
                      />
                      Payment Gateway
                    </label>
                  </div>
                  {/*Cheque payement */}
                  {paymentMode === "cheque payment" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 my-1">
                      {/* Bank Name */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Bank Name <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="bank_name"
                          className={inpstyleOption}
                          value={form.bank_name}
                          onChange={handleChange}
                        >
                          <option value="">Select Bank Name Here...</option>
                          {banks.map((item, index) => (
                            <option key={index} value={item?.bank_name}>
                              {item?.bank_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Cheque No */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Cheque No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="cheque_no"
                          className={inpstyle}
                          value={form.cheque_no}
                          onChange={handleChange}
                          placeholder="Enter Cheque No"
                        />
                      </div>

                      {/* Date Of Issue */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Date Of Issue <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="date_Of_issue"
                          className={inpstyle}
                          value={form.date_Of_issue}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Branch*/}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Branch <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="branch"
                          className={inpstyle}
                          value={form.branch}
                          onChange={handleChange}
                          placeholder="Enter Branch"
                        />
                      </div>
                    </div>
                  )}
                  {/*Paytm */}
                  {paymentMode === "paytm" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 my-1">
                      {/* Paytm No */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Paytm No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="paytm_no"
                          className={inpstyle}
                          value={form.paytm_no}
                          onChange={handleChange}
                          placeholder="Enter Paytm No"
                        />
                      </div>

                      {/* Transaction id  */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Transaction id <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="transaction_id"
                          className={inpstyle}
                          value={form.transaction_id}
                          onChange={handleChange}
                          placeholder="Enter Transaction id "
                        />
                      </div>

                      {/* UPI ID  */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          UPI ID <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="UPI_ID"
                          className={inpstyle}
                          value={form.UPI_ID}
                          onChange={handleChange}
                          placeholder="Enter UPI ID"
                        />
                      </div>
                    </div>
                  )}
                  {/*NEFT/RTGS  */}
                  {paymentMode === "NEFT/RTGS" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 my-1">
                      {/* Bank Reference No */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Bank Reference No{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="bank_Reference_No"
                          className={inpstyle}
                          value={form.bank_Reference_No}
                          onChange={handleChange}
                          placeholder="Enter Bank Reference No"
                        />
                      </div>
                    </div>
                  )}
                  {/*Payment Gateway  */}
                  {paymentMode === "payment getway" && (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-3 my-1">
                      {/* Payment Gateway */}
                      <div>
                        <label className="text-sm font-normal mb-1 block">
                          Order No <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="number"
                          name="order_no"
                          className={inpstyle}
                          value={form.order_no}
                          onChange={handleChange}
                          placeholder="Enter Order No"
                        />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-6">
                  <p className="text-sm text-red-500">* Required Fields</p>
                  <button
                    type="submit"
                    className="px-3 py-1 text-sm text-white font-normal bg-[#3598dc] hover:bg-[#1e7cba] cursor-pointer"
                  >
                    {isEdit ? "UPDATE PAYMENT" : "GENERATE RECEIPT"}
                  </button>
                  {isEdit && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-3 py-1 text-sm text-gray-700 font-normal bg-gray-200 hover:bg-gray-300 cursor-pointer ml-2"
                    >
                      CANCEL EDIT
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/*Table Data 1 */}
          <div
            ref={printRef}
            className="bg-white shadow-sm rounded-lg border border-gray-200"
          >
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaMessage className="text-gray-500" />
                <h3 className="text-base font-normal text-gray-800">
                  AGS payment
                </h3>
              </div>
              <button
                onClick={handlePrint}
                className="text-gray-600 hover:text-blue-600 print:hidden"
              >
                <FaPrint size={18} />
              </button>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      S.No.
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Registration Details
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700">
                      Payment Details
                    </th>
                    <th className="px-4 py-3 font-medium text-gray-700 whitespace-nowrap">
                      Updated Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {activePayments && activePayments.length > 0 ? (
                    activePayments.map((payment, index) => (
                      <tr
                        key={payment._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{index + 1}.</td>
                        <td className="px-4 py-3">
                          <p
                            onClick={() =>
                              navigate(
                                `/16th-ags-section/receipt/${payment._id}`,
                                {
                                  state: { singleDelegate, payment, matchedClientStatuses },
                                },
                              )
                            }
                            className="text-blue-600 hover:underline cursor-pointer font-normal"
                          >
                            Registration No.: {payment.registration_no}{" "}
                            {payment.paymentFor} {payment.Seminar_day}
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-600 text-sm font-normal">
                            Received payment of Rs. {payment.amount} on{" "}
                            {new Date(payment.createdAt).toLocaleDateString()}{" "}
                            via {payment.paymentMode}
                            {payment.transaction_id
                              ? ` (Txn No: ${payment.transaction_id})`
                              : ""}{" "}
                            from (Reg. No: {payment.registration_no}).
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => handleEdit(payment)}
                              className="text-blue-600 hover:font-medium hover:underline text-sm transition-all"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleCancelPayment(payment._id)}
                              className="text-yellow-600 hover:font-medium hover:underline text-sm transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDelete(payment._id)}
                              className="text-red-600 hover:font-medium hover:underline text-sm transition-all"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-4">
                        No payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/*Table Data 2*/}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200">
            <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FaMessage className="text-gray-500" />
                <h3 className="text-base font-normal text-gray-800">
                  AGS Cancelled payment
                </h3>
              </div>
              <button className="text-gray-600 hover:text-blue-600">
                <FaPrint size={18} />
              </button>
            </div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {[
                      "No.",
                      "Reg. No",
                      "Amount",
                      "Payment Mode",
                      "Date/Time",
                      "Status",
                      "Action",
                    ].map((value, index) => (
                      <th
                        key={index}
                        className="px-4 py-3 font-medium text-gray-700"
                      >
                        {value}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cancelledPayments && cancelledPayments.length > 0 ? (
                    cancelledPayments.map((payment, index) => (
                      <tr
                        key={payment._id}
                        className="border-b border-gray-200 hover:bg-gray-50"
                      >
                        <td className="px-4 py-3">{index + 1}.</td>
                        <td className="px-4 py-3">{payment.registration_no}</td>

                        <td className="px-4 py-3">Rs. {payment.amount}</td>
                        <td className="px-4 py-3">{payment.paymentMode}</td>
                        <td className="px-4 py-3">
                          {new Date(payment.createdAt).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
                            {payment.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => handleDelete(payment._id)}
                            className="text-red-600 hover:font-medium hover:underline text-sm transition-all"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No cancelled payments found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgsPayment;
