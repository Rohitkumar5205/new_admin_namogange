import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../redux/slices/adminSlice";
import bannerReducer from "../redux/slices/home-banner/bannerSlice";
import initiativeReducer from "../redux/slices/initiativeSlice";
import galleryReducer from "../redux/slices/mediaImageSlice";
import galleryVideoReducer from "../redux/slices/galleryVideoSlice";
import categoryImageReducer from "../redux/slices/add_by_admin/categoryImageSlice";
import categoryVideoReducer from "../redux/slices/add_by_admin/categoryVideoSlice";
import statusOptionReducer from "../redux/slices/add_by_admin/statusOptionSlice";
import blogReducer from "../redux/slices/blog/blogSlice";
import categoryReducer from "../redux/slices/add_by_admin/categorySlice";
import occupationReducer from "../redux/slices/add_by_admin/occupationSlice";
import designationReducer from "../redux/slices/add_by_admin/designationSlice";
import departmentReducer from "../redux/slices/add_by_admin/departmentSlice";
import professionReducer from "../redux/slices/add_by_admin/professionSlice";
import universityReducer from "../redux/slices/add_by_admin/universitySlice";
import enquiryReducer from "../redux/slices/add_by_admin/enquirySlice";
import dataReducer from "../redux/slices/add_by_admin/dataSlice";
import objectiveReducer from "../redux/slices/objective/objectiveSlice";
import activityLogReducer from "../redux/slices/activityLog/activityLogSlice";
import organizationReducer from "../redux/slices/add_by_admin/organizationSlice";

const store = configureStore({
  reducer: {
    admin: adminReducer,
    banner: bannerReducer,
    initiative: initiativeReducer,
    gallery: galleryReducer,
    galleryVideo: galleryVideoReducer,
    categoryImage: categoryImageReducer,
    categoryVideo: categoryVideoReducer,
    status: statusOptionReducer,
    blog: blogReducer,
    category: categoryReducer,
    occupation: occupationReducer,
    designation: designationReducer,
    department: departmentReducer,
    profession: professionReducer,
    university: universityReducer,
    enquiry: enquiryReducer,
    data: dataReducer,
    objectives: objectiveReducer,
    activityLog: activityLogReducer,
    organization: organizationReducer,
  },
});

export default store;
