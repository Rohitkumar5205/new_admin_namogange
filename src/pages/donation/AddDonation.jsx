import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";
import { createDonation } from "../../redux/slices/donation/donationSlice";
import { showSuccess, showError } from "../../utils/toastService";

const donationOptions = {
  "Ann Sewa": [
    { label: "₹101 – One Meal", amount: 101 },
    { label: "₹501 – Food Package", amount: 501 },
    { label: "₹1100 – Full Ann Sewa", amount: 1100 },
    { label: "Custom Amount", amount: "custom" },
  ],
  "Moksha Sewa": [
    { label: "₹2100 – Last Rites Support", amount: 2100 },
    { label: "₹5100 – Complete Moksha Sewa", amount: 5100 },
    { label: "₹11000 – Premium Moksha Support", amount: 11000 },
    { label: "Custom Amount", amount: "custom" },
  ],
};

const AddDonation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const initialFormState = {
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    country: "India",
    state: "",
    city: "",
    address: "",
    SewaType: "",
    donationPackage: "",
    amount: "",
    pan: "",
    message: "",
    anonymous: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const { loading } = useSelector((state) => state.donation);
  const { isFormDisabled } = useRoleRights(PageNames.ADD_DONATION || "AddDonation");

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "phone" && !/^\d{0,10}$/.test(value)) return;
    if (name === "amount" && value < 0) return;

    if (name === "SewaType") {
      setFormData((prev) => ({
        ...prev,
        SewaType: value,
        donationPackage: "",
        amount: "",
      }));
      return;
    }

    if (name === "donationPackage") {
      const selected = donationOptions[formData.SewaType]?.find(
        (pkg) => pkg.label === value
      );

      setFormData((prev) => ({
        ...prev,
        donationPackage: value,
        amount: selected?.amount === "custom" ? "" : selected?.amount || "",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const user = JSON.parse(sessionStorage.getItem("user"));
    const dataToSend = {
      ...formData,
      created_by: user?.username || "Admin",
      user_id: user?._id,
    };

    dispatch(createDonation(dataToSend))
      .unwrap()
      .then(() => {
        showSuccess("Donation Added Successfully ✅");
        setFormData(initialFormState);
        navigate("/donation/donation-list");
      })
      .catch((err) => {
        showError("Error adding donation: " + err);
      });
  };

  const inputClass =
    "w-full border border-gray-300 rounded px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="">
      {/* HEADER */}
      <div className="relative overflow-hidden shadow-sm border border-gray-200 h-25 bg-gradient-to-r from-orange-400 via-cyan-400 to-blue-300">
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-between items-center px-6 py-4 h-25">
          <div className="flex gap-3">
            <div className="flex flex-col">
              <h2 className="text-xl font-semibold text-white">Add Donation Registration</h2>
              <p className="text-sm text-blue-100">Fill in the form to add a new donation record.</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => navigate("/donation/donation-list")}
              className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
            >
              Donation List
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {/* FORM */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">Add New Donation</h3>
          <form
            onSubmit={handleSubmit}
            className={`grid grid-cols-1 md:grid-cols-6 gap-4 ${isFormDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {/* PERSONAL DETAILS */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                name="fullName"
                value={formData.fullName}
                placeholder="Full Name"
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Email ID <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="Email Address"
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={formData.phone}
                placeholder="Mobile No"
                maxLength={10}
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
                disabled={isFormDisabled}
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            {/* DONATION DETAILS */}
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Choose Sewa <span className="text-red-500">*</span>
              </label>
              <select
                name="SewaType"
                value={formData.SewaType}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={isFormDisabled}
              >
                <option value="">Select Sewa</option>
                <option>Ann Sewa</option>
                <option>Moksha Sewa</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Donation Package <span className="text-red-500">*</span>
              </label>
              <select
                name="donationPackage"
                value={formData.donationPackage}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={!formData.SewaType || isFormDisabled}
              >
                <option value="">Select Package</option>
                {formData.SewaType &&
                  donationOptions[formData.SewaType].map((pkg, i) => (
                    <option key={i} value={pkg.label}>
                      {pkg.label}
                    </option>
                  ))}
              </select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Amount (₹) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                placeholder="Amount"
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">PAN (Optional)</label>
              <input
                name="pan"
                value={formData.pan}
                placeholder="PAN Number"
                className={inputClass}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>

            {/* LOCATION DETAILS */}
            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                name="country"
                value={formData.country}
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                State <span className="text-red-500">*</span>
              </label>
              <input
                name="state"
                value={formData.state}
                placeholder="State"
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                name="city"
                value={formData.city}
                placeholder="City"
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-sm text-gray-700 font-medium mb-1">
                Full Address <span className="text-red-500">*</span>
              </label>
              <input
                name="address"
                value={formData.address}
                placeholder="Full Address"
                className={inputClass}
                onChange={handleChange}
                required
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm text-gray-700 font-medium mb-1">Message (Optional)</label>
              <textarea
                name="message"
                value={formData.message}
                rows={3}
                placeholder="Write your message"
                className={inputClass}
                onChange={handleChange}
                disabled={isFormDisabled}
              />
            </div>

            <div className="md:col-span-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                name="anonymous"
                checked={formData.anonymous}
                onChange={handleChange}
                disabled={isFormDisabled}
                className="w-4 h-4 text-orange-500"
              />
              <label htmlFor="anonymous" className="text-sm text-gray-700">
                Donate Anonymously
              </label>
            </div>

            {/* ACTIONS */}
            <div className="md:col-span-6 flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => navigate("/donation/donation-list")}
                className="px-5 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isFormDisabled}
                className="px-6 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded disabled:bg-gray-400"
              >
                {loading ? "Adding..." : "Add Donation"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDonation;
