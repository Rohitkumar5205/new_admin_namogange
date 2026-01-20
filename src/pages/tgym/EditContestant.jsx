import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TgymEditData = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const initialForm = {
    title: "",
    name: "",
    surname: "",
    gender: "",
    event: "",
    profession: "",
    age: "",
    category: "",
    email_address: "",
    mobile_number: "",
    alternate_mobile_number: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pinCode: "",
    contestants_type: "",
    university: "",
    college_name: "",
    coordinator: "",
    sub_coordinator: "",
    enquiry_for: "",
    status: "",
    description: "",
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
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <div>
          <h2 className="text-lg font-medium text-gray-800">
            Contestant Edit Data
          </h2>
        </div>
        {/* <div className="flex gap-2">
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
        </div> */}
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          Edit Contestant Information
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
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
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
              <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder=" Name"
              className={inputClass}
              required
            />
          </div>
          {/* Surname */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Surname <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              placeholder="Surname"
              className={inputClass}
              required
            />
          </div>
          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Age"
              className={inputClass}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Event */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="event"
              value={formData.event}
              onChange={handleChange}
              placeholder="Event"
              className={inputClass}
              required
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
          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email_address"
              value={formData.email_address}
              onChange={handleChange}
              placeholder="Email Address"
              className={inputClass}
              required
            />
          </div>
          {/* Alternate */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobile_number"
              value={formData.mobile_number}
              onChange={handleChange}
              placeholder="Mobile Number"
              className={inputClass}
              required
            />
          </div>
          {/* Alternate Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alternate Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="alternate_mobile_number"
              value={formData.alternate_mobile_number}
              onChange={handleChange}
              placeholder="Landline"
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
              required
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
          {/* pinCode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pinCode"
              value={formData.pinCode}
              onChange={handleChange}
              placeholder="pinCode"
              className={inputClass}
              required
            />
          </div>
          {/* Contestants Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contestants Type <span className="text-red-500">*</span>
            </label>
            <select
              name="contestants_type"
              value={formData.contestants_type}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Type</option>
              <option value="Individual">Individual</option>
              <option value="Group">Group</option>
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
          {/* College Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              College Name <span className="text-red-500">*</span>
            </label>
            <select
              name="college_name"
              value={formData.college_name}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select College</option>
              <option value="College1">College1</option>
            </select>
          </div>
          {/* Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordinator <span className="text-red-500">*</span>
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
          {/* Sub Coordinator */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Source/Sub Coordinator <span className="text-red-500">*</span>
            </label>
            <select
              name="sub_coordinator"
              value={formData.sub_coordinator}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Source</option>
              <option value="">Select Sub Coordinator</option>
              <option value="SubCoord1">SubCoord1</option>
            </select>
          </div>
          {/* Enquiry For */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Enquiry For <span className="text-red-500">*</span>
            </label>
            <select
              name="enquiry_for"
              value={formData.enquiry_for}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Enquiry For</option>
              <option value="Option1">Option1</option>
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

          {/* Description */}
          <div className="md:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter description"
              className={inputClass}
              rows={4}
              required
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="md:col-span-4 flex justify-end gap-6">
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

export default TgymEditData;
