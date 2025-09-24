// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { useState, ChangeEvent, FormEvent, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { AppDispatch, RootState } from "../../reduxKit/store";
// import { adminUpdateCourse } from "../../reduxKit/actions/admin/courseActions";
// import toast from "react-hot-toast";
// import { useLocation } from "react-router-dom";
// import { commonRequest } from "../../config/api";
// import { config } from "../../config/constants";


// type CourseData = {
//   courseName: string;
//   courseNameAr: string;
//   description: string;
//   descriptionAr: string;
//   imageUrl: string;
//   status: string;
// };
 
// const initialCourse: CourseData = {
//   courseName: "",
//   courseNameAr: "",
//   description: "",
//   descriptionAr: "",
//   imageUrl: "",
//   status: "active", 
// };


// export default function UpdateCourse() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch<AppDispatch>();
//   const location = useLocation();
//   const { id } = location.state || {};
//   const { error } = useSelector((state: RootState) => state.course || {});
//   const [course, setCourse] = useState<CourseData>(initialCourse);
//   const [errors, setErrors] = useState<Partial<CourseData>>({});
//   const [loading,setLoading]=useState(false)





// useEffect(() => {
//     // Fetch document details by ID and Language
  

//     if (id ) fetchDocument(); // Ensure both `id` and `language` are present
//   }, [id]);


//    const fetchDocument = async () => {
//       try {
//         const response = await commonRequest(
//           "GET",
//           `/admin/getCourseById/${id}`,
//           config,
//           {}
//         );
    
//         if(response.data.success){
//             setCourse(response.data.data)
//         }
//       } catch (error) {
//         console.error("Error fetching document details:", error);
//       }
//     };












//   // Handle input changes
//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setCourse((prev) => ({ ...prev, [name]: value }));
    
//     // Clear error when user starts typing
//     if (errors[name as keyof CourseData]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   // Handle image URL change
//   const handleImageUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setCourse((prev) => ({ ...prev, imageUrl: value }));
    
//     // Clear image error
//     if (errors.imageUrl) {
//       setErrors((prev) => ({ ...prev, imageUrl: "" }));
//     }
//   };

//   // Handle status toggle
//   const handleStatusToggle = () => {
//     setCourse((prev) => ({ 
//       ...prev, 
//       status: prev.status === "active" ? "inactive" : "active" 
//     }));
//   };

//   // Form validation
//   const validateForm = (): boolean => {
//     const newErrors: Partial<CourseData> = {};

//     if (!course.courseName.trim()) {
//       newErrors.courseName = "Course name is required";
//     }

//     if (!course.courseNameAr.trim()) {
//       newErrors.courseNameAr = "Arabic course name is required";
//     }

//     if (!course.description.trim()) {
//       newErrors.description = "Description is required";
//     }

//     if (!course.descriptionAr.trim()) {
//       newErrors.descriptionAr = "Arabic description is required";
//     }

//     if (!course.imageUrl.trim()) {
//       newErrors.imageUrl = "Image URL is required";
//     } else {
//       // Basic URL validation
//       try {
//         new URL(course.imageUrl);
//       } catch {
//         newErrors.imageUrl = "Please enter a valid image URL";
//       }
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   // Handle form submission
//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error("Please fill in all required fields");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("courseName", course.courseName);
//       formData.append("courseNameAr", course.courseNameAr);
//       formData.append("description", course.description);
//       formData.append("descriptionAr", course.descriptionAr);
//       formData.append("imageUrl", course.imageUrl);
//       formData.append("status", course.status);
//       setLoading(true)

//       const result = await dispatch(adminUpdateCourse({id:id,data:formData})).unwrap();
//       if(result.success){
//         toast.success(result.message)
//         setLoading(false)

//       }

//       console.log("my course Update result is : ",result);
      
      
//       // Reset form
//       if(result.success){
        
//         toast.success("Course Updated successfully!");
//         setCourse(initialCourse); 
//         setErrors({});
//       }
//     } catch (error: any) {
//       console.error("Course creation error:", error);
      
//       if (error?.message) {
//         toast.error(error.message);
//       } else if (typeof error === 'string') {
//         toast.error(error);
//       } else {
//         toast.error("Failed to Update course. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-lg">
//       <div className="flex justify-between items-center mb-8">
//         <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">
//           Add New Course
//         </h2>
//         <button
//           onClick={() => navigate("/courses")}
//           className="px-5 py-2 rounded-full font-semibold bg-purple-600 text-white shadow hover:bg-purple-700 transition-all duration-300"
//         >
//           View All Courses
//         </button>
//       </div>

//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* Course Names - English and Arabic */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-2 font-semibold text-blue-700">
//               Course Name (English) *
//             </label>
//             <input
//               type="text"
//               name="courseName"
//               value={course.courseName}
//               onChange={handleInputChange}
//               className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all ${
//                 errors.courseName ? 'border-red-400' : 'border-blue-200'
//               }`}
//               placeholder="Enter course name in English"
//               disabled={loading}
//             />
//             {errors.courseName && (
//               <p className="text-red-500 text-sm mt-1">{errors.courseName}</p>
//             )}
//           </div>

//           <div>
//             <label className="block mb-2 font-semibold text-blue-700">
//               Course Name (Arabic) *
//             </label>
//             <input
//               type="text"
//               name="courseNameAr"
//               value={course.courseNameAr}
//               onChange={handleInputChange}
//               className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all text-right ${
//                 errors.courseNameAr ? 'border-red-400' : 'border-blue-200'
//               }`}
//               placeholder="أدخل اسم الدورة بالعربية"
//               dir="rtl"
//               disabled={loading}
//             />
//             {errors.courseNameAr && (
//               <p className="text-red-500 text-sm mt-1">{errors.courseNameAr}</p>
//             )}
//           </div>
//         </div>

//         {/* Descriptions - English and Arabic */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block mb-2 font-semibold text-blue-700">
//               Description (English) *
//             </label>
//             <textarea
//               name="description"
//               value={course.description}
//               onChange={handleInputChange}
//               rows={4}
//               className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all resize-none ${
//                 errors.description ? 'border-red-400' : 'border-blue-200'
//               }`}
//               placeholder="Enter course description in English"
//               disabled={loading}
//             />
//             {errors.description && (
//               <p className="text-red-500 text-sm mt-1">{errors.description}</p>
//             )}
//           </div>

//           <div>
//             <label className="block mb-2 font-semibold text-blue-700">
//               Description (Arabic) *
//             </label>
//             <textarea
//               name="descriptionAr"
//               value={course.descriptionAr}
//               onChange={handleInputChange}
//               rows={4}
//               className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all resize-none text-right ${
//                 errors.descriptionAr ? 'border-red-400' : 'border-blue-200'
//               }`}
//               placeholder="أدخل وصف الدورة بالعربية"
//               dir="rtl"
//               disabled={loading}
//             />
//             {errors.descriptionAr && (
//               <p className="text-red-500 text-sm mt-1">{errors.descriptionAr}</p>
//             )}
//           </div>
//         </div>

//         {/* Image URL */}
//         <div>
//           <label className="block mb-2 font-semibold text-blue-700">
//             Course Image URL *
//           </label>
//           <input
//             type="url"
//             name="imageUrl"
//             value={course.imageUrl}
//             onChange={handleImageUrlChange}
//             className={`w-full border-2 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 transition-all ${
//               errors.imageUrl ? 'border-red-400' : 'border-blue-200'
//             }`}
//             placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
//             disabled={loading}
//           />
//           {errors.imageUrl && (
//             <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>
//           )}
          
//           {course.imageUrl && (
//             <div className="mt-3">
//               <img
//                 src={course.imageUrl}
//                 alt="Course preview"
//                 className="w-32 h-32 object-cover rounded-lg border-2 border-blue-200 shadow-sm"
//                 onError={(e) => {
//                   e.currentTarget.style.display = 'none';
//                 }}
//                 onLoad={(e) => {
//                   e.currentTarget.style.display = 'block';
//                 }}
//               />
//             </div>
//           )}
//         </div>

//         {/* Status Toggle */}
//         <div>
//           <label className="block mb-3 font-semibold text-blue-700">
//             Course Status
//           </label>
//           <div className="flex items-center space-x-4">
//             <span className={`font-medium ${course.status === 'active' ? 'text-blue-700' : 'text-gray-400'}`}>
//               Active
//             </span>
//             <button
//               type="button"
//               onClick={handleStatusToggle}
//               disabled={loading}
//               className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
//                 course.status === 'active' ? 'bg-blue-600' : 'bg-gray-300'
//               } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
//             >
//               <span
//                 className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
//                   course.status === 'active' ? 'translate-x-6' : 'translate-x-1'
//                 }`}
//               />
//             </button>
//             <span className={`font-medium ${course.status === 'inactive' ? 'text-blue-700' : 'text-gray-400'}`}>
//               Inactive
//             </span>
//           </div>
//           <p className="text-sm text-gray-600 mt-2">
//             {course.status === 'active' 
//               ? 'Course will be visible to students' 
//               : 'Course will be hidden from students'
//             }
//           </p>
//         </div>

//         {/* Submit Button */}
//         <div className="flex gap-4 pt-4">
//           <button
//             type="button"
//             onClick={() => navigate("/courses")}
//             className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-600 transition-all duration-300 disabled:opacity-50"
//             disabled={loading}
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             disabled={loading}
//             className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full font-bold shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:transform-none disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <div className="flex items-center justify-center">
//                 <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                 </svg>
//                 Updating Course...
//               </div>
//             ) : (
//               "Update Course"
//             )}
//           </button> 
//         </div>
//       </form>

//       {/* Error Display */}
//       {error && (
//         <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-700 text-sm">
//             {typeof error === 'string' ? error : 'An error occurred while creating the course'}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }