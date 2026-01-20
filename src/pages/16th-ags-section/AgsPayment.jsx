import React, { useRef, useState } from "react";
import { showSuccess, showWarning } from "../../utils/toastService";
import { FaMessage } from "react-icons/fa6";
import { FaPrint } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { useReactToPrint } from "react-to-print";

const AgsPayment = () => {
  // data
  const volunteerNames = [
    { id: 1, name: "Vikas Mehra" },
    { id: 2, name: "Kritika Soni" },
    { id: 3, name: "Aman Qureshi" },
    { id: 4, name: "Riya Banerjee" },
    { id: 5, name: "Naveen Rao" },
    { id: 6, name: "Pallavi Desai" },
    { id: 7, name: "Saurabh Thakur" },
    { id: 8, name: "Megha Kapoor" },
    { id: 9, name: "Rohit Malviya" },
    { id: 10, name: "Ankita Roy" },
    { id: 11, name: "Harshit Jain" },
  ];
  // id base data
  const navigate = useNavigate();

  const { id } = useParams();
  const data = volunteerNames.find((item) => item.id === Number(id));

  // State
  const [paymentMode, setPaymentMode] = useState("");
  const [form, setFormData] = useState({
    paymentFor: "",
    Seminar_day: "",
    Registration_No: "",
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
  });

  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
  const AADHAR_REGEX = /^\d{12}$/;
  const REGISTRATION_REGEX = /^[A-Za-z0-9-_/]{3,20}$/;
  const PAYTM_REGEX = /^\d{10}$/;
  const TRANSACTION_REGEX = /^[A-Za-z0-9_-]{6,30}$/;

  const validateForm = () => {
    // Common required fields

    if (!form.paymentFor) return "Payment For is required";
    if (!form.Seminar_day) return "Seminar Day is required";
    if (!form.Registration_No.trim()) return "Registration Number is required";

    if (!REGISTRATION_REGEX.test(form.Registration_No))
      return "Invalid Registration Number format";
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

  //data submit logic
  const handleSubmit = (e) => {
    e.preventDefault();

    const error = validateForm();

    if (error) {
      showWarning(error); // ❌ Stop submit
      return;
    }

    console.log({ ...form, paymentMode });
    showSuccess("Form Data has been Submitted Successfully");
    handleReset();
    setPaymentMode("");
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
      Registration_No: "",
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
    });
  };

  // Print Logic
  const printRef = useRef();
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: "Document PDF",
  });

  // Bank data

  const BankData = [
    "Allahabad Bank",
    "Andhra Bank ",
    "Axis Bank",
    "Bank of Bahrain and Kuwait",
    "Bank of Baroda - Corporate Banking",
    "Bank of Baroda - Retail Banking ",
    "Bank of India",
    "Bank of Maharashtra ",
    "Canara Bank",
    "City Union Bank",
    "Corporation Bank",
    "Deutsche Bank",
  ];

  const inpstyle =
    "w-full px-2 py-1.5 text-xs border border-gray-300 focus:ring-1 rounded focus:ring-blue-500 outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none";
  const inpstyleOption =
    "w-full px-2 py-[5px] text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 outline-none";

  return (
    <>
      <div className="w-full h-auto space-y-6">
        <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
          <div>
            <h2 className="text-lg font-medium text-gray-800">
              {data?.name || "AGS"} Individual Data
            </h2>
          </div>
        </div>
        {/*main container */}
        <div className="w-full bg-white rounded-md shadow-sm border border-gray-200 p-6">
          <h1 className="text-gray-500 font-semibold text-xl">Payment</h1>
          <hr className="w-full opacity-10 my-2" />
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-6 gap-3 my-2">
              {/* Payment For */}
              <div className="col-span-2">
                <label className="text-sm font-semibold mb-1 block">
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
                <label className="text-sm font-semibold mb-1 block">
                  Seminar day
                </label>
                <select
                  name="Seminar_day"
                  className={inpstyleOption}
                  value={form.Seminar_day}
                  onChange={handleChange}
                >
                  <option value="">Select Here</option>
                  {[
                    "For 1st Day ",
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
                <label className="text-sm font-semibold mb-1 block">
                  Registration No.
                </label>
                <input
                  type="number"
                  name="Registration_No"
                  className={inpstyle}
                  value={form.Registration_No}
                  onChange={handleChange}
                  placeholder="Enter Registration No"
                />
              </div>
              {/* Adhar No./Pan no. */}
              <div className="col-span-3">
                <label className="text-sm font-semibold mb-1 block">
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
                <label className="text-sm font-semibold mb-1 block">
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
                  <label className="text-sm font-semibold flex gap-1">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cash payment"
                      checked={paymentMode === "cash payment"}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    Cash Payment
                  </label>
                  <label className="text-sm font-semibold flex gap-1">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="cheque payment"
                      checked={paymentMode === "cheque payment"}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    Cheque Payment
                  </label>
                  <label className="text-sm font-semibold flex gap-1">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="paytm"
                      checked={paymentMode === "paytm"}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    Paytm
                  </label>
                  <label className="text-sm font-semibold flex gap-1">
                    <input
                      type="radio"
                      name="paymentMode"
                      value="NEFT/RTGS"
                      checked={paymentMode === "NEFT/RTGS"}
                      onChange={(e) => setPaymentMode(e.target.value)}
                    />
                    NEFT/RTGS
                  </label>
                  <label className="text-sm font-semibold flex gap-1">
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
                      <label className="text-sm font-semibold mb-1 block">
                        Bank Name <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="bank_name"
                        className={inpstyleOption}
                        value={form.bank_name}
                        onChange={handleChange}
                      >
                        <option value="">Select Bank Name Here...</option>
                        {BankData.map((value, index) => (
                          <option key={index} value={value}>
                            {value}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Cheque No */}
                    <div>
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                      <label className="text-sm font-semibold mb-1 block">
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
                  GENERATE RECEIPT
                </button>
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
              <h3 className="text-base font-medium text-gray-800">
                {data?.name || "AGS"} payment
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
                  <th className="px-4 py-3 font-medium text-gray-700">S.No.</th>
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
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">1.</td>
                  <td className="px-4 py-3">
                    <p
                      onClick={() => navigate("/16th-ags-section/receipt")}
                      className="text-blue-600 hover:underline cursor-pointer font-medium"
                    >
                      Registration No.: AGS/15th/02/093 For Seminar For 2nd Day
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-gray-600">
                      Received payment of Rs. 700 on 10 Jul 25 via Paytm (Txn
                      No: 519132934247) from Dr Y.k Chauhan (Reg. No:
                      AGS/15th/02/093) towards For Seminar registration for the
                      15th Edition of Arogya Sanghoshti Seminar scheduled on 12
                      Jul 2025 at Pragati maidan, New Delhi.
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      className="group px-2 py-1 rounded bg-white cursor-pointer 
                 border border-red-500 
                 hover:bg-red-500 transition"
                    >
                      <MdDelete
                        size={20}
                        className="text-red-500 group-hover:text-white transition"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/*Table Data 2 */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaMessage className="text-gray-500" />
              <h3 className="text-base font-medium text-gray-800">
                {data?.name || "AGS"} payment
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
                    "Payment for",
                    "Amount",
                    "Payment Mode",
                    "Date/Time",
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
                <tr className="border-b border-gray-200 hover:bg-gray-50 ">
                  <td className="px-4 py-3">1.</td>
                  <td className="px-4 py-3">AGS/15th/02/093</td>
                  <td className="px-4 py-3">For Seminar</td>
                  <td className="px-4 py-3">Rs. 700</td>
                  <td className="px-4 py-3">Paytm</td>
                  <td className="px-4 py-3">10 Jul 25 | 10:00 AM</td>
                  <td className="px-4 py-3">
                    <button
                      className="group px-2 py-1 rounded bg-white cursor-pointer 
                 border border-red-500 
                 hover:bg-red-500 transition"
                    >
                      <MdDelete
                        size={20}
                        className="text-red-500 group-hover:text-white transition"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/*Table Data 3*/}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <FaMessage className="text-gray-500" />
              <h3 className="text-base font-medium text-gray-800">
                {data?.name || "AGS"} Cancelled payment
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
                    "Status",
                    "Amount",
                    "Payment Mode",
                    "Date/Time",
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
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">1.</td>
                  <td className="px-4 py-3">AGS/15th/02/093</td>
                  <td className="px-4 py-3">Paid</td>
                  <td className="px-4 py-3">Rs. 700</td>
                  <td className="px-4 py-3">Paytm</td>
                  <td className="px-4 py-3">10 Jul 25 | 10:00 AM</td>
                  <td className="px-4 py-3">
                    <button
                      className="group px-2 py-1 rounded bg-white cursor-pointer 
                 border border-red-500 
                 hover:bg-red-500 transition"
                    >
                      <MdDelete
                        size={20}
                        className="text-red-500 group-hover:text-white transition"
                      />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default AgsPayment;
