import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createAgsDelegate } from "../../redux/slices/ags/agsDelegateSlice";
import { showError, showSuccess } from "../../utils/toastService";
import { getAllProfessions } from "../../redux/slices/add_by_admin/professionSlice";
import { getAllAGSEvents } from "../../redux/slices/add_by_admin/agsEventSlice";
import { getAllColleges } from "../../redux/slices/college/collegeSlice";
import { getAllUniversities } from "../../redux/slices/add_by_admin/universitySlice";
import { getAllEnquiries } from "../../redux/slices/add_by_admin/enquirySlice";

const AGSAddData = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colleges } = useSelector((state) => state.college);
  const { user } = useSelector((state) => state.auth);
  const { professions } = useSelector((state) => state.profession);
  // console.log("Professions from Redux:", professions);
  const { agsEvents } = useSelector((state) => state.agsEvent);
  // console.log("AGS Events from Redux:", agsEvents);
  const { universities } = useSelector((state) => state.university);
  const { enquiries } = useSelector((state) => state.enquiry);

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
    // leadForward: "",
    // source: "",
    mode: "",
    status: "Active",
    coordinator: "",
    remark: "",
    // Business Fields
    companyName: "",
    companyAddress: "",
    companyCountry: "",
    companyState: "",
    companyCity: "",
    companyPin: "",
    clientStatus: "",
    updatedStatusBy: "",
  };
  const [formData, setFormData] = useState(initialDelegateFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(getAllProfessions());
    dispatch(getAllAGSEvents());
    dispatch(getAllColleges());
    dispatch(getAllUniversities());
    dispatch(getAllEnquiries());
  }, [dispatch]);

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
      if (
        restrictions[name].maxLength &&
        value.length > restrictions[name].maxLength
      ) {
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

    if (!formData?.title?.trim()) tempErrors.title = "Title is required.";
    if (!formData?.firstName?.trim())
      tempErrors.firstName = "First name is required.";
    if (!formData?.lastName?.trim())
      tempErrors.lastName = "Last name is required.";
    if (!formData?.profession)
      tempErrors.profession = "Profession is required.";
    if (
      formData?.age &&
      (isNaN(formData.age) || formData.age < 1 || formData.age > 120)
    ) {
      tempErrors.age = "Please enter a valid age.";
    }
    if (!formData?.event) tempErrors.event = "Event is required.";
    if (!formData?.mobile?.trim() || !phoneRegex.test(formData.mobile)) {
      tempErrors.mobile = "Mobile number must be 10 digits.";
    }
    if (formData?.alternate && !phoneRegex.test(formData.alternate)) {
      tempErrors.alternate = "Alternate number must be 10 digits.";
    }
    if (formData?.landline && !/^\d+$/.test(formData.landline)) {
      tempErrors.landline = "Landline must only contain digits.";
    }
    if (!formData?.email?.trim() || !emailRegex.test(formData.email)) {
      tempErrors.email = "Invalid email format.";
    }
    if (!formData?.country) tempErrors.country = "Country is required.";
    if (!formData?.state) tempErrors.state = "State is required.";
    if (!formData?.city) tempErrors.city = "City is required.";
    if (!formData?.pin?.trim() || !pinRegex.test(formData.pin)) {
      tempErrors.pin = "PIN code must be 6 digits.";
    }

    if (formData?.companyPin && !pinRegex.test(formData.companyPin)) {
      tempErrors.companyPin = "Company PIN code must be 6 digits.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      showError("Please fix the validation errors and try again.");
      return;
    }
    const data = { ...formData };

    const authUser = user || JSON.parse(localStorage.getItem("user"));
    const userId = authUser?._id || authUser?.id;
    if (userId) {
      data.user_id = userId;
    }

    // Add .get() method to support Redux slice expecting FormData
    data.get = (key) => data[key];

    console.log("Submitting Delegate Data:", data);
    dispatch(createAgsDelegate(data))
      .unwrap()
      .then(() => {
        console.log("Submitted Data:", formData);
        showSuccess("Delegate submitted successfully!");
        setFormData(initialDelegateFormData);
        navigate("/16th-ags-section/new-data");
      })
      .catch((err) => {
        console.error("Failed to create delegate:", err);
        showError("Failed to submit delegate data.");
      });
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="">
      {/* ================= HEADER ================= */}

      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300"
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
              onClick={() => navigate("/16th-ags-section/delegate-list")}
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
            Add Delegate Information
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
                value={formData?.title || ""}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select Title</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Ms">Ms</option>
                <option value="Dr">Dr</option>
                <option value="Prof">Prof</option>
              </select>

              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
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
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}
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
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}
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
              {errors.age && (
                <p className="text-red-500 text-xs mt-1">{errors.age}</p>
              )}
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
                {professions?.map((prof) => (
                  <option key={prof._id} value={prof.name}>
                    {prof.name}
                  </option>
                ))}
              </select>
              {errors.profession && (
                <p className="text-red-500 text-xs mt-1">{errors.profession}</p>
              )}
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
                {agsEvents?.map((event) => (
                  <option key={event._id} value={event.name}>
                    {event.name}
                  </option>
                ))}
              </select>
              {errors.event && (
                <p className="text-red-500 text-xs mt-1">{errors.event}</p>
              )}
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
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
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
              {errors.alternate && (
                <p className="text-red-500 text-xs mt-1">{errors.alternate}</p>
              )}
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
              {errors.landline && (
                <p className="text-red-500 text-xs mt-1">{errors.landline}</p>
              )}
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
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
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
                <option value="USA">USA</option>
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">{errors.country}</p>
              )}
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
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
              </select>
              {errors.state && (
                <p className="text-red-500 text-xs mt-1">{errors.state}</p>
              )}
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
                <option value="Gurgaon">Gurgaon</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Mumbai">Mumbai</option>
              </select>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
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
              {errors.pin && (
                <p className="text-red-500 text-xs mt-1">{errors.pin}</p>
              )}
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
                <option value="Agriculture">Agriculture</option>
                <option value="Asscociations">Asscociations</option>
                <option value="Ayurveda">Ayurveda</option>
                <option value="Bio-Technology">Bio-Technology</option>
                <option value="College">College</option>
                <option value="Corporate">Corporate</option>
                <option value="Govt.Departments">Govt.Departments</option>
                <option value="Hospital">Hospital</option>
                <option value="Naturopathy">Naturopathy</option>
                <option value="NGO">NGO</option>
                <option value="Pharmaceutical">Pharmaceutical</option>
                <option value="Research">Research</option>
                <option value="University">University</option>
                <option value="Yoga">Yoga</option>
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
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
                {colleges
                  ?.filter((college) => college.status === "Active")
                  .map((college) => (
                    <option key={college._id} value={college.college_name}>
                      {college.college_name}
                    </option>
                  ))}
              </select>
              {errors.college && (
                <p className="text-red-500 text-xs mt-1">{errors.college}</p>
              )}
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

                {universities
                  ?.filter((uni) => uni.status === "Active")
                  .map((uni) => (
                    <option key={uni._id} value={uni.name}>
                      {uni.name}
                    </option>
                  ))}
              </select>

              {errors.university && (
                <p className="text-red-500 text-xs mt-1">{errors.university}</p>
              )}
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
                {enquiries
                  ?.filter((enq) => enq.status === "Active")
                  .map((enq) => (
                    <option key={enq._id} value={enq.name}>
                      {enq.name}
                    </option>
                  ))}
              </select>
              {errors.enquiryFor && (
                <p className="text-red-500 text-xs mt-1">{errors.enquiryFor}</p>
              )}
            </div>
            {/* Lead Forward */}
            {/* <div>
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
            {errors.leadForward && <p className="text-red-500 text-xs mt-1">{errors.leadForward}</p>}
          </div> */}
            {/* Source */}
            {/* <div>
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
            {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source}</p>}
          </div> */}
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
                <option value="Organic">Organic</option>
                <option value="Paid">Paid</option>
                <option value="Other">Other</option>
              </select>
              {errors.mode && (
                <p className="text-red-500 text-xs mt-1">{errors.mode}</p>
              )}
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
                Main Coordinator/Referral{" "}
                <span className="text-red-500">*</span>
              </label>
              {/* <select
              name="coordinator"
              value={formData.coordinator}
              onChange={handleChange}
              className={inputClass}
              required
            >
              <option value="">Select Coordinator</option>
              <option value="Coord1">Coord1</option>
            </select> */}
              <input
                type="text"
                name="coordinator"
                value={formData.coordinator}
                onChange={handleChange}
                placeholder="Coordinator Name"
                className={inputClass}
                required
              />
              {errors.coordinator && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.coordinator}
                </p>
              )}
            </div>
            {/* Remark */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remark by Admin | Director{" "}
                <span className="text-red-500">*</span>
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
              {errors.remark && (
                <p className="text-red-500 text-xs mt-1">{errors.remark}</p>
              )}
            </div>
            {/* Business Fields Header */}
            <div className="md:col-span-5">
              <h4 className="text-md font-medium text-gray-800 border-b ">
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
                <option value="USA">USA</option>
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
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Haryana">Haryana</option>
                <option value="Punjab">Punjab</option>
                <option value="Maharashtra">Maharashtra</option>
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
                <option value="Noida">Noida</option>
                <option value="Gurgaon">Gurgaon</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Mumbai">Mumbai</option>
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
              {errors.companyPin && (
                <p className="text-red-500 text-xs mt-1">{errors.companyPin}</p>
              )}
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
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AGSAddData;
