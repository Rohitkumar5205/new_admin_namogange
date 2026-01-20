import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPainting = () => {
  const navigate = useNavigate();
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

  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactChange = (index, e) => {
    const { name, value } = e.target;
    const updatedContacts = [...formData.contacts];
    updatedContacts[index][name] = value;
    setFormData({ ...formData, contacts: updatedContacts });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert(
      isEdit
        ? "College updated successfully ✅"
        : "College added successfully ✅"
    );
    setFormData({
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
    setIsEdit(false);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add Painting Management
        </h2>

        <button
          onClick={() => navigate("/painting-competition/painting-list")}
          className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
        >
          {" "}
          Painting List
        </button>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update Painting" : "Add New Painting"}
        </h3>

        <form onSubmit={handleSubmit}>
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
              />
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
              >
                <option value="">Select Category</option>
                <option value="Health">Health</option>
                <option value="Education">Education</option>
                <option value="Environment">Environment</option>
              </select>
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
              />
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
              />
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
              />
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
              >
                <option value="">Select Country</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
              </select>
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
              >
                <option value="">Select State</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Delhi">Delhi</option>
                <option value="Haryana">Haryana</option>
              </select>
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
              >
                <option value="">Select City</option>
                <option value="Noida">Noida</option>
                <option value="Delhi">Delhi</option>
                <option value="Gurgaon">Gurgaon</option>
              </select>
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
              />
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
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="designation"
                    value={contact.designation}
                    onChange={(e) => handleContactChange(index, e)}
                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select Designation</option>
                    <option value="Principal">Principal</option>
                    <option value="Dean">Dean</option>
                    <option value="HOD">HOD</option>
                  </select>
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
                  />
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
                  />
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
                  />
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
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-1 text-sm rounded text-white ${
                isEdit
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isEdit ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPainting;
