import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const AddMember = () => {
  const navigate = useNavigate();
  const initialFormState = {
    title: "",
    applicant_name: "",
    surname: "",
    father_name: "",
    gender: "",
    qualification: "",
    occupation: "",
    organisation_type: "",
    designation: "",
    dob: "",
    mobile: "",
    alternate_mobile: "",
    email: "",
    aadhaar: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    blood_group: "",
    emergency_relation: "",
    emergency_contact: "",
    initiatives: [],
    volunteering_for: "",
    networking_for: "",
    area_of_interest: "",
    monetary_support: "",
    ref1_name: "",
    ref1_mobile: "",
    ref1_email: "",
    ref2_name: "",
    ref2_mobile: "",
    ref2_email: "",
    profile_image: null,
  };
  const [formData, setFormData] = useState(initialFormState);
  const [isEdit, setIsEdit] = useState(false);

  const { isFormDisabled } = useRoleRights(PageNames.ADD_MEMBER);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    // Validation: Only allow numbers for Mobile, Pincode, and Aadhaar
    if (
      ["mobile", "alternate_mobile", "ref1_mobile", "ref2_mobile"].includes(
        name
      ) &&
      !/^\d{0,10}$/.test(value)
    ) {
      return;
    }

    if (name === "pincode" && !/^\d{0,6}$/.test(value)) return;
    if (name === "aadhaar" && !/^\d{0,12}$/.test(value)) return;

    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleCheckbox = (value) => {
    setFormData((prev) => ({
      ...prev,
      initiatives: prev.initiatives.includes(value)
        ? prev.initiatives.filter((i) => i !== value)
        : [...prev.initiatives, value],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      console.log("UPDATE DATA 👉", formData);
      alert("Member updated successfully ✅");
    } else {
      console.log("SUBMIT DATA 👉", formData);
      alert("Member Added Successfully ✅");
    }

    setFormData(initialFormState);
    setIsEdit(false);
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="">
      {/* HEADER */}

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
               Add Member Registration
              </h2>
              <p className="text-sm text-blue-100">
                Fill in the details below to add a new member to the Namo Gange Trust.
              </p>
            </div>
          </div>
          <div>
            <button
             onClick={() => navigate("/member/member-list")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              {" "}
              Member List
            </button>
          </div>
        </div>
      </div>

       <div className="space-y-3 p-5">
      {/* FORM */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Member" : "Add New Member"}
        </h3>
        <form
          onSubmit={handleSubmit}
          className={`grid grid-cols-1 md:grid-cols-6 gap-4  ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
        >
          {/* BASIC DETAILS */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <select
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isFormDisabled}
            >
              <option value="">Select Title</option>
              <option>Mr</option>
              <option>Mrs</option>
              <option>Ms</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Applicant's Name <span className="text-red-500">*</span>
            </label>
            <input
              name="applicant_name"
              value={formData.applicant_name}
              placeholder="Applicant's Name"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Surname <span className="text-red-500">*</span>
            </label>
            <input
              name="surname"
              value={formData.surname}
              placeholder="Surname"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Father's Name <span className="text-red-500">*</span>
            </label>
            <input
              name="father_name"
              value={formData.father_name}
              placeholder="Father's Name"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Gender <span className="text-red-500">*</span>
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isFormDisabled}
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Qualification <span className="text-red-500">*</span>
            </label>
            <input
              name="qualification"
              value={formData.qualification}
              placeholder="Qualification"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Occupation <span className="text-red-500">*</span>
            </label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isFormDisabled}
            >
              <option value="">Occupation</option>
              <option>Service</option>
              <option>Business</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Organisation Type <span className="text-red-500">*</span>
            </label>
            <select
              name="organisation_type"
              value={formData.organisation_type}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isFormDisabled}
            >
              <option value="">Organisation Type</option>
              <option>Private</option>
              <option>Government</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Designation <span className="text-red-500">*</span>
            </label>
            <select
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              className={inputClass}
              required
              disabled={isFormDisabled}
            >
              <option value="">Designation</option>
              <option>Manager</option>
              <option>Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Mobile <span className="text-red-500">*</span>
            </label>
            {/* CONTACT */}
            <input
              name="mobile"
              value={formData.mobile}
              placeholder="Mobile No"
              maxLength={10}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Alternate Mobile <span className="text-red-500">*</span>
            </label>
            <input
              name="alternate_mobile"
              value={formData.alternate_mobile}
              placeholder="Alternate No"
              maxLength={10}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              name="email"
              value={formData.email}
              placeholder="Email Address"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Aadhaar <span className="text-red-500">*</span>
            </label>
            <input
              name="aadhaar"
              value={formData.aadhaar}
              placeholder="Aadhaar / ID Proof No"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div className="col-span-3">
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              name="address"
              value={formData.address}
              placeholder="Complete Address"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          {/* LOCATION */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Country <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              value={formData.country}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            >
              <option value="">Country</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              name="state"
              value={formData.state}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            >
              <option value="">State</option>
              <option>Uttar Pradesh</option>
              <option>Haryana</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              City <span className="text-red-500">*</span>
            </label>
            <select
              name="city"
              value={formData.city}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            >
              <option value="">City</option>
              <option>Lucknow</option>
              <option>Gurgaon</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Pin Code <span className="text-red-500">*</span>
            </label>
            <input
              name="pincode"
              value={formData.pincode}
              placeholder="Pin Code"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Blood Group <span className="text-red-500">*</span>
            </label>
            <select
              name="blood_group"
              value={formData.blood_group}
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            >
              <option value="">Select Blood Group</option>

              {/* A Group */}
              <option value="A+">A+</option>
              <option value="A-">A−</option>

              {/* B Group */}
              <option value="B+">B+</option>
              <option value="B-">B−</option>

              {/* AB Group */}
              <option value="AB+">AB+</option>
              <option value="AB-">AB−</option>

              {/* O Group */}
              <option value="O+">O+</option>
              <option value="O-">O−</option>
            </select>
          </div>

          {/* EMERGENCY */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Emergency Relation <span className="text-red-500">*</span>
            </label>
            <input
              name="emergency_relation"
              value={formData.emergency_relation}
              placeholder="Emergency Relation"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Emergency Contact <span className="text-red-500">*</span>
            </label>
            <input
              name="emergency_contact"
              value={formData.emergency_contact}
              placeholder="Emergency Contact"
              className={inputClass}
              onChange={handleChange}
              required
              disabled={isFormDisabled}
            />
          </div>

          {/* INITIATIVES */}
          <div className="col-span-6">
            <h4 className="text-center text-gray-800 text-[15px] font-medium">
              Initiatives of Namo Gange Trust
            </h4>

            <hr className="w-full border-t-1 border-gray-300 my-2" />

            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Aviral Ganga <span className="text-red-500">*</span>
            </h3>
            <hr className="w-full border-t-1 border-gray-300 mb-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-2 text-sm">
              <label
                htmlFor="arogya-sangoshti"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="arogya-sangoshti"
                  type="checkbox"
                  checked={formData.initiatives.includes("Arogya Sangoshti")}
                  onChange={() => handleCheckbox("Arogya Sangoshti")}
                  disabled={isFormDisabled}
                />
                Arogya Sangoshti
              </label>

              <label
                htmlFor="panchkarma"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="panchkarma"
                  type="checkbox"
                  checked={formData.initiatives.includes("Panchkarma Clinic")}
                  onChange={() => handleCheckbox("Panchkarma Clinic")}
                  disabled={isFormDisabled}
                />
                Panchkarma Clinic
              </label>

              <label
                htmlFor="grand-master"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="grand-master"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "The Grand Master of Yoga"
                  )}
                  onChange={() => handleCheckbox("The Grand Master of Yoga")}
                  disabled={isFormDisabled}
                />
                The Grand Master of Yoga
              </label>

              <label
                htmlFor="film-festival"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="film-festival"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Arogya Film Festival"
                  )}
                  onChange={() => handleCheckbox("Arogya Film Festival")}
                  disabled={isFormDisabled}
                />
                Arogya Film Festival
              </label>

              <label
                htmlFor="rangshala"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="rangshala"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Bachchon Ki Rangshala"
                  )}
                  onChange={() => handleCheckbox("Bachchon Ki Rangshala")}
                  disabled={isFormDisabled}
                />
                Bachchon Ki Rangshala
              </label>

              <label
                htmlFor="bhagwat"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="bhagwat"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Shrimad Bhagwat Katha"
                  )}
                  onChange={() => handleCheckbox("Shrimad Bhagwat Katha")}
                  disabled={isFormDisabled}
                />
                Shrimad Bhagwat Katha
              </label>

              <label
                htmlFor="jobs"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="jobs"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "The Yogshalajobs.com"
                  )}
                  onChange={() => handleCheckbox("The Yogshalajobs.com")}
                  disabled={isFormDisabled}
                />
                The Yogshalajobs.com
              </label>

              <label
                htmlFor="ayush-mitra"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="ayush-mitra"
                  type="checkbox"
                  checked={formData.initiatives.includes("Ayush Mitra")}
                  onChange={() => handleCheckbox("Ayush Mitra")}
                  disabled={isFormDisabled}
                />
                Ayush Mitra
              </label>

              <label
                htmlFor="icoa"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="icoa"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Indian Contemporary Art (ICOA)"
                  )}
                  onChange={() =>
                    handleCheckbox("Indian Contemporary Art (ICOA)")
                  }
                  disabled={isFormDisabled}
                />
                Indian Contemporary Art (ICOA)
              </label>

              <label
                htmlFor="swachh-bharat"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="swachh-bharat"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Swachh Bharat Sankalp"
                  )}
                  onChange={() => handleCheckbox("Swachh Bharat Sankalp")}
                  disabled={isFormDisabled}
                />
                Swachh Bharat Sankalp
              </label>

              <label
                htmlFor="expo"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="expo"
                  type="checkbox"
                  checked={formData.initiatives.includes("The Yogshala Expo")}
                  onChange={() => handleCheckbox("The Yogshala Expo")}
                  disabled={isFormDisabled}
                />
                The Yogshala Expo
              </label>

              <label
                htmlFor="ann-sewa"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="ann-sewa"
                  type="checkbox"
                  checked={formData.initiatives.includes("Ann Sewa")}
                  onChange={() => handleCheckbox("Ann Sewa")}
                  disabled={isFormDisabled}
                />
                Ann Sewa
              </label>

              <label
                htmlFor="meri-beti"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="meri-beti"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Meri Beti Mera Abhimaan"
                  )}
                  onChange={() => handleCheckbox("Meri Beti Mera Abhimaan")}
                  disabled={isFormDisabled}
                />
                Meri Beti Mera Abhimaan
              </label>

              <label
                htmlFor="clinic"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="clinic"
                  type="checkbox"
                  checked={formData.initiatives.includes("The Yogshala Clinic")}
                  onChange={() => handleCheckbox("The Yogshala Clinic")}
                  disabled={isFormDisabled}
                />
                The Yogshala Clinic
              </label>

              <label
                htmlFor="acharya"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="acharya"
                  type="checkbox"
                  checked={formData.initiatives.includes("AcharyajiOnline.com")}
                  onChange={() => handleCheckbox("AcharyajiOnline.com")}
                  disabled={isFormDisabled}
                />
                AcharyajiOnline.com
              </label>

              <label
                htmlFor="ngt-farms"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="ngt-farms"
                  type="checkbox"
                  checked={formData.initiatives.includes("NGT Farms")}
                  onChange={() => handleCheckbox("NGT Farms")}
                  disabled={isFormDisabled}
                />
                NGT Farms
              </label>

              <label
                htmlFor="vaidyashala"
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="vaidyashala"
                  type="checkbox"
                  checked={formData.initiatives.includes("Vaidhyashala Clinic")}
                  onChange={() => handleCheckbox("Vaidhyashala Clinic")}
                  disabled={isFormDisabled}
                />
                Vaidhyashala Clinic
              </label>

              <label
                htmlFor="swachh-ghaziabad"
                className="flex items-center gap-2 cursor-pointer col-span-2"
              >
                <input
                  id="swachh-ghaziabad"
                  type="checkbox"
                  checked={formData.initiatives.includes(
                    "Swachh Ghaziabad Swasth Ghaziabad"
                  )}
                  onChange={() =>
                    handleCheckbox("Swachh Ghaziabad Swasth Ghaziabad")
                  }
                  disabled={isFormDisabled}
                />
                Swachh Ghaziabad Swasth Ghaziabad
              </label>
            </div>
          </div>

          {/* Area Of Contribution And Support */}
          <div className="col-span-6">
            <h4 className="text-center text-gray-800 text-[15px] font-medium">
              Area Of Contribution And Support
            </h4>

            <hr className="w-full border-t-1 border-gray-300 my-2" />

            <h3 className="font-medium text-sm text-gray-700 mb-2">
              Volunteering For <span className="text-red-500">*</span>
            </h3>
            <hr className="w-full border-t-1 border-gray-300" />
            <div className="grid md:grid-cols-4 gap-3 text-sm mt-1">
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="volunteering_for"
                  value="7_days"
                  checked={formData.volunteering_for === "7_days"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  required
                  disabled={isFormDisabled}
                />
                7 Days in a Month
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="volunteering_for"
                  value="15_days"
                  checked={formData.volunteering_for === "15_days"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                15 Days in a Month
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="volunteering_for"
                  value="weekends"
                  checked={formData.volunteering_for === "weekends"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Weekends
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="volunteering_for"
                  value="specific_events"
                  checked={formData.volunteering_for === "specific_events"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Specific Events & Campaigns
              </label>
            </div>
            <h3 className="font-medium text-sm text-gray-700 py-2">
              Networking For <span className="text-red-500">*</span>
            </h3>
            <hr className="w-full border-t-1 border-gray-300" />
            <div className="grid md:grid-cols-4 gap-3 text-sm mt-1">
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="networking_for"
                  value="ngt_membership"
                  checked={formData.networking_for === "ngt_membership"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  required
                  disabled={isFormDisabled}
                />
                NGT Membership
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="networking_for"
                  value="partnership"
                  checked={formData.networking_for === "partnership"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Partnership
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="networking_for"
                  value="associations"
                  checked={formData.networking_for === "associations"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Associations
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="networking_for"
                  value="awareness_drives"
                  checked={formData.networking_for === "awareness_drives"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Awareness Drives
              </label>
            </div>
            <h3 className="font-medium text-sm text-gray-700 py-2">
              Area Of Interest <span className="text-red-500">*</span>
            </h3>
            <hr className="w-full border-t-1 border-gray-300" />
            <div className="grid md:grid-cols-4 gap-3 text-sm mt-1">
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="area_of_interest"
                  value="health_education"
                  checked={formData.area_of_interest === "health_education"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  required
                  disabled={isFormDisabled}
                />
                Health & Education
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="area_of_interest"
                  value="art_culture"
                  checked={formData.area_of_interest === "art_culture"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Art & Culture
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="area_of_interest"
                  value="environment"
                  checked={formData.area_of_interest === "environment"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Environment
              </label>

              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="area_of_interest"
                  value="women_empowerment"
                  checked={formData.area_of_interest === "women_empowerment"}
                  onChange={handleChange}
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Women Empowerment
              </label>
            </div>
            <h3 className="font-medium text-sm text-gray-700 py-2">
              Monetary Support <span className="text-red-500">*</span>
            </h3>
            <hr className="w-full border-t-1 border-gray-300" />
            <div className="grid md:grid-cols-4 gap-3 text-sm mt-1">
              {/* Donation */}
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="monetary_support"
                  checked={formData.monetary_support === "donation"}
                  onChange={handleChange}
                  value="donation"
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Donation
              </label>

              {/* Charity */}
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="monetary_support"
                  checked={formData.monetary_support === "charity"}
                  onChange={handleChange}
                  value="charity"
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Charity
              </label>

              {/* Sponsorships */}
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="monetary_support"
                  checked={formData.monetary_support === "sponsorships"}
                  onChange={handleChange}
                  value="sponsorships"
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Sponsorships
              </label>

              {/* Fund Raising Activities */}
              <label className="flex items-center gap-2 cursor-pointer ">
                <input
                  type="radio"
                  name="monetary_support"
                  checked={
                    formData.monetary_support === "fund_raising_activities"
                  }
                  onChange={handleChange}
                  value="fund_raising_activities"
                  className="accent-[#DF562C]"
                  disabled={isFormDisabled}
                />
                Fund Raising Activities
              </label>
            </div>
          </div>

          {/* REFERENCES */}
          <div className="col-span-6">
            <h4 className="text-center text-gray-800 text-[15px] font-medium">
              Name Of Two References
            </h4>
            <hr className="w-full border-t-1 border-gray-300 my-2" />

            <div className="grid md:grid-cols-6 gap-3 text-sm mt-1">
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Ref1_Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="ref1_name"
                  value={formData.ref1_name}
                  placeholder="Reference 1 Name"
                  className={inputClass}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Ref1_mobile <span className="text-red-500">*</span>
                </label>
                <input
                  name="ref1_mobile"
                  value={formData.ref1_mobile}
                  placeholder="Reference 1 Mobile"
                  className={inputClass}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Ref1_Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="ref1_email"
                  value={formData.ref1_email}
                  placeholder="Reference 1 Email"
                  className={inputClass}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Ref2_Name <span className="text-red-500">*</span>
                </label>
                <input
                  name="ref2_name"
                  value={formData.ref2_name}
                  placeholder="Reference 2 Name"
                  className={inputClass}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Ref2_mobile <span className="text-red-500">*</span>
                </label>
                <input
                  name="ref2_mobile"
                  value={formData.ref2_mobile}
                  placeholder="Reference 2 Mobile"
                  className={inputClass}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Ref2_Email <span className="text-red-500">*</span>
                </label>
                <input
                  name="ref2_email"
                  value={formData.ref2_email}
                  placeholder="Reference 2 Email"
                  className={inputClass}
                  onChange={handleChange}
                  required
                  disabled={isFormDisabled}
                />
              </div>
            </div>
          </div>

          {/* Image & Buttons  */}
          <div className="col-span-6">
            <h4 className="text-center text-gray-800 text-[15px] font-medium">
              Profile Image & Buttons
            </h4>
            <hr className="w-full border-t-1 border-gray-300 my-2" />
            <div className="col-span-6 flex justify-between items-end">
              <div className="">
                <label className="block text-sm text-gray-700 font-medium mb-1">
                  Profile Image <span className="text-red-500">*</span>
                </label>

                <div className="relative w-full">
                  <input
                    type="file"
                    key={formData.profile_image ? "loaded" : "empty"}
                    name="profile_image"
                    accept="image/*"
                    onChange={handleChange}
                    required
                    disabled={isFormDisabled}
                    className={` w-full text-sm text-gray-700
        file:mr-4 file:py-1 file:px-4
        file:rounded file:border-0
        file:text-sm file:font-medium
        file:bg-gray-100 file:text-gray-700
        hover:file:bg-gray-200
        border border-gray-300 rounded
        cursor-pointer focus:outline-none
        focus:ring-1 focus:ring-blue-500
        ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
                  />
                </div>

                {formData.profile_image && (
                  <p className="mt-1 text-xs text-green-600 font-medium">
                    Selected: {formData.profile_image.name}
                  </p>
                )}
              </div>

              {/* SUBMIT */}
              <div className=" flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialFormState);
                    setIsEdit(false);
                  }}
                  className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 cursor-pointer"
                  disabled={isFormDisabled}
                >
                  {" "}
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isFormDisabled}
                  className={`px-6 py-1 text-sm rounded text-white ${isFormDisabled ? "opacity-50 cursor-not-allowed" : ""} ${isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                    }`}
                >
                  {isEdit ? "Update Member" : "Add Member"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
};

export default AddMember;
