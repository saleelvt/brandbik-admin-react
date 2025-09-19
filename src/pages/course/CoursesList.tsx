/* eslint-disable @typescript-eslint/no-explicit-any */

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../reduxKit/store";
import { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

import { adminGetCourses, adminGetCourseById,adminCourseChangeStatus } from "../../reduxKit/actions/admin/courseActions";
import { deleteLessonAction } from "../../reduxKit/actions/admin/adminLessonAction";

export default function CoursesList() {

  const navigate=useNavigate()

  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.course);
  const [courses, setCourses] = useState<any[]>();
  const [detailedCourses, setDetailedCourses] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [statusLoading, setstatusLoading] = useState(false);


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const result = await dispatch(adminGetCourses()).unwrap();
        console.log("the course search results :", result.data);
        setCourses(result.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };

    fetchCourses(); 
  }, [dispatch]);

  const deleteLessonfunction = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        const response = await dispatch(deleteLessonAction(id)).unwrap();
        if (response.success) {
          alert('Lesson deleted successfully!');
          // Refresh the course details to show updated lessons list
          if (detailedCourses?._id) {
            const updatedCourseDetails = await dispatch(adminGetCourseById(detailedCourses._id)).unwrap();
            if (updatedCourseDetails.success) {
              setDetailedCourses(updatedCourseDetails.data);
            }
          }
        }
      } catch (error) {
        console.error("Error deleting lesson:", error);
        alert("Error deleting lesson. Please try again.");
      }
    }
  };

  const handleViewCourse = async (id: string) => {
    try {
      setModalLoading(true);
      setShowModal(true);
      console.log("before going to the course details ", id);

      const courseDetails = await dispatch(adminGetCourseById(id)).unwrap();
      console.log("Course details:", courseDetails);
      if (courseDetails.success) {
        setDetailedCourses(courseDetails.data);
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
      alert("Error fetching course details. Please try again.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleChangeStatusCourse = async (id: string) => {
    try {
      setstatusLoading(true)
      const courseDetails = await dispatch(adminCourseChangeStatus(id)).unwrap();
      if (courseDetails.success) {
        setDetailedCourses(courseDetails.data);
      setstatusLoading(false)
      const result = await dispatch(adminGetCourses()).unwrap();
        console.log("the course search results :", result.data);
        setCourses(result.data);
      }
    } catch (error) {
      console.error("Error changing the course status:", error);
      alert("Error changing course details. Please try again.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };
  const handleUpdateCourse = async (id: string) => {
    try {
       navigate("/updateCourse", { state: { id } });
    } catch (error:any) {
      
    console.error("Error changing the course status:", error);
      alert("Error Update course Please try again.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };
  const handleUpdateLesson = async (id: string) => {
    try {
       navigate("/updateLesson", { state: { id } });
    } catch (error:any) {
      
    console.error("Error changing the course status:", error);
      alert("Error Update course Please try again.");
      setShowModal(false);
    } finally {
      setModalLoading(false);
    }
  };




  const closeModal = () => {
    setShowModal(false);
    setDetailedCourses(null);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center text-lg">Loading courses...</div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl mx-auto p-2 sm:p-4 md:p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-4 sm:mb-6 text-center text-blue-700 tracking-tight">
          Courses
        </h2>
        <div className="mb-4 sm:mb-6 text-right">
          <a
            href="/add-course"
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-full font-bold shadow hover:bg-blue-700 transition"
          >
            Add New Course
          </a>
        </div>

        {courses && courses.length > 0 ? (
          <div className="space-y-6 sm:space-y-8">
            {courses.map((course: any, idx: number) => (
              <div key={course._id || idx} className="border-2 border-blue-100 p-2 sm:p-4 rounded-xl shadow-sm bg-blue-50">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6 items-start">
                  {course.imageUrl && (
                    <img
                      src={course.imageUrl}
                      alt="Course Thumbnail"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border shadow mb-2 md:mb-0"
                    />
                  )}
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
                      <h3 className="text-lg sm:text-2xl font-bold text-blue-700 mb-2 sm:mb-1">
                        {course.courseName}
                      </h3>
                      <div className="flex gap-2">


                       <button
     onClick={() => handleChangeStatusCourse(course._id)}
      disabled={statusLoading}
      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors 
        ${statusLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-400 hover:bg-red-700 text-white"}`}
    >
      {statusLoading && (
        <svg
          className="animate-spin h-4 w-4 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 100 16v-4l-3.5 3.5L12 24v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
      )}
      {statusLoading ? "Changing..." : "Change Status"}
    </button>
                        <button
                          onClick={() => handleViewCourse(course._id)}
                          className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleUpdateCourse(course._id)}
                          className="bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700 transition-colors"
                        >
                          UpdateCourse
                        </button>
                      </div>
                    </div>

                    <p className="mb-2 text-gray-700 text-sm sm:text-base">
                      {course.description}
                    </p>

                    {course.courseNameAr && (
                      <p className="mb-2 text-gray-600 text-sm italic">
                        Arabic: {course.courseNameAr}
                      </p>
                    )}

                    {course.descriptionAr && (
                      <p className="mb-2 text-gray-600 text-sm italic">
                        Arabic Description: {course.descriptionAr}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          course.status === "active"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {course.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="text-xs text-gray-500">
                      <div>Created: {new Date(course.createdAt).toLocaleDateString()}</div>
                      <div>Updated: {new Date(course.updatedAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No courses found.</p>
            <p className="text-gray-400 text-sm mt-2">Click "Add New Course" to create your first course.</p>
          </div>
        )}
      </div>

      {/* Enhanced Modal for Course Details */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
            {/* Modal Header - Fixed */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold">
                  {modalLoading ? "Loading..." : "Course Details"}
                </h3>
                {!modalLoading && detailedCourses && (
                  <p className="text-blue-100 text-sm mt-1">
                    {detailedCourses.lessons?.length || 0} lesson(s) available
                  </p>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-200 text-2xl sm:text-3xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
              {modalLoading ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading course details...</p>
                </div>
              ) : detailedCourses ? (
                <div className="p-4 sm:p-6 space-y-6">
                  {/* Course Information Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                      {detailedCourses.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={detailedCourses.imageUrl}
                            alt="Course Thumbnail"
                            className="w-full lg:w-56 h-48 sm:h-56 object-cover rounded-xl border-2 border-white shadow-lg"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <h4 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-2">
                            {detailedCourses.courseName}
                          </h4>
                          {detailedCourses.courseNameAr && (
                            <p className="text-lg sm:text-xl text-blue-600 italic">
                              {detailedCourses.courseNameAr}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Description</h5>
                            <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                              {detailedCourses.description}
                            </p>
                          </div>
                          
                          {detailedCourses.descriptionAr && (
                            <div>
                              <h5 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-1">Arabic Description</h5>
                              <p className="text-gray-700 italic text-sm sm:text-base leading-relaxed">
                                {detailedCourses.descriptionAr}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                              detailedCourses.status === "active"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-red-100 text-red-800 border border-red-200"
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              detailedCourses.status === "active" ? "bg-green-500" : "bg-red-500"
                            }`}></span>
                            {detailedCourses.status === "active" ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Created:</span>
                            {new Date(detailedCourses.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium mr-2">Updated:</span>
                            {new Date(detailedCourses.updatedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Lessons Section */}
                  {detailedCourses.lessons && detailedCourses.lessons.length > 0 ? (
                    <div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
                        <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-0">
                          Course Lessons
                          <span className="ml-2 text-base font-normal text-gray-500">
                            ({detailedCourses.lessons.length} lesson{detailedCourses.lessons.length !== 1 ? 's' : ''})
                          </span>
                        </h4>
                      </div>

                      <div className="grid gap-4 sm:gap-6">
                        {detailedCourses.lessons.map((lesson: any, index: number) => (
                          <div
                            key={lesson._id || index}
                            className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 hover:border-blue-200"
                          >
                            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                              {/* Lesson Thumbnail */}
                              {lesson.thumbnailUrl && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={lesson.thumbnailUrl}
                                    alt={`Lesson ${lesson.lessonNumber} Thumbnail`}
                                    className="w-full lg:w-40 h-32 lg:h-28 object-cover rounded-lg border border-gray-200"
                                  />
                                </div>
                              )}
                              
                              {/* Lesson Content */}
                              <div className="flex-1 min-w-0">
                                {/* Lesson Header */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                                  <div className="flex-1 min-w-0">
                                    <h5 className="text-lg sm:text-xl font-bold text-gray-800 mb-1">
                                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mr-3">
                                        {lesson.lessonNumber}
                                      </span>
                                      {lesson.lessonTitle}
                                    </h5>
                                    {lesson.lessonTitleAr && (
                                      <p className="text-gray-600 italic text-sm sm:text-base ml-11">
                                        {lesson.lessonTitleAr}
                                      </p>
                                    )}
                                  </div>
                                  
                                  {/* Duration Badge */}
                                  <div className="mt-2 sm:mt-0 sm:ml-4">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-blue-100 text-blue-800">
                                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                      </svg>
                                      {lesson.lessonDuration}
                                    </span>
                                  </div>
                                </div> 

                                {/* Lesson Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium mr-1">Lesson Date:</span>
                                    {new Date(lesson.lessonDate).toLocaleDateString()}
                                  </div>
                                  <div className="flex items-center">
                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                    </svg>
                                    <span className="font-medium mr-1">Created:</span>
                                    {new Date(lesson.createdAt).toLocaleDateString()}
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                                  {lesson.youtubeUrl && (
                                    <a
                                      href={lesson.youtubeUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                    >
                                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                      </svg>
                                      Watch Video
                                    </a>
                                  )}
                                  
                                  <button
                                    onClick={() => deleteLessonfunction(lesson._id)}
                                    className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                  >
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Lesson
                                  </button>
                                  
                                  <button
                                    onClick={() => handleUpdateLesson(lesson._id)}
                                    className="inline-flex items-center  px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
                                  >
                                    
                                    Update Lesson
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                      <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h5 className="text-lg font-medium text-gray-700 mb-2">No lessons available</h5>
                      <p className="text-gray-500 text-sm">This course doesn't have any lessons yet.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No course details available.</p>
                </div>
              )}
            </div>

            {/* Modal Footer - Fixed */}  
            <div className="bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}