import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";
import {
  createCollege,
  updateCollege,
} from "../../redux/slices/college/collegeSlice";
import { showSuccess, showError } from "../../utils/toastService";

const AddCollege = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.college);

  const [formData, setFormData] = useState({
    college_name: "",
    category: "",
    website: "",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
    affilated_to: "",
    status: "Active",
    contacts: [
      {
        contact_person: "",
        designation: "",
        email: "",
        mobile: "",
        alternate: "",
        landline: "",
      },
    ],
  });

  const [errors, setErrors] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const { isFormDisabled } = useRoleRights(PageNames.ADD_COLLEGE);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setFormData(location.state);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Pincode validation: numeric only, max 6 digits
    if (name === "pincode") {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 6);
    }

    setFormData({ ...formData, [name]: newValue });
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Phone numbers validation: numeric only, max 10 digits
    if (["mobile", "alternate", "landline"].includes(name)) {
      newValue = value.replace(/[^0-9]/g, "").slice(0, 10);
    }

    const updatedContacts = [...formData.contacts];
    updatedContacts[index][name] = newValue;
    setFormData({ ...formData, contacts: updatedContacts });

    // Clear error for this field if it exists
    const errorKey = `${name}_${index}`;
    if (errors[errorKey]) {
      setErrors({ ...errors, [errorKey]: null });
    }
  };

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [
        ...formData.contacts,
        {
          contact_person: "",
          designation: "",
          email: "",
          mobile: "",
          alternate: "",
          landline: "",
        },
      ],
    });
  };

  const removeContact = (index) => {
    const updatedContacts = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: updatedContacts });
  };

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    const pinRegex = /^[0-9]{6}$/;

    if (!formData.college_name?.trim())
      newErrors.college_name = "College Name is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.website?.trim()) newErrors.website = "Website is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.city) newErrors.city = "City is required";

    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!pinRegex.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (!formData.affilated_to?.trim())
      newErrors.affilated_to = "Affiliation is required";

    if (formData.contacts.length > 0) {
      formData.contacts.forEach((contact, index) => {
        // First contact mandatory fields
        if (index === 0) {
          if (!contact.contact_person?.trim())
            newErrors[`contact_person_${index}`] =
              "Contact Person Name is required";
          if (!contact.mobile?.trim()) {
            newErrors[`mobile_${index}`] = "Mobile is required";
          } else if (!phoneRegex.test(contact.mobile)) {
            newErrors[`mobile_${index}`] = "Mobile must be 10 digits";
          }
        } else if (contact.mobile?.trim() && !phoneRegex.test(contact.mobile)) {
          newErrors[`mobile_${index}`] = "Mobile must be 10 digits";
        }

        if (contact.email?.trim() && !emailRegex.test(contact.email)) {
          newErrors[`email_${index}`] = "Invalid email format";
        }
        if (contact.alternate?.trim() && !phoneRegex.test(contact.alternate)) {
          newErrors[`alternate_${index}`] = "Alternate No. must be 10 digits";
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      showError("Please fill all required fields");
      return;
    }

    const authUser = user || JSON.parse(localStorage.getItem("user"));
    const userId = authUser?._id || authUser?.id;
    const payload = { ...formData, user_id: userId };

    try {
      if (isEdit) {
        await dispatch(
          updateCollege({ id: formData._id, data: payload }),
        ).unwrap();
        showSuccess("College updated successfully ✅");
      } else {
        await dispatch(createCollege(payload)).unwrap();
        showSuccess("College added successfully ✅");
      }
      navigate("/collage/college-list");
    } catch (err) {
      showError(err || "Something went wrong");
    }
  };

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
                Add College Management
              </h2>
              <p className="text-sm text-blue-100">
                Seamlessly add new colleges to the system with comprehensive
                details and contact information.
              </p>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate("/collage/college-list")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              {" "}
              College List
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* ================= FORM ================= */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            {isEdit ? "Update College" : "Add New College"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className={`${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {/* COLLEGE NAME */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  College Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="college_name"
                  value={formData.college_name}
                  onChange={handleChange}
                  placeholder="Enter college name"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                />
                {errors.college_name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.college_name}
                  </p>
                )}
              </div>

              {/* CATEGORY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
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
              {/* WEBSITE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter website url"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
                {errors.website && (
                  <p className="text-red-500 text-xs mt-1">{errors.website}</p>
                )}
              </div>

              {/* AFFILIATED TO */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affiliated To <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="affilated_to"
                  value={formData.affilated_to}
                  onChange={handleChange}
                  placeholder="Enter affiliation"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
                {errors.affilated_to && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.affilated_to}
                  </p>
                )}
              </div>

              {/* ADDRESS */}
              <div className="">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  // rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* COUNTRY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                >
                  <option value="">Select Country</option>
                  <option value="India">India</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>
              {/* STATE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                >
                  <option value="">Select State</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Haryana">Haryana</option>
                </select>
                {errors.state && (
                  <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                )}
              </div>

              {/* CITY */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  required
                  disabled={isFormDisabled}
                >
                  <option value="">Select City</option>
                  <option value="Noida">Noida</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Gurgaon">Gurgaon</option>
                </select>
                {errors.city && (
                  <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                )}
              </div>

              {/* PINCODE */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PinCode <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>
              {/* STATUS */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status <span className="text-red-500">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  disabled={isFormDisabled}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* CONTACTS SECTION */}
            <div className="md:col-span-6 mt-4">
              <div className="flex justify-between items-center mb-2 border-b border-gray-200 pb-2">
                <h4 className="text-sm font-semibold text-gray-800">
                  Contact Persons
                </h4>
                <button
                  type="button"
                  onClick={addContact}
                  className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded border border-blue-200 hover:bg-blue-100"
                  disabled={isFormDisabled}
                >
                  + Add Contact
                </button>
              </div>

              {formData.contacts.map((contact, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-4 bg-gray-50 py-3 px-2 rounded border border-gray-200 relative"
                >
                  {formData.contacts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeContact(index)}
                      className="absolute top-1 right-1 text-red-500 hover:text-red-700"
                      title="Remove Contact"
                      disabled={isFormDisabled}
                    >
                      ✕
                    </button>
                  )}

                  {/* Contact Person */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Contact Person <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="contact_person"
                      value={contact.contact_person}
                      onChange={(e) => handleContactChange(index, e)}
                      placeholder="Name"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isFormDisabled}
                    />
                    {errors[`contact_person_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`contact_person_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Designation */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="designation"
                      value={contact.designation}
                      onChange={(e) => handleContactChange(index, e)}
                      placeholder="Designation"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isFormDisabled}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={contact.email}
                      onChange={(e) => handleContactChange(index, e)}
                      placeholder="Email"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isFormDisabled}
                    />
                    {errors[`email_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`email_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Mobile */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={contact.mobile}
                      onChange={(e) => handleContactChange(index, e)}
                      placeholder="Mobile"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isFormDisabled}
                    />
                    {errors[`mobile_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`mobile_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Alternate */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Alternate Mobile
                    </label>
                    <input
                      type="text"
                      name="alternate"
                      value={contact.alternate}
                      onChange={(e) => handleContactChange(index, e)}
                      placeholder="Alternate Mobile"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isFormDisabled}
                    />
                    {errors[`alternate_${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`alternate_${index}`]}
                      </p>
                    )}
                  </div>

                  {/* Landline */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Landline
                    </label>
                    <input
                      type="text"
                      name="landline"
                      value={contact.landline}
                      onChange={(e) => handleContactChange(index, e)}
                      placeholder="Landline"
                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="md:col-span-3 flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    college_name: "",
                    category: "",
                    category: "",
                    website: "",
                    address: "",
                    country: "",
                    state: "",
                    city: "",
                    pincode: "",
                    affilated_to: "",
                    status: "Active",
                    contacts: [
                      {
                        contact_person: "",
                        designation: "",
                        email: "",
                        mobile: "",
                        alternate: "",
                        landline: "",
                      },
                    ],
                  });
                  setIsEdit(false);
                }}
                className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
                disabled={isFormDisabled}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`px-6 py-1 text-sm rounded text-white ${
                  isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                } ${isFormDisabled || loading ? "opacity-50 cursor-not-allowed" : ""}`}
                disabled={isFormDisabled || loading}
              >
                {loading ? "Processing..." : isEdit ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCollege;
