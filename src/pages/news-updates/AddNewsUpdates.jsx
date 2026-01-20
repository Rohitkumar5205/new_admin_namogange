import React, { useState } from "react";
import { Editor } from "primereact/editor";
import { useNavigate } from "react-router-dom";

const AddNewsUpdates = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    published_by: "",
    date: "",
    image: null,
    status: "Active",
    description: "",
  });

  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert(
      isEdit
        ? "News Updates updated successfully ✅"
        : "News Updates added successfully ✅"
    );
    setFormData({
      title: "",
      published_by: "",
      date: "",
      image: null,
      status: "Active",
      description: "",
    });
    setIsEdit(false);
  };

  return (
    <div className="space-y-6">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center bg-white rounded-md shadow-sm px-5 py-2 border border-gray-200">
        <h2 className="text-lg font-medium text-gray-800">
          Add News Updates Management
        </h2>
        {/* <p className="text-sm text-gray-600 mt-1 max-w-3xl">
          Add or update Trust Bodies content including title, image, link and
          status.
        </p> */}
        <button
          onClick={() => navigate("/news/news-updates-list")}
          className="bg-blue-500 hover:bg-blue-600 text-sm text-white font-medium py-1 px-4 rounded"
        >
          {" "}
          News Updates List
        </button>
      </div>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-base font-medium text-gray-800 mb-4">
          {isEdit ? "Update  News Updates" : "Add New News Updates"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-3"
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
              placeholder="Enter title"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          {/* PUBLISHED BY */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Published By <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="published_by"
              value={formData.published_by}
              onChange={handleChange}
              placeholder="Enter publisher name"
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          {/* DATE */}{" "}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          {/* IMAGE */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image
            </label>
            <input
              type="file"
              name="image"
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
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
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          {/* DESCRIPTION */}
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>

            <Editor
              value={formData.description}
              name="description"
              onTextChange={(e) =>
                setFormData({ ...formData, description: e.htmlValue })
              }
              style={{
                height: "200px",
                borderRadius: "4px", // rounded
                borderBottom: "1px solid #e5e7eb", // border-gray-200
                overflow: "hidden", // corners properly clip ho
              }}
              className="w-full text-sm outline-none"
            />
          </div>
          {/* ACTION BUTTONS */}
          <div className="md:col-span-3 flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() => {
                setFormData({
                  title: "",
                  published_by: "",
                  date: "",
                  image: null,
                  status: "Active",
                  description: "",
                });
                setIsEdit(false);
              }}
              className="px-5 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className={`px-6 py-1.5 text-sm rounded text-white ${
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

export default AddNewsUpdates;
