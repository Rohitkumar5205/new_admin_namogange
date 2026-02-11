import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBlogs, deleteBlog } from "../../redux/slices/blog/blogSlice";
import { showSuccess } from "../../utils/toastService";
import adminBanner from "../../assets/banners/bg.jpg";
import useRoleRights from "../../hooks/useRoleRights";
import { PageNames } from "../../utils/constants";

const BlogList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading } = useSelector((state) => state.blog);
  const authUser = JSON.parse(localStorage.getItem("user"));

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const { canRead: canAdd, canWrite, canDelete } = useRoleRights(PageNames.BLOG_LIST);

  useEffect(() => {
    dispatch(getAllBlogs());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog({ id, user_id: authUser?.id })).then(() => {
        showSuccess("Blog deleted successfully");
      });
    }
  };

  const handleEdit = (blog) => {
    navigate("/blogs/add-blog", { state: { blog } });
  };

  // Pagination Logic
  const totalPages = Math.ceil((blogs?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = blogs?.slice(startIndex, endIndex) || [];

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 3;
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 2) pages.push("...");
      if (currentPage > 1 && currentPage < totalPages) pages.push(currentPage);
      if (currentPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="">
      {/* Header */}
      <div
        className="relative overflow-hidden shadow-sm border border-gray-200 h-25 
bg-gradient-to-r from-orange-500 via-cyan-500 to-blue-700"
      >
        <div className="absolute inset-0 bg-white/10"></div>
        <div className="relative flex justify-center items-center px-6 py-4 h-25">
          <div className="flex flex-col text-center">
            <h2 className="text-xl font-semibold text-white text-center">
              Blog List
            </h2>
            <p className="text-sm text-blue-100">Manage all blog posts.</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="space-y-3 p-5">
        <div className="relative overflow-x-auto bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-5 py-2 bg-gray-200 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-base font-medium text-gray-800">All Blogs</h3>
            {canAdd && (
              <button
                onClick={() => navigate("/blogs/add-blog")}
                className="px-4 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Add New Blog
              </button>
            )}
          </div>
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3">S.No</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Status</th>
                {(canWrite || canDelete) && <th className="px-4 py-3">Action</th>}
              </tr>
            </thead>
            <tbody>
              {loading && blogs?.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : (
                currentData.map((blog, index) => (
                  <tr key={blog._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-4 py-3">{startIndex + index + 1}.</td>
                    <td className="px-4 py-3 font-medium">{blog.title}</td>
                    <td className="px-4 py-3">{blog.author}</td>
                    <td className="px-4 py-3">{blog.category}</td>
                    <td className="px-4 py-3">
                      <img src={blog.image || "/placeholder.png"} alt={blog.title} className="h-10 w-10 object-cover rounded border" />
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${blog.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {blog.status}
                      </span>
                    </td>
                    {(canWrite || canDelete) && (
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-4">
                          {canWrite && <button onClick={() => handleEdit(blog)} className="text-green-600 hover:underline">Edit</button>}
                          {canDelete && <button onClick={() => handleDelete(blog._id)} className="text-red-600 hover:underline">Delete</button>}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-gray-500">Showing {startIndex + 1}–{Math.min(endIndex, blogs?.length || 0)} of {blogs?.length || 0}</span>
            <div className="flex space-x-1">
              <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="px-3 h-8 text-gray-600 border border-gray-300 rounded-l-lg hover:bg-gray-50">Prev</button>
              {getPageNumbers().map((p, i) => p === "..." ? (<span key={i} className="px-3 h-8 border">…</span>) : (<button key={p} onClick={() => setCurrentPage(p)} className={`px-3 h-8 border ${currentPage === p ? "bg-blue-50 text-blue-600" : "hover:bg-gray-50"}`}>{p}</button>))}
              <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="px-3 h-8 text-gray-600 border border-gray-300 rounded-r-lg hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogList;