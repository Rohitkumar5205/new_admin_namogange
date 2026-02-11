import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getAgsDelegateById,
  updateAgsDelegate,
  clearSingleAgsDelegate,
} from "../../redux/slices/ags/agsDelegateSlice";
import { showError } from "../../utils/toastService";

const AGSEditData = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // This 'id' is used to fetch data for editing.
  const dispatch = useDispatch();
  const { singleDelegate } = useSelector((state) => state.agsDelegate);
  const { user } = useSelector((state) => state.auth);
  const initialDelegateFormData = {
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
    companyCountry: "",
    companyState: "",
    companyCity: "",
    companyPin: "",
  };

  const [formData, setFormData] = useState(initialDelegateFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;

    const restrictions = {
      mobile: { maxLength: 10, numeric: true },
      alternate: { maxLength: 10, numeric: true },
      pin: { maxLength: 6, numeric: true },
      companyPin: { maxLength: 6, numeric: true },
      age: { maxLength: 3, numeric: true },
      landline: { numeric: true },
    };

    if (restrictions[name]) {
      if (restrictions[name].numeric) {
        value = value.replace(/[^0-9]/g, "");
      }
      if (restrictions[name].maxLength && value.length > restrictions[name].maxLength) {
        value = value.slice(0, restrictions[name].maxLength);
      }
    }

    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    let tempErrors = {};
    const phoneRegex = /^\d{10}$/;
    const pinRegex = /^\d{6}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.title?.trim()) tempErrors.title = "Title is required.";
    if (!formData.firstName?.trim()) tempErrors.firstName = "First name is required.";
    if (!formData.lastName?.trim()) tempErrors.lastName = "Last name is required.";
    if (!formData.profession) tempErrors.profession = "Profession is required.";
    if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 120)) {
      tempErrors.age = "Please enter a valid age.";
    }
    if (!formData.event) tempErrors.event = "Event is required.";
    if (!formData.mobile?.trim() || !phoneRegex.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be 10 digits.";
    }
    if (formData.alternate && !phoneRegex.test(formData.alternate)) {
      tempErrors.alternate = "Alternate number must be 10 digits.";
    }
    if (formData.landline && !/^\d+$/.test(formData.landline)) {
      tempErrors.landline = "Landline must only contain digits.";
    }
    if (!formData.email?.trim() || !emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!formData.pin?.trim() || !pinRegex.test(formData.pin)) {
      tempErrors.pin = "PIN code must be 6 digits.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  useEffect(() => {
    if (id) {
      dispatch(getAgsDelegateById(id));
    }
    return () => {
      dispatch(clearSingleAgsDelegate());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (singleDelegate) {
      setFormData(singleDelegate);
    }
  }, [singleDelegate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showError("Please fix the validation errors and try again.");
      return;
    }
    const data = new FormData();
    for (const key in formData) {
      if (key !== "_id" && key !== "__v" && key !== "createdAt" && key !== "updatedAt") {
        data.append(key, formData[key]);
      }
    }
    if (user?._id) {
      data.append("user_id", user._id);
    }

    dispatch(updateAgsDelegate({ id, formData: data }))
      .unwrap()
      .then(() => {
        console.log("Updated Data:", formData);
        alert("Delegate data updated successfully!");
        navigate("/16th-ags-section/delegate-list");
      })
      .catch((err) => {
        console.error("Failed to update delegate:", err);
        alert("Failed to update delegate data.");
      });
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500";

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
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex  gap-3">
            <div className="flex flex-col ">
              <h2 className="text-xl font-semibold text-white ">
               Individual Data Entry
              </h2>
              {/* <p className="text-sm text-blue-100">
                Add new delegate information using the form below. Ensure all required fields are filled out accurately before submitting.
              </p> */}
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate("/16th-ags-section/ags-add-data")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              {" "}
              NEW DELEGATE
            </button>
            <button
              onClick={() => navigate("/16th-ags-section/warm-data")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded ml-2"
            >
              WARM DELEGATES
            </button>
            <button
              onClick={() => navigate("/16th-ags-section/hot-data")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded ml-2"
            >
              HOT DELEGATES
            </button>
              <button
              onClick={() => navigate("/16th-ags-section/delegate-list")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded ml-2"
            >
              CONFIRM DELEGATES
            </button> 
            <button
              onClick={() => navigate("/16th-ags-section/cold-data")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded ml-2"
            >
              COLD DELEGATES
            </button>
          </div>
        </div>
      </div>

<div className="space-y-3 p-5">
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
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Title</option>
              <option value="Mr.">Mr.</option>
              <option value="Ms.">Ms.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
            </select>
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
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
              required
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
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
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
          </div>
          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
              className={inputClass}
            />
            {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
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
            {errors.profession && <p className="text-red-500 text-xs mt-1">{errors.profession}</p>}
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
            {errors.event && <p className="text-red-500 text-xs mt-1">{errors.event}</p>}
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
            {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
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
            {errors.alternate && <p className="text-red-500 text-xs mt-1">{errors.alternate}</p>}
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
            {errors.landline && <p className="text-red-500 text-xs mt-1">{errors.landline}</p>}
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
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
            {errors.pin && <p className="text-red-500 text-xs mt-1">{errors.pin}</p>}
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
              name="companyCountry"
              value={formData.companyCountry}
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
              name="companyState"
              value={formData.companyState}
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
              name="companyCity"
              value={formData.companyCity}
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
              name="companyPin"
              value={formData.companyPin}
              onChange={handleChange}
              placeholder="Pin Code"
              className={inputClass}
            />
            {errors.companyPin && <p className="text-red-500 text-xs mt-1">{errors.companyPin}</p>}
          </div>
          {/* ACTION BUTTONS */}
          <div className="md:col-span-2 flex justify-end gap-6 mt-6">
            <button
              type="button"
              onClick={() => {
                setFormData(initialDelegateFormData);
              }}
              className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-1 text-sm rounded text-white bg-green-600 hover:bg-green-700"
            >
              Update
            </button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default AGSEditData;
