import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AGSEditData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialForm = {
    title: "",
    firstName: "",
    lastName: "",
    profession: "",
    age: "",
    event: "",
    mobile: "",
    alternate: "",
    landline: "",
    email: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pin: "",
    category: "",
    college: "",
    university: "",
    enquiryFor: "",
    leadForward: "",
    source: "",
    mode: "",
    status: "",
    coordinator: "",
    remark: "",
    // Business Fields
    companyName: "",
    companyAddress: "",
    country1: "",
    state1: "",
    city1: "",
    pin1: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    // Fetch data by ID here if needed
    if (id) {
      console.log("Fetching data for ID:", id);
      // setFormData(fetchedData);
    }
  }, [id]);
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    alert("Data updated successfully!");
    // navigate("/16th-ags-section/delegate-list");
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <div>
          <h2 className="text-lg font-medium text-gray-800">Edit Data</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/16th-ags-section/ags-add-data")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            NEW DELEGATE
          </button>
          <button
            onClick={() => navigate("/16th-ags-section/warm-data")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            WARM DELEGATES
          </button>
          <button
            onClick={() => navigate("/16th-ags-section/hot-data")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            HOT DELEGATES
          </button>
          <button
            // onClick={() => navigate("/16th-ags-section/cold-data")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            CONFIRM DELEGATES
          </button>
          <button
            onClick={() => navigate("/16th-ags-section/cold-data")}
            className="bg-blue-400 hover:bg-blue-500 text-sm text-white font-normal py-1 px-3 rounded"
          >
            COLD DELEGATES
          </button>
        </div>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          Edit Delegate Information
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-5 gap-4"
        >
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Mr/Mrs/Ms"
              className={inputClass}
              required
            />
          </div>
          {/* First Name */}{" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First Name"
              className={inputClass}
            />
          </div>
          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Last Name"
              className={inputClass}
              required
            />
          </div>
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className={inputClass}
            />
          </div>
          {/* Profession */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profession <span className="text-red-500">*</span>
            </label>
            <select
              name="profession"
              value={formData.profession}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Profession</option>
              <option value="Service">Service</option>
              <option value="Business">Business</option>
              <option value="Student">Student</option>
            </select>
          </div>
          {/* Event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event <span className="text-red-500">*</span>
            </label>
            <select
              name="event"
              value={formData.event}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Event</option>
              <option value="Event 1">Event 1</option>
              <option value="Event 2">Event 2</option>
            </select>
          </div>
          {/* Mobile */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Mobile"
              className={inputClass}
              required
            />
          </div>
          {/* Alternate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternate No.
            </label>
            <input
              type="text"
              name="alternate"
              value={formData.alternate}
              onChange={handleChange}
              placeholder="Alternate"
              className={inputClass}
            />
          </div>
          {/* Landline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Landline No.
            </label>
            <input
              type="text"
              name="landline"
              value={formData.landline}
              onChange={handleChange}
              placeholder="Landline"
              className={inputClass}
            />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className={inputClass}
              required
            />
          </div>
          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className={inputClass}
            />
          </div>
          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
            </select>
          </div>
          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select State</option>
              <option value="Delhi">Delhi</option>
              <option value="UP">UP</option>
            </select>
          </div>
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select City</option>
              <option value="New Delhi">New Delhi</option>
              <option value="Noida">Noida</option>
            </select>
          </div>
          {/* Pin */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={handleChange}
              placeholder="Pin Code"
              className={inputClass}
              required
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Category</option>
              <option value="Cat1">Cat1</option>
            </select>
          </div>
          {/* College */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College <span className="text-red-500">*</span>
            </label>
            <select
              name="college"
              value={formData.college}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select College</option>
              <option value="College1">College1</option>
            </select>
          </div>
          {/* University */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University <span className="text-red-500">*</span>
            </label>
            <select
              name="university"
              value={formData.university}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select University</option>
              <option value="Uni1">Uni1</option>
            </select>
          </div>
          {/* Enquiry For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enquiry For <span className="text-red-500">*</span>
            </label>
            <select
              name="enquiryFor"
              value={formData.enquiryFor}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Enquiry For</option>
              <option value="Option1">Option1</option>
            </select>
          </div>
          {/* Lead Forward */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lead Forward To <span className="text-red-500">*</span>
            </label>
            <select
              name="leadForward"
              value={formData.leadForward}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Lead Forward</option>
              <option value="Option1">Option1</option>
            </select>
          </div>
          {/* Source */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source/Sub Coordinator <span className="text-red-500">*</span>
            </label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Source</option>
              <option value="Social Media">Social Media</option>
              <option value="Website">Website</option>
            </select>
          </div>
          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mode of Lead <span className="text-red-500">*</span>
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Mode</option>
              <option value="Online">Online</option>
              <option value="Offline">Offline</option>
            </select>
          </div>
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {/* Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Coordinator/Referral <span className="text-red-500">*</span>
            </label>
            <select
              name="coordinator"
              value={formData.coordinator}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Coordinator</option>
              <option value="Coord1">Coord1</option>
            </select>
          </div>
          {/* Remark */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remark by Admin | Director <span className="text-red-500">*</span>
            </label>
            <textarea
              name="remark"
              value={formData.remark}
              onChange={handleChange}
              placeholder="Enter remarks"
              className={inputClass}
              rows={1}
              required
            />
          </div>
          {/* Business Fields Header */}
          <div className="md:col-span-5">
            <h4 className="text-md font-medium text-gray-800 border-b pb-1">
              Business Details
            </h4>
          </div>
          {/* Company Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Company Name"
              className={inputClass}
            />
          </div>
          {/* Company Address */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Address
            </label>
            <input
              type="text"
              name="companyAddress"
              value={formData.companyAddress}
              onChange={handleChange}
              placeholder="Company Address"
              className={inputClass}
            />
          </div>
          {/* Country1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <select
              name="country1"
              value={formData.country1}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select Country</option>
              <option value="India">India</option>
            </select>
          </div>
          {/* State1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State
            </label>
            <select
              name="state1"
              value={formData.state1}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select State</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>
          {/* City1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <select
              name="city1"
              value={formData.city1}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">Select City</option>
              <option value="New Delhi">New Delhi</option>
            </select>
          </div>
          {/* Pin1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Code
            </label>
            <input
              type="text"
              name="pin1"
              value={formData.pin1}
              onChange={handleChange}
              placeholder="Pin Code"
              className={inputClass}
            />
          </div>
          {/* ACTION BUTTONS */}
          <div className="md:col-span-2 flex justify-end gap-6 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData(initialForm);
              }}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-1.5 text-sm rounded text-white bg-green-600 hover:bg-green-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AGSEditData;
